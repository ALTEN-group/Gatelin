#ifdef GL_ES
  precision highp float;
#endif

attribute vec2 aVertexPosition;
uniform float uTime;

varying vec3 vFieldColor;
varying vec3 vFieldPosition;

void main(){
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);

  vec3 zoom = vec3(aVertexPosition / 2., .0);
  vec3 fieldDistortion = vec3( sin(uTime * .001) * .2,
                                .0,
                                sin(uTime * .1) * .6
                            );
  vFieldColor = vec3(.1) + vec3(sin(uTime * .2) * .2, sin(uTime * .4) * .2,  .0 );
  vFieldPosition = vec3(2., - 1.3, .3) + zoom + fieldDistortion;

}