type Mouser = (x: number, y: number) => any;
type Discard = () => void;

export function mouse(el: HTMLElement, mouser: Mouser): Discard {
  const controller = new AbortController();
  let down = false;

  const move = (e?: PointerEvent) => {
    if (!e)
      return mouser(-Infinity, -Infinity);

    const { clientX: x, clientY: y } = e;
    const { x: dX, y: dY, width, height } = el.getBoundingClientRect();
    const sX = width / el.offsetWidth, sY = height / el.offsetHeight;
    mouser((x - dX) / sX, (y - dY) / sY);
  };

  addEventListener('pointerdown', (e) => {
    down = true;
    move(e);
  }, controller);

  addEventListener('pointermove', (e) => {
    if (!down) return;
    move(e);
  }, controller);


  addEventListener('pointerup', () => {
    down = false;
    move();
  }, controller);
  move();

  return () => {
    controller.abort();
  };
}