#version 300 es

out lowp vec4 fragColor;

in lowp vec4 color;

void main() {
  fragColor = color.bgra;
}