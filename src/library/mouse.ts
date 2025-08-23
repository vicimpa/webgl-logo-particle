type Mouser = (x: number, y: number) => any;
type Discard = () => void;

export function mouse(el: HTMLElement, mouser: Mouser): Discard {
  const controller = new AbortController();

  mouser(-Infinity, -Infinity);

  addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
    const { x: dX, y: dY, width, height } = el.getBoundingClientRect();
    const sX = width / el.offsetWidth, sY = height / el.offsetHeight;
    mouser((x - dX) / sX, (y - dY) / sY);
  }, controller);

  return () => {
    controller.abort();
  };
}