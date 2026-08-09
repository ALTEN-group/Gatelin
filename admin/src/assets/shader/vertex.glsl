#ifdef GL_ES
  precision highp float;
#endif

#define halfPI 1.5707963

attribute vec2 aVertexPosition;
uniform float uTime;
varying vec4 baseColor;
varying float speed;

float sineEquation(float amplitude, float period, float shiftX, float shiftY){
  return amplitude * sin( period + shiftX ) + shiftY;
}

void main(){
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
  speed = uTime * 0.25;
  float fadeIn = smoothstep(0.0, 3.0, uTime);
  // Target color #34d399 (R=0.204, G=0.827, B=0.600), oscillation around 1.0 scaled by fadeIn
  float osc1 = sineEquation( 0.06, uTime * 0.11, -halfPI, 1.0 );
  float osc2 = sineEquation( 0.10, uTime * 0.07, -halfPI, 1.0 );
  float osc3 = sineEquation( 0.08, uTime * 0.17, -halfPI, 1.0 );
  baseColor = vec4(0.204 * osc1 * fadeIn, 0.827 * osc2 * fadeIn, 0.600 * osc3 * fadeIn, fadeIn);
}