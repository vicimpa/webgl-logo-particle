#version 300 es
precision highp float;

uniform float delta, current;
uniform vec2 resolution, mouse;

in vec2 now;
in vec2 move;

out vec2 vNow;
out vec2 vMove;

uniform float attractionStrength;
uniform float maxSpeed;
uniform float mouseRadius;
uniform float repulsionStrength;
uniform float damping;

void main() {
  int id = gl_VertexID;
  int w = int(resolution.x);
  int x = id % w;
  int y = id / w;
  vec2 base = vec2(float(x), float(y));

  vec2 toBase = base - now;
  float distToBase = length(toBase);
  vec2 attractionForce = toBase * attractionStrength;

  vec2 toMouse = now - mouse;
  float distToMouse = length(toMouse);

  vec2 repulsionForce = vec2(0.0);
  if (distToMouse < mouseRadius && distToMouse > 0.0) {
    float falloff = mouseRadius - (distToMouse / mouseRadius);
    repulsionForce =
        normalize(toMouse) * repulsionStrength * falloff / distToMouse;
  }

  vec2 totalForce = attractionForce + repulsionForce;
  vMove = move * damping + totalForce * delta;

  float currentSpeed = length(vMove);

  if (currentSpeed > maxSpeed) {
    vMove = normalize(vMove) * maxSpeed;
  }

  vNow = now + vMove * delta;
}