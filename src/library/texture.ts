import { createTexture } from "twgl.js";
import type { Image } from "./image";

export function texture(gl: WebGL2RenderingContext, { width, height, buffer }: Image) {
  const src = new Uint8Array(buffer);
  return createTexture(gl, {
    src, width, height,
    format: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    min: gl.LINEAR,
    mag: gl.LINEAR,
    maxLevel: 1,
    auto: false
  });
}