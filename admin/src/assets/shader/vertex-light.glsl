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
  float fade1 = sineEquation( 0.05, uTime * 0.11, -halfPI, 0.10 );  // R: 0.05 → 0.15 (slight warmth)
  float fade2 = sineEquation( 0.20, uTime * 0.07, -halfPI, 0.55 );  // G: 0.35 → 0.75 (bold green)
  float fade3 = sineEquation( 0.05, uTime * 0.17, -halfPI, 0.10 );  // B: 0.05 → 0.15 (muted)
  float fadeIn = smoothstep(0.0, 8.0, uTime);
  baseColor = vec4(fade1 * fadeIn, fade2 * fadeIn, fade3 * fadeIn, fadeIn);
}
