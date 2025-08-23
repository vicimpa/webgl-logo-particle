#version 300 es

uniform vec2 resolution, mouse;
uniform sampler2D u_texture;

in vec2 now;
in vec2 move;

vec2 mirror = vec2(1, -1);

out vec4 color;

void main() {
  int id = gl_VertexID;
  int w = int(resolution.x);
  int x = int(id % w);
  int y = int(id / w);
  ivec2 base = ivec2(x, y);
  vec2 real = (now / resolution) * 2.0 - 1.0;
  color = texelFetch(u_texture, base, 0);
  gl_Position = vec4(real * mirror, 0, 1);
  gl_PointSize = 1.0 + length(move) / 1000.0;
}