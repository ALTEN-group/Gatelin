// ShaderGun ready export: 2 Vars baked at 114.43s.
#ifdef GL_ES
  precision highp float;
#endif

uniform vec2 uScreenResolution;
uniform float uTime;

// Vars: min max default step. Every one can be keyframed from Cam.
// This shader has one fixed species, and the face lives on its own: the blinks,
// the eyes, the smile, the jaw and the pupil are cut out of the clock rather than
// driven from here, so only the build and the line are left to set.
// Bigger eyes, rounder skull, smaller muzzle.
const float uCuteness = 0.55; // Baked at 114.43s; Var was: 0.0 1.0 0.55 0.01
const float uOutline = 0.016; // Baked at 114.43s; Var was: 0.0 0.04 0.016 0.001

// A cartoon animal is a signed-distance drawing with proportions pulled off
// realism: one big skull, a small muzzle, huge eyes, and a hard ink line around
// the whole silhouette. This dedicated version keeps one species identity.

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdEllipse(vec2 p, vec2 r) {
  return (length(p / r) - 1.0) * min(r.x, r.y);
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
  // A lid no taller than the eye puts the arc centres on the far side of the middle,
  // so this offset cannot truly be negative. It can round negative on a wide open eye,
  // where the two are equal, and that swaps the branches below: every point on the row
  // through the eye's middle would then measure itself against the corner and read as
  // outside, wiping the eye out along one row of pixels.
  float off = max(arcR - lid, 0.0);
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

float fill(float d, float px) {
  return 1.0 - smoothstep(-px, px, d);
}

vec3 paint(vec3 dst, vec3 src, float a) {
  return mix(dst, src, clamp(a, 0.0, 1.0));
}

struct Face {
  float headW;
  float headH;
  float chin;
  float earSize;
  float earX;
  float earY;
  float eyeX;
  float eyeY;
  float eyeR;
  float irisR;
  float muzzleW;
  float muzzleH;
  float muzzleY;
  float nostrilX;
  float nostrilY;
  float nostrilR;
  float nostrilTilt;
  float mouthW;
  float mouthY;
  vec3 fur;
  vec3 furDark;
  vec3 patchCol;
  vec3 iris;
  vec3 mouthCol;
  vec3 tongueCol;
  vec3 lipCol;
};

Face fixedFace() {
  Face f;
  f.headW = 0.48; f.headH = 0.29; f.chin = 0.30;
  f.earSize = 0.03; f.earX = 0.34; f.earY = 0.14;
  f.eyeX = 0.28; f.eyeY = 0.21; f.eyeR = 0.135;
  f.irisR = 0.72;
  f.muzzleW = 0.46; f.muzzleH = 0.110; f.muzzleY = -0.20;
  f.nostrilX = 0.137; f.nostrilY = 0.038; f.nostrilR = 0.0186; f.nostrilTilt = 0.44;
  f.mouthW = 0.32; f.mouthY = -0.11;
  f.fur = vec3(0.46, 0.76, 0.33);
  f.furDark = vec3(0.22, 0.48, 0.22);
  f.patchCol = vec3(0.91, 0.95, 0.72);
  f.iris = vec3(0.96, 0.79, 0.19);
  f.mouthCol = vec3(0.58, 0.02, 0.03);
  f.tongueCol = vec3(0.92, 0.40, 0.48);
  f.lipCol = vec3(0.10, 0.32, 0.09);
  return f;
}

// A frog's ears are nubs sunk in the skull. The mix that used to point them is
// held at zero, so this is only the round end of that mix: a circle sitting a
// little above the base of where a pointed ear would have stood.
float earShape(vec2 p, float size) {
  float w = size * 0.68;
  float h = size * 1.5;
  return sdCircle(p - vec2(0.0, h * 0.34), w * 1.02);
}

// The silhouette in one piece: skull, cheek puffs and chin fused into one mass, then
// the ears and the eye domes welded on, so a single ink line can trace the lot.
float bodyField(vec2 p, Face f) {
  float head = sdEllipse(p, vec2(f.headW, f.headH));
  float cheekL = sdEllipse(p - vec2(-f.headW * 0.60, -0.10), vec2(f.headW * 0.44, f.headH * 0.44));
  float cheekR = sdEllipse(p - vec2(f.headW * 0.60, -0.10), vec2(f.headW * 0.44, f.headH * 0.44));
  head = smin(head, min(cheekL, cheekR), 0.11);
  float chin = sdEllipse(p - vec2(0.0, -f.headH * 0.74), vec2(f.headW * 0.36, f.headH * 0.46 * f.chin));
  head = smin(head, chin, 0.10);

  // A frog's ears are nubs sunk in the skull, so they only round the silhouette where
  // it meets the eye domes. The tilt that used to perk them is zero, which leaves the
  // rotation an identity, so the nubs are measured in place.
  float earL = earShape(p - vec2(-f.earX, f.earY), f.earSize);
  float earR = earShape(p - vec2(f.earX, f.earY), f.earSize);

  float domes = min(
    sdCircle(p - vec2(-f.eyeX, f.eyeY), f.eyeR * 1.3),
    sdCircle(p - vec2(f.eyeX, f.eyeY), f.eyeR * 1.3)
  );

  return smin(smin(head, min(earL, earR), 0.035), domes, 0.05);
}

// The life in the face comes out of the clock alone. Time is cut into slots and the
// index of a slot is hashed for one number per event, which is what makes the
// timing uneven: a wave would beat like a metronome, and reading the clock straight
// gives every eye the same drift. Nothing here is smooth for its own sake, since
// each of the five moves differently: a blink is a short shut, a look is a jump held
// a long while, a smile only ever creeps, a jaw drops and comes back on the weight of
// itself, and a pupil swells and shrinks on a clock of its own.
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

// How far the corners of the mouth are curled, which is the smile and nothing else:
// how far the mouth stands open is the jaw's business, below. A mouth held by muscle
// drifts on more than one clock, so a slow wander is laid under a quicker one. The
// range keeps the frog somewhere between mildly pleased and grinning, since the
// sulking end of the old Var read as a different animal.
float smileAt(float t) {
  float drift = 0.62 * wander(t / 2.6) + 0.38 * wander(t / 7.1 + 23.0);
  return mix(0.22, 0.95, drift);
}

// How much of the iris the black of the eye takes. A pupil is muscle, so it drifts
// rather than stepping, on a clock of its own so it is not locked to the gaze or the
// blink. One wander is enough: mixing two would keep it near the middle for long
// stretches, which is exactly the size it already held. The range is a short travel
// around the size the pupil had when it was still, so the eye keeps a yellow ring at
// both ends rather than going from a pinprick to a black disc.
float pupilScaleAt(float t) {
  return mix(0.42, 0.64, wander(t / 2.2 + 14.0));
}

// One event on the jaw: a run out, a hold at the end of it, and a run back, each
// timed on its own, since nothing a jaw does takes as long coming back as it did
// going out. The hold is the part that reads as a pose rather than a twitch.
float jawPulse(float dt, float fall, float hold, float rise) {
  if (dt < 0.0) return 0.0;
  if (dt < fall) return smoothstep(0.0, fall, dt);
  if (dt < fall + hold) return 1.0;
  return 1.0 - smoothstep(fall + hold, fall + hold + rise, dt);
}

// How far the mouth stands open, which is its own clock and not the smile's. A
// drift carries the resting opening, and slots of time are hashed for the two things
// a jaw does over the top of it. Some slots throw a shut, which takes the mouth all
// the way down to a closed seam and holds it there a beat, since a frog spends as
// much of its time with its mouth shut as open. Others throw a gape, the mouth widened
// to its fullest and eased off again. One or the other to a slot at most, and a slot is
// left empty often enough that the drift gets the face to itself now and then. The slot
// before is asked as well, so an event thrown late is not cut off at the boundary.
//
// The three move at speeds that are nothing like each other, and that is the whole of
// what tells them apart. Only shutting the mouth is quick: a jaw falls under its own
// weight and is sprung open by muscle, and that is over in a fraction of a second. A
// gape is worked by the same muscle in both directions with the jaw's weight against
// it, so it swells and eases off across the better part of a second either way; struck
// on the shut's timings it read as a flinch rather than a mouth opening wider. The
// drift is slower again, since between events the mouth is only settling, and a resting
// opening that shifted at anything near the pace of a jaw read as a mumble.
float mouthOpenAt(float t) {
  float drift = 0.60 * wander(t / 5.2) + 0.40 * wander(t / 13.0 + 11.0);
  float rest = mix(0.34, 1.0, drift);
  // Long enough a slot to leave the drift a stretch of open ground either side of the
  // event in it, and the throw inside the slot is held clear of the end by the longest
  // an event can run, so a gape is never cut in half by the slot after it.
  float slot = 3.6;
  float here = floor(t / slot);
  float shut = 0.0;
  float gape = 0.0;
  for (int k = 0; k < 2; k++) {
    float i = here - float(k);
    float kind = hash1(i + 0.19);
    float start = i * slot + hash1(i) * (slot - 2.6);
    shut = max(shut, step(0.52, kind) * jawPulse(t - start, 0.09, mix(0.20, 1.00, hash1(i + 3.3)), 0.28));
    gape = max(gape, step(kind, 0.28) * jawPulse(t - start, mix(0.45, 0.85, hash1(i + 5.9)), mix(0.15, 0.55, hash1(i + 7.7)), mix(0.55, 1.00, hash1(i + 9.1))));
  }
  return clamp(mix(rest, 1.0, gape) * (1.0 - shut), 0.0, 1.0);
}

void main() {
  // The face is drawn a little over half the width of its frame, which reads as
  // a lot of empty ground wherever the canvas is cropped to a circle. Shrinking
  // the coordinates scales the whole drawing up about the centre. px is the
  // antialiasing width in those same coordinates, so it has to shrink with
  // them, and the background is left on the uncropped frame so its gradient and
  // glow stay keyed to the canvas rather than zooming with the face.
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
  // The patch is a pale chin rather than a muzzle, since the open mouth has taken the
  // ground it used to sit on. It is cut wide and deep enough that the silhouette takes
  // its sides and its bottom and only its top edge is its own, which is the broad pale
  // throat a tree frog wears rather than the sliver of pale it used to leave on the
  // jaw. That top edge is hung to run just under the floor of the mouth at rest, so the
  // mouth sits on green and the pale starts where the mouth ends: a mouth gaping past
  // it lays the dark of the throat over the pale, and a mouth shut well above it leaves
  // the pale whole. It holds one size across the dial, since the pale is a marking on
  // the animal and not a part of its build. The drop still has to follow the dial, since
  // the jaw sinks as the skull grows.
  f.muzzleY -= mix(0.080, 0.115, cute);

  vec2 look = gazeAt(uTime);

  // The eye domes carry the silhouette higher above the origin than the chin
  // falls below it, so the drawing has to be dropped to sit level in the round
  // crop, where an off-centre face shows up as an uneven margin.
  vec2 p = uv - vec2(0.0, -0.045);

  float blink = blinkAmount(uTime);
  // The jaw is read here rather than down with the mouth it draws, since the pale
  // throat is laid on the face well before the mouth and has to follow it.
  float open = mouthOpenAt(uTime);

  float body = bodyField(p, f);

  vec2 eyePosL = vec2(-f.eyeX, f.eyeY);
  vec2 eyePosR = vec2(f.eyeX, f.eyeY);

  vec3 ink = vec3(0.08, 0.07, 0.10);
  vec3 bg = mix(vec3(0.09, 0.12, 0.17), vec3(0.15, 0.21, 0.27), smoothstep(-1.0, 1.0, frame.y));
  bg += 0.12 * exp(-length(frame) * 1.3) * mix(f.fur, vec3(1.0), 0.45);
  vec3 color = bg;

  float bodyMask = fill(body, px);
  color = paint(color, ink, fill(body - uOutline, px));

  float lift = smoothstep(-f.headH * 1.1, f.headH * 1.5, p.y);
  vec3 furCol = mix(f.furDark, f.fur, 0.34 + 0.66 * lift);
  color = paint(color, furCol, bodyMask);

  // The throat is skin slung under the jaw, so it goes down with the jaw and rides
  // back up as the mouth shuts. Only its top edge is on show, the silhouette holding
  // the rest, so the whole of the movement reads there: a little travel is enough, and
  // more than this ate the pale away to nothing at a full gape.
  float patchY = f.muzzleY - mix(0.0, 0.026, open);
  float patchD = sdEllipse(p - vec2(0.0, patchY), vec2(f.muzzleW, f.muzzleH));
  color = paint(color, f.patchCol, fill(patchD, px) * bodyMask * 0.96);

  // Eyes. The lids come down as arcs across a round eye, so the ink outline keeps
  // the width it has when the eye is wide open.
  float lid = f.eyeR * mix(1.0, 0.05, blink);
  float eyeL = sdLens(p - eyePosL, f.eyeR, lid);
  float eyeRd = sdLens(p - eyePosR, f.eyeR, lid);
  color = paint(color, ink, fill(min(eyeL, eyeRd) - 0.012, px));
  vec3 sclera = vec3(0.97, 0.97, 0.99);
  float fillEyeL = fill(eyeL, px);
  float fillEyeR = fill(eyeRd, px);
  color = paint(color, sclera, fillEyeL);
  color = paint(color, sclera, fillEyeR);

  vec2 gaze = look * vec2(f.eyeR * 0.32, f.eyeR * 0.26);
  float irisRad = f.eyeR * f.irisR;
  float irisL = smax(sdCircle(p - eyePosL - gaze, irisRad), eyeL, 0.006);
  float irisRd = smax(sdCircle(p - eyePosR - gaze, irisRad), eyeRd, 0.006);
  color = paint(color, f.iris, fill(irisL, px));
  color = paint(color, f.iris, fill(irisRd, px));

  float pupilRad = irisRad * pupilScaleAt(uTime);
  float pupilL = smax(sdCircle(p - eyePosL - gaze, pupilRad), eyeL, 0.004);
  float pupilRd = smax(sdCircle(p - eyePosR - gaze, pupilRad), eyeRd, 0.004);
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
  float eyeMask = max(fillEyeL, fillEyeR);
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

  // The mouth is an upper lip sagging through the middle over a floor dropped below
  // it, both struck as the same power of the folded x, so the two meet in a point at
  // either corner and the mouth tapers away instead of being cut off square. The
  // figures are read off the drawing against the head it sits on: corners a fifteenth
  // of the head above the lip's middle, both edges bending as x^1.8, which is what the
  // drawn edges measure.
  float grin = smileAt(uTime);
  float halfW = f.mouthW;
  // The corners answer the smile and the floor answers the jaw, since a curl of the
  // lip and how far the mouth stands open are two separate things. Hanging both on
  // the smile left the mouth barely moving at all: the corners rode up as the floor
  // dropped, so the ground between them held much the same depth throughout, and the
  // mouth curled without ever opening or shutting. So the floor is now set a stated
  // opening below the lip rather than at a depth of its own. The widest opening is
  // all the room there is, since the pale chin lies just under the floor and the ink
  // below that; the narrowest is a hair, which leaves the curve of the lip drawn as a
  // closed seam instead of wiping the mouth off the face altogether.
  float arch = mix(0.014, 0.082, grin);
  float aperture = mix(0.008, 0.185, open);
  float gape = arch + aperture;
  float cornerY = f.mouthY + 0.015 + arch;
  vec2 mq = vec2(abs(p.x), p.y - cornerY);

  // A stroke sweeps off each corner and curls down. Without it the aperture ends in
  // two bare points and the grin dies there. The drawn mark leaves the corner almost
  // level, turns down as it goes out, and carries its weight two thirds of the way
  // along before tapering to a point, so it is struck as the ground between two radii
  // of an arc set below and outboard of the corner. A crescent hung on a chord cannot
  // do it: that lifts both ends alike and swells at its middle, and reads as a wedge
  // rather than a hook. It is laid down before the mouth, since its inner end runs in
  // under the corner and the dark of the throat is what hides that end.
  vec2 aq = mq - vec2(halfW * 1.039, -halfW * 0.270);
  float turn = atan(aq.x, aq.y);
  float weight = halfW * 0.0381 * smoothstep(-0.75, 0.62, turn) * (1.0 - smoothstep(0.80, 1.05, turn));
  float sweep = abs(length(aq) - halfW * 0.260) - weight;
  // Cut off along the radii at -0.45 and 1.05, the two ends of the drawn mark. The
  // taper alone leaves the field grazing zero the whole way round the arc, which
  // trails a hairline across the cheek.
  sweep = max(sweep, dot(aq, vec2(-0.900, -0.435)));
  sweep = max(sweep, dot(aq, vec2(0.498, -0.867)));
  color = paint(color, f.lipCol, fill(sweep, px) * bodyMask);

  float u = max(mq.x, 1e-4) / halfW;
  // Past the corner the floor climbs faster than the lip does, which shuts the field
  // off outboard. Clamping the fold at the corner instead would leave both edges
  // level out there and trail a hairline across the cheek.
  float bend = pow(u, 1.8);
  float lipEdge = -arch * (1.0 - bend);
  float floorEdge = -gape * (1.0 - bend);
  // Each edge is divided by its own slope so the field reads as a distance and the
  // aperture takes the same soft edge everywhere, corners included.
  float bendSlope = 1.8 * pow(u, 0.8) / halfW;
  float dLip = (mq.y - lipEdge) / sqrt(1.0 + arch * arch * bendSlope * bendSlope);
  float dFloor = (floorEdge - mq.y) / sqrt(1.0 + gape * gape * bendSlope * bendSlope);
  float mouth = smax(dLip, dFloor, 0.004);
  // The red of the throat is only worth showing once there is a throat to see. On a
  // shut mouth the seam takes the colour of the lip instead, so it reads as one line
  // with the strokes hooking off its corners rather than as a red thread laid on a
  // green face.
  vec3 throatCol = mix(mix(f.lipCol, ink, 0.35), f.mouthCol, smoothstep(0.03, 0.30, open));
  color = paint(color, throatCol, fill(mouth, px) * bodyMask);

  // The tongue is a shallow dome standing in the floor of the mouth, wider than the
  // mouth is at that depth and cut back by it rather than fitted to it, which is what
  // leaves the dark of the throat wrapped around its shoulders and no gap under it.
  // It stands a band of throat below the lip rather than a share of the opening, so a
  // mouth closing past that band cuts the tongue away for itself and no pink is left
  // lying across a shut mouth.
  float tongueR = halfW * 0.86;
  float throat = halfW * 0.038 + aperture * 0.05;
  float tongue = smax(mouth, sdCircle(mq - vec2(0.0, -arch - throat - tongueR), tongueR), 0.004);
  color = paint(color, f.tongueCol, fill(tongue, px) * bodyMask);

  gl_FragColor = vec4(color, 1.0);
}
