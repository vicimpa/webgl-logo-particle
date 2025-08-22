export type Image = { width: number, height: number, buffer: ArrayBuffer; };

export async function image(src: string, type = 'image/png', frameIndex = 0) {
  const req = await fetch(src);
  const data = await req.arrayBuffer();
  const decoder = new ImageDecoder({ type, data });
  const { image } = await decoder.decode({ frameIndex });
  const { codedWidth: width, codedHeight: height } = image;
  const buffer = new ArrayBuffer(height * width * 4);
  await image.copyTo(buffer);
  decoder.reset();
  decoder.close();
  return { width, height, buffer };
}