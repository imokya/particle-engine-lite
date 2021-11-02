
attribute float size;
attribute float rotation;
attribute vec4 color;

varying vec2 vAngle;
varying vec4 vColor;

void main() {

  vAngle = vec2(cos(rotation), sin(rotation));
  vColor = color;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * 500.0 / length(mvPosition.xyz);
}