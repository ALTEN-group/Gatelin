#ifdef GL_ES
  precision highp float;
#endif

attribute vec2 aVertexPosition;
uniform float uTime;

void main(){
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);

}
