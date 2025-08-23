import { createBufferFromArray, createProgramInfo, createVAOFromBufferInfo, setUniforms, type ProgramInfo } from "twgl.js";

// Images
import myimage from "./logo/image.png";

// Shaders
import emptyFrag from "./shader/empty.frag";
import initVert from "./shader/init.vert";
import processVert from "./shader/process.vert";
import renderVert from "./shader/render.vert";
import renderFrag from "./shader/render.frag";

// Library
import { frames } from "./library/frames";
import { mouse } from "./library/mouse";
import { image, type Image } from "./library/image";
import { texture } from "./library/texture";
import { array } from "./library/array";

const canvas = document.querySelector('canvas');

if (!canvas)
  throw new Error('Can not find canvas');

const gl = canvas.getContext('webgl2');

if (!gl)
  throw new Error('Can not create webgl2 context');


const init = createProgramInfo(gl, [initVert, emptyFrag], {
  transformFeedbackVaryings: ["vNow", "vMove"],
  transformFeedbackMode: gl.SEPARATE_ATTRIBS,
});

const process = createProgramInfo(gl, [processVert, emptyFrag], {
  transformFeedbackVaryings: ["vNow", "vMove"],
  transformFeedbackMode: gl.SEPARATE_ATTRIBS,
});

const params = {
  attractionStrength: 80,
  maxSpeed: 1200,
  mouseRadius: 200,
  repulsionStrength: 1000,
  damping: .95
};

const render = createProgramInfo(gl, [renderVert, renderFrag]);

const source = await image(myimage);
const u_texture = texture(gl, source);

const buffers = createBuffers(gl, source);
const vertexArrays = createVAOs(gl, process, buffers);
const vertexArrays2 = createVAOs(gl, render, buffers);
const quie = quieCounter(buffers.length);

const pixels = source.width * source.height;

canvas.width = source.width;
canvas.height = source.height;

const resolution = [source.width, source.height] as const;
gl.viewport(0, 0, ...resolution);

gl.useProgram(init.program);
setUniforms(init, { u_texture, resolution });

gl.useProgram(process.program);
setUniforms(process, { u_texture, resolution });
setUniforms(process, params);

gl.useProgram(render.program);
setUniforms(render, { resolution });

gl.enable(gl.BLEND);
gl.blendFuncSeparate(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA,
  gl.ONE,
  gl.ONE_MINUS_SRC_ALPHA,
);
gl.disable(gl.DEPTH_TEST);

runInit(gl);

mouse(canvas, (...mouse) => {
  gl.useProgram(process.program);
  setUniforms(process, { mouse });
});

frames((delta, current) => {
  runProcess(gl, delta, current);
  runRender(gl);
});

function runInit(gl: WebGL2RenderingContext) {
  gl.useProgram(init.program);
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, buffers[quie.now].tf);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, pixels);
  gl.endTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
  gl.disable(gl.RASTERIZER_DISCARD);
}

function runProcess(gl: WebGL2RenderingContext, delta: number, current: number) {
  gl.useProgram(process.program);
  setUniforms(process, { delta, current });
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, buffers[quie.next].tf);
  gl.beginTransformFeedback(gl.POINTS);
  gl.bindVertexArray(vertexArrays[quie.now]);
  gl.drawArrays(gl.POINTS, 0, pixels);
  gl.endTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
  gl.disable(gl.RASTERIZER_DISCARD);
  quie.tick();
}


function runRender(gl: WebGL2RenderingContext) {
  gl.useProgram(render.program);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindVertexArray(vertexArrays2[quie.now]);
  gl.drawArrays(gl.POINTS, 0, pixels);
}

type TFBuffer = { now: WebGLBuffer, move: WebGLBuffer, tf: WebGLTransformFeedback; };

function createBuffers(gl: WebGL2RenderingContext, image: Image, size = 2): TFBuffer[] {
  const buffer = new Float32Array(image.width * image.height * 2);

  return array(size, () => {
    const now = createBufferFromArray(gl, buffer, 'now');
    const move = createBufferFromArray(gl, buffer, 'move');
    const tf = gl.createTransformFeedback()!;

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, now);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, move);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    return { now, move, tf } as TFBuffer;
  });
}

function createVAOs(gl: WebGL2RenderingContext, info: ProgramInfo, buffers: TFBuffer[]) {
  return buffers.map(buffer => {

    return createVAOFromBufferInfo(gl, info, {
      attribs: {
        now: { buffer: buffer.now, numComponents: 2, type: gl.FLOAT },
        move: { buffer: buffer.move, numComponents: 2, type: gl.FLOAT },
      }
    } as any);
  });
}

function quieCounter(size: number) {
  let now = 0;

  return {
    get now() {
      return now;
    },
    get next() {
      return (now + 1) % size;
    },
    tick() {
      now = this.next;
    }
  };
}