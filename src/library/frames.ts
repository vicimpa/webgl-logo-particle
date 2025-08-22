type Framer = (delta: number, current: number) => any;
type Dispose = () => void;

const D = 0.001;

export function frames(framer: Framer): Dispose {
  var raf = requestAnimationFrame(loop), current = performance.now() * D;

  function loop(now: number) {
    now *= D;
    raf = requestAnimationFrame(loop);
    framer(Math.min(now - current, .1), current = now);
  }

  return () => {
    cancelAnimationFrame(raf);
  };
}