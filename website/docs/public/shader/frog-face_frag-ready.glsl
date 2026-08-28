// ShaderGun ready export: 2 Vars baked at 0.00s.
#ifdef GL_ES
  precision highp float;
#endif

uniform vec2 uScreenResolution;
uniform float uTime;

// Vars: min max default step. Every one can be keyframed from Cam.
// This shader has one fixed species, and the face lives on its own: the blinks,
// the eyes and the smile are cut out of the clock rather than driven from here, so
// only the build and the line are left to set.
// Bigger eyes, rounder skull, smaller muzzle.
const float uCuteness = 0.55; // Baked at 0.00s; Var was: 0.0 1.0 0.55 0.01
const float uOutline = 0.016; // Baked at 0.00s; Var was: 0.0 0.04 0.016 0.001

// A cartoon animal is a signed-distance drawing with proportions pulled off
// realism: one big skull, a small muzzle, huge eyes, and a hard ink line around
// the whole silhouette. This dedicated version keeps one species identity.

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdEllipse(vec2 p, vec2 r) {
  return (length(p / r) - 1.0) * min(r.x, r.y);
}

float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float smax(float a, float b, float k) {
  return -smin(-a, -b, k);
}

// An eye as a lens: two arcs of half-height lid meeting in corners at x = +/-r,
// the shape a lid leaves as it comes down. The ink outline is drawn by pushing
// this field out, so the field has to read as true distance or the outline changes
// width as the eye closes: a squashed ellipse compresses its field along x by the
// aspect ratio and drags the outline out across the face. Hence each point measures
// against whichever is nearer, the arc or the corner. At lid == r it reduces to
// length(p) - r, so an open eye stays round.
float sdLens(vec2 p, float r, float lid) {
  float arcR = (r * r + lid * lid) / (2.0 * lid);
  float off = arcR - lid;
  vec2 q = abs(vec2(p.y, p.x));
  return (q.y - r) * off > q.x * r
    ? length(vec2(q.x, q.y - r))
    : length(vec2(q.x + off, q.y)) - arcR;
}

// A crescent: the ground between two arcs struck through the same pair of tips,
// so it tapers to a point at each end instead of being cut off. c is the half
// chord, s the rise of the outer arc, t the thickness at the middle, and skew
// slides the lower arc sideways to throw the weight to one end. Both radii come
// out of the chord and rise, since a shallow arc needs a radius far larger than
// the mark is wide. p is measured from the outer arc's apex.
float sdCrescent(vec2 p, float c, float s, float t, float skew) {
  float outerR = (c * c + s * s) / (2.0 * s);
  float innerS = s - t;
  float innerR = (c * c + innerS * innerS) / (2.0 * innerS);
  return max(
    sdCircle(p + vec2(0.0, outerR), outerR),
    -sdCircle(p + vec2(-skew, t + innerR), innerR)
  );
}

// Base centred on the origin, apex at (0, h). Rounding r keeps the corners
// soft, which is most of what separates a cartoon ear from a warning sign.
float sdRoundTri(vec2 p, float w, float h, float r) {
  float side = (h * abs(p.x) + w * p.y - w * h) / sqrt(h * h + w * w);
  return smax(side, -p.y, r * 1.5) - r;
}

float fill(float d, float px) {
  return 1.0 - smoothstep(-px, px, d);
}

vec3 paint(vec3 dst, vec3 src, float a) {
  return mix(dst, src, clamp(a, 0.0, 1.0));
}

vec2 rot(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

struct Face {
  float headW;
  float headH;
  float cheek;
  float chin;
  float earSize;
  float earX;
  float earY;
  float earTilt;
  float earPoint;
  float eyeX;
  float eyeY;
  float eyeR;
  float eyeBulge;
  float irisR;
  float pupilSlit;
  float muzzleW;
  float muzzleH;
  float muzzleY;
  float noseY;
  float noseR;
  float noseW;
  float nostrilX;
  float nostrilY;
  float nostrilR;
  float nostrilTilt;
  float philtrum;
  float mouthW;
  float mouthY;
  float mouthSplit;
  float whisker;
  float stripes;
  float cheekPatch;
  vec3 fur;
  vec3 furDark;
  vec3 patchCol;
  vec3 iris;
  vec3 noseCol;
};

Face fixedFace() {
  Face f;
  f.headW = 0.48; f.headH = 0.29; f.cheek = 1.0; f.chin = 0.30;
  f.earSize = 0.03; f.earX = 0.34; f.earY = 0.14; f.earTilt = 0.0; f.earPoint = 0.0;
  f.eyeX = 0.28; f.eyeY = 0.21; f.eyeR = 0.135; f.eyeBulge = 1.0;
  f.irisR = 0.72; f.pupilSlit = 0.0;
  f.muzzleW = 0.20; f.muzzleH = 0.07; f.muzzleY = -0.20;
  f.noseY = -0.02; f.noseR = 0.012; f.noseW = 1.7; f.philtrum = 0.0;
  f.nostrilX = 0.137; f.nostrilY = 0.038; f.nostrilR = 0.0186; f.nostrilTilt = 0.44;
  f.mouthW = 0.32; f.mouthY = -0.11; f.mouthSplit = 0.0;
  f.whisker = 0.0; f.stripes = 0.0; f.cheekPatch = 0.0;
  f.fur = vec3(0.46, 0.76, 0.33);
  f.furDark = vec3(0.22, 0.48, 0.22);
  f.patchCol = vec3(0.91, 0.95, 0.72);
  f.iris = vec3(0.96, 0.79, 0.19);
  f.noseCol = vec3(0.19, 0.36, 0.18);
  return f;
}

// A parabola through the muzzle, thickened into a stroke and cut off at the
// corners. It reads only the distance of q.x from the arc's own centre, so
// pushing that centre out from zero splits one wide grin into the cat's pair
// without ever reopening the band. Blending a signed x against a folded one
// instead leaves the band open and it runs off the frame.
float mouthArc(vec2 q, float halfW, float sag, float thick) {
  float curve = sag * (q.x * q.x) / (halfW * halfW);
  float slope = 2.0 * sag * q.x / (halfW * halfW);
  float d = abs(q.y - curve) / sqrt(1.0 + slope * slope) - thick;
  return smax(d, abs(q.x) - halfW, 0.02);
}

float earShape(vec2 p, float size, float pointy) {
  float w = size * 0.68;
  float h = size * 1.5;
  float pointed = sdRoundTri(p, w, h, size * 0.14);
  float rounded = sdCircle(p - vec2(0.0, h * 0.34), w * 1.02);
  return mix(rounded, pointed, pointy);
}

// The life in the face comes out of the clock alone. Time is cut into slots and the
// index of a slot is hashed for one number per event, which is what makes the
// timing uneven: a wave would beat like a metronome, and reading the clock straight
// gives every eye the same drift. Nothing here is smooth for its own sake, since
// each of the three moves differently: a blink is a short shut, a look is a jump
// held a long while, a smile only ever creeps.
float hash1(float n) {
  return fract(sin(n * 127.1) * 43758.5453);
}

vec2 hash2(float n) {
  return fract(sin(vec2(n * 127.1, n * 311.7)) * 43758.5453);
}

// A lid falls faster than it lifts, so the shut is not symmetric: the closing edge
// is squared off against a rounder opening.
float blinkPulse(float dt, float shut) {
  float u = dt / shut;
  if (u < 0.0 || u > 1.0) return 0.0;
  return pow(sin(3.14159265 * u), 0.45);
}

// One blink to a slot, thrown somewhere inside it, and some of them doubled the way
// a real blink often is. A blink thrown late runs past the end of its slot, so the
// slot before is asked as well and the nearer shut wins.
float blinkAmount(float t) {
  float slot = 3.4;
  float here = floor(t / slot);
  float amount = 0.0;
  for (int k = 0; k < 2; k++) {
    float i = here - float(k);
    float start = i * slot + hash1(i) * (slot - 1.2);
    amount = max(amount, blinkPulse(t - start, 0.22));
    float twice = step(0.72, hash1(i + 0.37));
    amount = max(amount, twice * blinkPulse(t - start - 0.34, 0.19));
  }
  return clamp(amount, 0.0, 1.0);
}

// Where the eyes are aimed for one slot. Marks are drawn from the whole field of
// view but pulled back toward the middle by a second draw, so the frog is not
// forever staring off the edge of the frame.
vec2 gazeMark(float i) {
  return (hash2(i) * 2.0 - 1.0) * mix(0.30, 1.0, hash1(i + 5.1));
}

// Eyes flick and hold: a saccade is over in about a tenth of a second and the
// fixation after it lasts a good deal longer, so this settles onto each mark and
// then sits there, rather than sliding between them.
vec2 gazeAt(float t) {
  float slot = 1.7;
  float i = floor(t / slot);
  float settle = smoothstep(0.0, 0.11, t - i * slot);
  return mix(gazeMark(i - 1.0), gazeMark(i), settle) * 0.82;
}

// One number a slot, eased into the next, which gives a value that wanders instead
// of stepping.
float wander(float t) {
  float i = floor(t);
  float k = t - i;
  return mix(hash1(i), hash1(i + 1.0), k * k * (3.0 - 2.0 * k));
}

// A mouth held by muscle drifts on more than one clock, so a slow wander is laid
// under a quicker one. The range keeps the frog somewhere between mildly pleased
// and grinning, since the sulking end of the old Var read as a different animal.
float smileAt(float t) {
  float drift = 0.62 * wander(t / 2.6) + 0.38 * wander(t / 7.1 + 23.0);
  return mix(0.22, 0.95, drift);
}

void main() {
  // The face is drawn a little over half the width of its frame, which reads as
  // a lot of empty ground once the canvas is cropped to a circle in the login
  // card. Shrinking the coordinates scales the whole drawing up about the
  // centre. px is the antialiasing width in those same coordinates, so it has to
  // shrink with them, and the background is left on the uncropped frame so its
  // gradient and glow stay keyed to the canvas rather than zooming with the face.
  const float zoom = 1.55;
  vec2 frame = 2.0 * (gl_FragCoord.xy - 0.5 * uScreenResolution.xy) / uScreenResolution.y;
  vec2 uv = frame / zoom;
  float px = 1.6 / (uScreenResolution.y * zoom);

  Face f = fixedFace();

  float cute = clamp(uCuteness, 0.0, 1.0);
  f.eyeR *= mix(0.82, 1.22, cute);
  f.irisR = clamp(f.irisR * mix(0.92, 1.06, cute), 0.0, 0.92);
  f.headW *= mix(0.96, 1.05, cute);
  f.headH *= mix(0.97, 1.06, cute);
  f.chin *= mix(1.10, 0.86, cute);
  // The patch holds the size it has at mid dial rather than swelling on a plain
  // face and shrinking on a round one, which is what the figures above are: the
  // old scaling passed through 1.00 and 0.99 at the middle of the dial.
  // It rides as low as the chin allows, resting on the jaw with its lower edge cut
  // off by the silhouette, which the ink outline covers since that ink is laid
  // outside the body. The drop still has to follow the dial, since the jaw itself
  // sinks as the skull grows, and a patch of one size cannot reach both jaws.
  f.muzzleY -= mix(0.028, 0.050, cute);
  f.noseY *= mix(1.06, 0.94, cute);

  vec2 look = gazeAt(uTime);

  // The eye domes carry the silhouette higher above the origin than the chin
  // falls below it, so the drawing has to be dropped to sit level in the round
  // crop, where an off-centre face shows up as an uneven margin.
  vec2 p = uv - vec2(0.0, -0.045);

  float blink = blinkAmount(uTime);

  // Silhouette: skull, cheek puffs and chin fused into one mass, then the ears
  // welded on so a single ink line can trace the lot.
  float head = sdEllipse(p, vec2(f.headW, f.headH));
  float cheekL = sdEllipse(p - vec2(-f.headW * 0.60, -0.10), vec2(f.headW * 0.44, f.headH * 0.44));
  float cheekR = sdEllipse(p - vec2(f.headW * 0.60, -0.10), vec2(f.headW * 0.44, f.headH * 0.44));
  head = smin(head, min(cheekL, cheekR), 0.11 * f.cheek);
  float chin = sdEllipse(p - vec2(0.0, -f.headH * 0.74), vec2(f.headW * 0.36, f.headH * 0.46 * f.chin));
  head = smin(head, chin, 0.10);

  // A frog's ears are nubs sunk in the skull, so they only round the silhouette
  // where it meets the eye domes. Nothing is gained by perking or twitching them.
  vec2 pEarL = rot(p - vec2(-f.earX, f.earY), -f.earTilt);
  vec2 pEarR = rot(p - vec2(f.earX, f.earY), f.earTilt);
  float earL = earShape(pEarL, f.earSize, f.earPoint);
  float earR = earShape(pEarR, f.earSize, f.earPoint);
  float ears = min(earL, earR);

  vec2 eyePosL = vec2(-f.eyeX, f.eyeY);
  vec2 eyePosR = vec2(f.eyeX, f.eyeY);
  // Adding a constant to a distance field shrinks it away, which retires the
  // frog's eye domes from the silhouette on the species that sit flat.
  float retire = (1.0 - f.eyeBulge) * 2.0;
  float domes = min(
    sdCircle(p - eyePosL, f.eyeR * 1.3) + retire,
    sdCircle(p - eyePosR, f.eyeR * 1.3) + retire
  );

  float body = smin(head, ears, 0.035);
  body = smin(body, domes, 0.05);

  vec3 ink = vec3(0.08, 0.07, 0.10);
  vec3 bg = mix(vec3(0.09, 0.12, 0.17), vec3(0.15, 0.21, 0.27), smoothstep(-1.0, 1.0, frame.y));
  bg += 0.12 * exp(-length(frame) * 1.3) * mix(f.fur, vec3(1.0), 0.45);
  vec3 color = bg;

  float bodyMask = fill(body, px);
  color = paint(color, ink, fill(body - uOutline, px));

  float lift = smoothstep(-f.headH * 1.1, f.headH * 1.5, p.y);
  vec3 furCol = mix(f.furDark, f.fur, 0.34 + 0.66 * lift);
  color = paint(color, furCol, bodyMask);

  float innerL = earShape(pEarL, f.earSize * 0.56, f.earPoint);
  float innerR = earShape(pEarR, f.earSize * 0.56, f.earPoint);
  vec3 innerCol = mix(f.furDark, f.noseCol, 0.55);
  // An ear this small is a nub buried in the skull, so it never reaches the
  // silhouette and the inner colour would only read as a speck on the face.
  float earLining = smoothstep(0.04, 0.08, f.earSize);
  color = paint(color, innerCol, min(fill(innerL, px), 1.0) * bodyMask * earLining);
  color = paint(color, innerCol, min(fill(innerR, px), 1.0) * bodyMask * earLining);

  float stripeD = min(
    sdCapsule(p, vec2(0.0, f.headH * 0.52), vec2(0.0, f.headH * 0.94), 0.021),
    min(
      sdCapsule(p, vec2(-0.10, f.headH * 0.46), vec2(-0.14, f.headH * 0.86), 0.019),
      sdCapsule(p, vec2(0.10, f.headH * 0.46), vec2(0.14, f.headH * 0.86), 0.019)
    )
  );
  color = paint(color, f.furDark, fill(stripeD, px) * f.stripes * bodyMask);

  float patchD = sdEllipse(p - vec2(0.0, f.muzzleY), vec2(f.muzzleW, f.muzzleH));
  float cheekPatchL = sdEllipse(p - vec2(-f.headW * 0.58, -0.04), vec2(f.headW * 0.30, f.headH * 0.40));
  float cheekPatchR = sdEllipse(p - vec2(f.headW * 0.58, -0.04), vec2(f.headW * 0.30, f.headH * 0.40));
  patchD = smin(patchD, min(cheekPatchL, cheekPatchR) + (1.0 - f.cheekPatch) * 2.0, 0.08);
  color = paint(color, f.patchCol, fill(patchD, px) * bodyMask * 0.96);

  // Eyes. The lids come down as arcs across a round eye, so the ink outline keeps
  // the width it has when the eye is wide open.
  float lid = f.eyeR * mix(1.0, 0.05, blink);
  float eyeL = sdLens(p - eyePosL, f.eyeR, lid);
  float eyeRd = sdLens(p - eyePosR, f.eyeR, lid);
  color = paint(color, ink, fill(min(eyeL, eyeRd) - 0.012, px));
  vec3 sclera = vec3(0.97, 0.97, 0.99);
  color = paint(color, sclera, fill(eyeL, px));
  color = paint(color, sclera, fill(eyeRd, px));

  vec2 gaze = look * vec2(f.eyeR * 0.32, f.eyeR * 0.26);
  float irisRad = f.eyeR * f.irisR;
  float irisL = smax(sdCircle(p - eyePosL - gaze, irisRad), eyeL, 0.006);
  float irisRd = smax(sdCircle(p - eyePosR - gaze, irisRad), eyeRd, 0.006);
  color = paint(color, f.iris, fill(irisL, px));
  color = paint(color, f.iris, fill(irisRd, px));

  vec2 slitR = vec2(irisRad * 0.20, irisRad * 0.78);
  vec2 roundR = vec2(irisRad * 0.52, irisRad * 0.52);
  vec2 pupilR = mix(roundR, slitR, f.pupilSlit);
  float pupilL = smax(sdEllipse(p - eyePosL - gaze, pupilR), eyeL, 0.004);
  float pupilRd = smax(sdEllipse(p - eyePosR - gaze, pupilR), eyeRd, 0.004);
  color = paint(color, vec3(0.05, 0.04, 0.06), fill(pupilL, px));
  color = paint(color, vec3(0.05, 0.04, 0.06), fill(pupilRd, px));

  vec2 sparkA = vec2(-0.35, 0.38) * f.eyeR;
  vec2 sparkB = vec2(0.30, -0.34) * f.eyeR;
  float sparkBig = f.eyeR * 0.20;
  float sparkSmall = f.eyeR * 0.10;
  float glint = min(
    min(sdCircle(p - eyePosL - gaze - sparkA, sparkBig),
        sdCircle(p - eyePosR - gaze - sparkA, sparkBig)),
    min(sdCircle(p - eyePosL - gaze - sparkB, sparkSmall),
        sdCircle(p - eyePosR - gaze - sparkB, sparkSmall))
  );
  float eyeMask = max(fill(eyeL, px), fill(eyeRd, px));
  color = paint(color, vec3(1.0), fill(glint, px) * eyeMask * (1.0 - blink));

  // A frog has no muzzle to hang a nose off. Its snout carries two slits set wide
  // apart, each hooded by a fold and resting on a crease, with a pale lip patch
  // between them. Folding x about the centre draws one side and gets the other
  // free, mirroring the tilt with it.
  float nr = f.nostrilR;
  vec2 nq = vec2(abs(p.x) - f.nostrilX, p.y - f.nostrilY);

  // The crease under the slit is a bowl, so it is struck in a flipped frame.
  float crease = sdCrescent(vec2(nq.x - nr * 0.27, -nq.y - nr * 2.26), nr * 1.45, nr * 1.18, nr * 0.59, 0.0);
  color = paint(color, f.furDark, fill(crease, px) * bodyMask * 0.50);

  // The lip patch between the slits is the same crescent drawn wide, hung from an
  // almost flat top so it sags in the middle, and pushed out to keep weight in the
  // ends rather than letting them taper away. A wedge bitten out of the top then
  // leaves the notch, and with it the two lobes either side: one arc alone can only
  // curve one way, so it can dip in the middle or bulge at the ends, never both.
  float lip = sdCrescent(vec2(p.x, f.nostrilY - nr * 3.21 - p.y), nr * 2.25, nr * 2.08, nr * 1.88, 0.0) - nr * 0.55;
  float notch = (p.y - (f.nostrilY - nr * 1.72) - 0.5 * abs(p.x)) * 0.894;
  color = paint(color, f.patchCol, fill(smax(lip, notch, nr * 0.25), px) * bodyMask * 0.18);

  float ct = cos(f.nostrilTilt);
  float st = sin(f.nostrilTilt);
  // The slit and the fold hooding it ride lower than the frame the crease and lip
  // patch hang from, which tucks the slit down close to the crease beneath it
  // without dragging the crease or the patch along.
  vec2 tq = mat2(ct, st, -st, ct) * (nq + vec2(0.0, nr * 0.35));
  color = paint(color, ink, fill(sdEllipse(tq, vec2(nr, nr * 0.50)), px) * bodyMask);

  // The fold is struck in the slit's own tilted frame so that it lies along the
  // slit rather than across it, and its lower arc is slid outboard to leave the
  // weight inboard, where a fold of skin hangs. The offset below is that frame's
  // reading of an apex set a third of a radius outboard of the slit's middle and
  // 1.54 above it, which is why it carries a turn of the tilt in it. That apex
  // leaves the mark itself a touch inboard, since the arc trails a longer tail off
  // its inboard end. It still has to cap the slit, since a fold sitting well inboard
  // hoods the snout beside the nostril instead, and it has to stay a shallow arc
  // riding clear of the slit's upper edge, since a deeper one wraps the flank and
  // the pair close up into an eye and lid.
  float fold = sdCrescent(tq - vec2(-nr * 0.386, nr * 1.524), nr * 1.15, nr * 0.79, nr * 0.27, nr * 0.35);
  color = paint(color, ink, fill(fold, px) * bodyMask);

  float philtrumD = sdCapsule(p, vec2(0.0, f.noseY - f.noseR * 1.3), vec2(0.0, f.mouthY), 0.011);
  color = paint(color, mix(f.patchCol, ink, 0.55), fill(philtrumD, px) * f.philtrum * bodyMask);

  // The mouth is a parabola through the muzzle. Folding x around the centre
  // splits it into the cat's two arcs; unfolded it is the frog's wide grin.
  // A wide grin needs more rise than a small one to read as the same smile,
  // and split arcs sit deeper for their width, so they get eased off or the
  // muzzle grows fangs instead of a mouth.
  float smileAmount = (0.35 + smileAt(uTime)) / 0.9;
  float archOut = f.mouthW * 0.5 * f.mouthSplit;
  float halfW = f.mouthW - archOut;
  float sag = (0.037 + 0.20 * halfW) * smileAmount * mix(1.0, 0.58, f.mouthSplit);
  float mouth = mouthArc(
    vec2(abs(p.x) - archOut, p.y - f.mouthY),
    halfW,
    sag,
    0.012 + 0.02 * halfW
  );
  color = paint(color, mix(ink, f.noseCol, 0.25), fill(mouth, px));

  float whiskerD = 1.0;
  float whiskerR = 0.006;
  for (int i = 0; i < 3; i++) {
    float k = float(i);
    float y0 = -0.04 - k * 0.045;
    float y1 = 0.02 - k * 0.085;
    whiskerD = min(whiskerD, sdCapsule(p, vec2(-f.headW * 0.70, y0), vec2(-f.headW * 1.75, y1), whiskerR));
    whiskerD = min(whiskerD, sdCapsule(p, vec2(f.headW * 0.70, y0), vec2(f.headW * 1.75, y1), whiskerR));
  }
  color = paint(color, mix(f.patchCol, vec3(1.0), 0.5), fill(whiskerD, px) * f.whisker * 0.9);

  gl_FragColor = vec4(color, 1.0);
}
