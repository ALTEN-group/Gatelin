#ifdef GL_ES
  precision highp float;
#endif

#define halfPI 1.570796

attribute vec2 aVertexPosition;
uniform float uTime;
varying vec4 baseColor;
varying float speed;

float sineEquation(float amplitude, float period, float shiftX, float shiftY){
  return amplitude * sin( period + shiftX ) + shiftY;
}

void main(){
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
  speed = uTime * 0.3;
  float fade1 = sineEquation( 0.2, uTime * 0.15, -halfPI, 0.2 );
  float fade2 = sineEquation( 0.2, uTime * 0.25, -halfPI, 0.2 );
  float fade3 = sineEquation( 0.2, uTime * 0.05, -halfPI, 0.2 );
  float fadeIn = min(uTime * 0.05, 0.2);
  baseColor = vec4(fade1, fade2, fade3, fadeIn);
}