export function debounce<F extends (...args: any[]) => void>(
  fn: F,
  wait = 300
) {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<F>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}
