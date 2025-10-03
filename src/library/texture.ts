import { createTexture } from "twgl.js";

export function texture(gl: WebGL2RenderingContext, { width, height, data }: ImageData) {
  return createTexture(gl, {
    src: data, width, height,
    format: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    min: gl.LINEAR,
    mag: gl.LINEAR,
    maxLevel: 1,
    auto: false
  });
}