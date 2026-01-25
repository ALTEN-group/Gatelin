#ifdef GL_ES
  precision highp float;
#endif	

uniform vec2 uScreenResolution;
uniform float uTime;
varying vec3 vFieldColor;
varying vec3 vFieldPosition;
// bgColor : vec3(0.18, 0.21, 0.23);

float field(in vec3 p, in vec3 c) {
  float strength = 10.;
  float accum = .0;
  float prev = .0;
  float tw = .0;
  for (int i = 0; i < 12; ++i) {
    float mag = dot(p, p);
    p = abs(p) / mag + c;
    float w = exp(-float(i) / 7.);
    accum += w * exp(-strength * pow(abs(mag - prev), 2.2));
    tw += w;
    prev = mag;
  }
  return max( .0, 5. * accum / tw - .5 );
}

void main(){ 

  vec3 c = vec3(-.5, -.4, -1.5);
  vec3 color = vec3(0.18, 0.21, 0.23) + vFieldColor * field(vFieldPosition, c);

  gl_FragColor = vec4(color, 1.0);

}
