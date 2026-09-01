export interface Debounced<A extends unknown[]> {
  (...args: A): void
  cancel(): void
}

/**
 * Retrasa la ejecucion de `fn` hasta que pasen `wait` ms sin nuevas llamadas.
 * Portado de dn-ui `utils/debounce.ts`, con `cancel()` anadido para poder
 * limpiar el timer al desmontar un componente.
 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait = 300
): Debounced<A> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: A) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = undefined
  }

  return debounced
}
