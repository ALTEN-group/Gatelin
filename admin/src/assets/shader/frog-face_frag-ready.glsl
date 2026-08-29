// ShaderGun ready export: 2 Vars baked at 0.00s.
#ifdef GL_ES
  precision highp float;
#endif

uniform vec2 uScreenResolution;
uniform float uTime;

// Vars: min max default step; animation is driven internally by uTime.
const float uCuteness = 0.55; // Baked at 0.00s; Var was: 0.0 1.0 0.55 0.01
const float uOutline = 0.016; // Baked at 0.00s; Var was: 0.0 0.04 0.016 0.001

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

// Two-arc lens that preserves outline width while blinking.
float sdLens(vec2 p, float r, float lid) {
  float arcR = (r * r + lid * lid) / (2.0 * lid);
  // Clamp floating-point noise at the fully open position.
  float off = max(arcR - lid, 0.0);
  vec2 q = abs(vec2(p.y, p.x));
  return (q.y - r) * off > q.x * r
    ? length(vec2(q.x, q.y - r))
    : length(vec2(q.x + off, q.y)) - arcR;
}

// Tapered crescent: half-chord, rise, thickness, and inner-arc skew.
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

float earShape(vec2 p, float size) {
  float w = size * 0.68;
  float h = size * 1.5;
  return sdCircle(p - vec2(0.0, h * 0.34), w * 1.02);
}

// Unified head, cheeks, chin, ear nubs, and eye domes.
float bodyField(vec2 p, Face f) {
  float head = sdEllipse(p, vec2(f.headW, f.headH));
  float cheekL = sdEllipse(p - vec2(-f.headW * 0.60, -0.10), vec2(f.headW * 0.44, f.headH * 0.44));
  float cheekR = sdEllipse(p - vec2(f.headW * 0.60, -0.10), vec2(f.headW * 0.44, f.headH * 0.44));
  head = smin(head, min(cheekL, cheekR), 0.11);
  float chin = sdEllipse(p - vec2(0.0, -f.headH * 0.74), vec2(f.headW * 0.36, f.headH * 0.46 * f.chin));
  head = smin(head, chin, 0.10);

  float earL = earShape(p - vec2(-f.earX, f.earY), f.earSize);
  float earR = earShape(p - vec2(f.earX, f.earY), f.earSize);

  float domes = min(
    sdCircle(p - vec2(-f.eyeX, f.eyeY), f.eyeR * 1.3),
    sdCircle(p - vec2(f.eyeX, f.eyeY), f.eyeR * 1.3)
  );

  return smin(smin(head, min(earL, earR), 0.035), domes, 0.05);
}

// Deterministic hashes drive independent, irregular facial animation.
float hash1(float n) {
  return fract(sin(n * 127.1) * 43758.5453);
}

vec2 hash2(float n) {
  return fract(sin(vec2(n * 127.1, n * 311.7)) * 43758.5453);
}

float blinkPulse(float dt, float shut) {
  float u = dt / shut;
  if (u < 0.0 || u > 1.0) return 0.0;
  return pow(sin(3.14159265 * u), 0.45);
}

// Irregular single or double blinks; include the previous slot for overlap.
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

vec2 gazeMark(float i) {
  return (hash2(i) * 2.0 - 1.0) * mix(0.30, 1.0, hash1(i + 5.1));
}

// Fast saccade followed by a held gaze.
vec2 gazeAt(float t) {
  float slot = 1.7;
  float i = floor(t / slot);
  float settle = smoothstep(0.0, 0.11, t - i * slot);
  return mix(gazeMark(i - 1.0), gazeMark(i), settle) * 0.82;
}

// Smooth interpolation between hashed values.
float wander(float t) {
  float i = floor(t);
  float k = t - i;
  return mix(hash1(i), hash1(i + 1.0), k * k * (3.0 - 2.0 * k));
}

// Smile controls lip curl independently from jaw opening.
float smileAt(float t) {
  float drift = 0.62 * wander(t / 2.6) + 0.38 * wander(t / 7.1 + 23.0);
  return mix(0.22, 0.95, drift);
}

// Independent pupil dilation, bounded to retain the yellow iris.
float pupilScaleAt(float t) {
  return mix(0.42, 0.64, wander(t / 2.2 + 14.0));
}

// Asymmetric transition with a held endpoint.
float jawPulse(float dt, float fall, float hold, float rise) {
  if (dt < 0.0) return 0.0;
  if (dt < fall) return smoothstep(0.0, fall, dt);
  if (dt < fall + hold) return 1.0;
  return 1.0 - smoothstep(fall + hold, fall + hold + rise, dt);
}

// Slow resting drift with occasional quick shuts or slower gapes.
float mouthOpenAt(float t) {
  float drift = 0.60 * wander(t / 5.2) + 0.40 * wander(t / 13.0 + 11.0);
  float rest = mix(0.34, 1.0, drift);
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
  // Keep the background in frame space and draw the face enlarged.
  const float zoom = 1.55;
  vec2 frame = 2.0 * (gl_FragCoord.xy - 0.5 * uScreenResolution.xy) / uScreenResolution.y;
  vec2 uv = frame / zoom;
  float px = 1.6 / (uScreenResolution.y * zoom);

  Face f = fixedFace();

  // Read the ground before the face, so the corners can answer with it alone.
  float r = length(frame);
  vec3 bg = mix(vec3(0.09, 0.12, 0.17), vec3(0.15, 0.21, 0.27), smoothstep(-1.0, 1.0, frame.y));
  bg += 0.12 * exp(-r * 1.3) * mix(f.fur, vec3(1.0), 0.45);

  // Skip the unused corners; the 1.02 radius covers the crop's antialiased rim.
  if (r > 1.02) {
    gl_FragColor = vec4(bg, 1.0);
    return;
  }

  float cute = clamp(uCuteness, 0.0, 1.0);
  f.eyeR *= mix(0.82, 1.22, cute);
  f.irisR = clamp(f.irisR * mix(0.92, 1.06, cute), 0.0, 0.92);
  f.headW *= mix(0.96, 1.05, cute);
  f.headH *= mix(0.97, 1.06, cute);
  f.chin *= mix(1.10, 0.86, cute);
  // Keep the broad throat marking aligned with the changing jaw.
  f.muzzleY -= mix(0.080, 0.115, cute);

  // Optical centering within a round crop.
  vec2 p = uv - vec2(0.0, -0.045);

  // Nothing is drawn past the ink line, so skip the face and its clocks.
  float body = bodyField(p, f);
  if (body > uOutline + 2.0 * px) {
    gl_FragColor = vec4(bg, 1.0);
    return;
  }

  vec2 look = gazeAt(uTime);
  float blink = blinkAmount(uTime);
  float open = mouthOpenAt(uTime);

  vec2 eyePosL = vec2(-f.eyeX, f.eyeY);
  vec2 eyePosR = vec2(f.eyeX, f.eyeY);

  vec3 ink = vec3(0.08, 0.07, 0.10);
  vec3 color = bg;

  float bodyMask = fill(body, px);
  color = paint(color, ink, fill(body - uOutline, px));

  float lift = smoothstep(-f.headH * 1.1, f.headH * 1.5, p.y);
  vec3 furCol = mix(f.furDark, f.fur, 0.34 + 0.66 * lift);
  color = paint(color, furCol, bodyMask);

  // Move the throat marking slightly with the jaw.
  float patchY = f.muzzleY - mix(0.0, 0.026, open);
  float patchD = sdEllipse(p - vec2(0.0, patchY), vec2(f.muzzleW, f.muzzleH));
  color = paint(color, f.patchCol, fill(patchD, px) * bodyMask * 0.96);

  // Eyes and lids.
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

  // Mirrored nostril slits, creases, folds, and central lip patch.
  float nr = f.nostrilR;
  vec2 nq = vec2(abs(p.x) - f.nostrilX, p.y - f.nostrilY);

  float crease = sdCrescent(vec2(nq.x - nr * 0.27, -nq.y - nr * 2.26), nr * 1.45, nr * 1.18, nr * 0.59, 0.0);
  color = paint(color, f.furDark, fill(crease, px) * bodyMask * 0.50);

  float lip = sdCrescent(vec2(p.x, f.nostrilY - nr * 3.21 - p.y), nr * 2.25, nr * 2.08, nr * 1.88, 0.0) - nr * 0.55;
  float notch = (p.y - (f.nostrilY - nr * 1.72) - 0.5 * abs(p.x)) * 0.894;
  color = paint(color, f.patchCol, fill(smax(lip, notch, nr * 0.25), px) * bodyMask * 0.18);

  float ct = cos(f.nostrilTilt);
  float st = sin(f.nostrilTilt);
  vec2 tq = mat2(ct, st, -st, ct) * (nq + vec2(0.0, nr * 0.35));
  color = paint(color, ink, fill(sdEllipse(tq, vec2(nr, nr * 0.50)), px) * bodyMask);

  float fold = sdCrescent(tq - vec2(-nr * 0.386, nr * 1.524), nr * 1.15, nr * 0.79, nr * 0.27, nr * 0.35);
  color = paint(color, ink, fill(fold, px) * bodyMask);

  // Mouth: independent smile arch and jaw aperture meet at tapered corners.
  float grin = smileAt(uTime);
  float halfW = f.mouthW;
  float arch = mix(0.014, 0.082, grin);
  float aperture = mix(0.008, 0.185, open);
  float gape = arch + aperture;
  float cornerY = f.mouthY + 0.015 + arch;
  vec2 mq = vec2(abs(p.x), p.y - cornerY);

  // Curled strokes continue beyond both mouth corners.
  vec2 aq = mq - vec2(halfW * 1.039, -halfW * 0.270);
  float turn = atan(aq.x, aq.y);
  float weight = halfW * 0.0381 * smoothstep(-0.75, 0.62, turn) * (1.0 - smoothstep(0.80, 1.05, turn));
  float sweep = abs(length(aq) - halfW * 0.260) - weight;
  // Radial cuts prevent a hairline from continuing around the cheek.
  sweep = max(sweep, dot(aq, vec2(-0.900, -0.435)));
  sweep = max(sweep, dot(aq, vec2(0.498, -0.867)));
  color = paint(color, f.lipCol, fill(sweep, px) * bodyMask);

  float u = max(mq.x, 1e-4) / halfW;
  float bend = pow(u, 1.8);
  float lipEdge = -arch * (1.0 - bend);
  float floorEdge = -gape * (1.0 - bend);
  // Normalize both edge fields by slope for uniform antialiasing.
  float bendSlope = 1.8 * pow(u, 0.8) / halfW;
  float dLip = (mq.y - lipEdge) / sqrt(1.0 + arch * arch * bendSlope * bendSlope);
  float dFloor = (floorEdge - mq.y) / sqrt(1.0 + gape * gape * bendSlope * bendSlope);
  float mouth = smax(dLip, dFloor, 0.004);
  // Fade the red throat to a dark lip-colored seam when closed.
  vec3 throatCol = mix(mix(f.lipCol, ink, 0.35), f.mouthCol, smoothstep(0.03, 0.30, open));
  color = paint(color, throatCol, fill(mouth, px) * bodyMask);

  // Clip a tongue dome to the mouth so it disappears when closed.
  float tongueR = halfW * 0.86;
  float throat = halfW * 0.038 + aperture * 0.05;
  float tongue = smax(mouth, sdCircle(mq - vec2(0.0, -arch - throat - tongueR), tongueR), 0.004);
  color = paint(color, f.tongueCol, fill(tongue, px) * bodyMask);

  gl_FragColor = vec4(color, 1.0);
}
