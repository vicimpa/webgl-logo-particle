type Resizer = (width: number, height: number) => any;
type Discard = () => void;

export function resize(el: HTMLElement, resizer: Resizer): Discard {
  const observer = new ResizeObserver(() => {
    resizer(el.offsetWidth, el.offsetHeight);
  });

  observer.observe(el);

  return () => {
    observer.disconnect();
  };
}