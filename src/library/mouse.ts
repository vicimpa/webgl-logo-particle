type Mouser = (x: number, y: number) => any;
type Discard = () => void;

export function mouse(el: Element, mouser: Mouser): Discard {
  const controller = new AbortController();

  mouser(-Infinity, -Infinity);

  addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
    const { x: dX, y: dY } = el.getBoundingClientRect();
    mouser(x - dX, y - dY);
  }, controller);

  return () => {
    controller.abort();
  };
}