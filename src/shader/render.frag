#version 300 es

out highp vec4 fragColor;

in highp vec4 color;

void main() { fragColor = color; }