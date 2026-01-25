#ifdef GL_ES
  precision highp float;
#endif	

#define S(a, b, t) smoothstep(a, b, t)

uniform vec2 uScreenResolution;
uniform float uTime;
varying float speed;
varying vec4 baseColor;

float N21(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

vec2 N22(vec2 p) {
  float n = N21(p);
  return vec2(n, N21(p+n));
}

vec2 GetPos(vec2 id, vec2 offset, float t) {
  vec2 n = N22(id+offset) * -t;
  return offset + sin(n) * .4;
}

float DistLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p-a;
  vec2 ba = b-a;
  float t = clamp(dot(pa, ba)/dot(ba, ba), 0., 1.);
  return length(pa - ba*t);
}

float Line(vec2 p, vec2 a, vec2 b) {
  float d = DistLine(p, a, b);
  float m = S(.01, .0025, d);
  float d2 = length(a-b);
  m *= S(1.2, .8, d2)*.5+S(.05, .03, abs(d2-.5));
  return m;
}

void main() { 
  vec2 uv = (gl_FragCoord.xy - .5 * uScreenResolution.xy) / uScreenResolution.y; //-0.5 to 0.5
  float m = 0.;
  uv *= 5.;
  vec2 gv = fract(uv)-.5;
  vec2 id = floor(uv);

  vec2 p[9];
  p[0] = GetPos(id, vec2(-1,-1), speed);
  p[1] = GetPos(id, vec2(0,-1), speed);
  p[2] = GetPos(id, vec2(1,-1), speed);
  p[3] = GetPos(id, vec2(-1,0), speed);
  p[4] = GetPos(id, vec2(0,0), speed);
  p[5] = GetPos(id, vec2(1,0), speed);
  p[6] = GetPos(id, vec2(-1,1), speed);
  p[7] = GetPos(id, vec2(0,1), speed);
  p[8] = GetPos(id, vec2(1,1), speed);
  
  for(int i=0; i<9; i++) {
    m += Line(gv, p[4], p[i]);
  }
  m += Line(gv, p[1], p[3]);
  m += Line(gv, p[1], p[5]);
  m += Line(gv, p[7], p[3]);
  m += Line(gv, p[7], p[5]);

  gl_FragColor = baseColor * m;

}
