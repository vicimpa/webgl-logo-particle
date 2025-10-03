export type Image = { width: number, height: number, buffer: ArrayBuffer; };
const can = document.createElement('canvas');
const ctx = can.getContext('2d')!;

export async function image(src: string) {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
  can.width = img.width;
  can.height = img.height;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}