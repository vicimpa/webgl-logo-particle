#version 300 es
precision lowp float;

uniform vec2 resolution;
uniform lowp sampler2D u_texture;

out vec2 vNow;
out vec2 vMove;

float rand(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  int id = gl_VertexID;
  int w = int(resolution.x);
  int x = int(id % w);
  int y = int(id / w);
  vec2 base = vec2(x, y) / resolution;
  float angle = rand(base + 1.0) * 6.28;
  float speed = rand(base + 2.0);
  vNow = vec2(rand(base), rand(base - 1.0)) * resolution;
  vMove = vec2(sin(angle), cos(angle)) * 100.0;
}