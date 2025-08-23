type Filler<T> = (i: number) => T;

export function array<T>(length: number, filler: Filler<T>): T[] {
  return Array.from({ length }, (_, i) => filler(i));
}