export interface Typeahead {
  /** Anade un caracter y devuelve el buffer resultante. */
  push(char: string): string
  reset(): void
  readonly buffer: string
}

/**
 * Buffer de escritura rapida para menus y listas. El buffer se vacia solo
 * cuando pasan `timeout` ms sin teclear.
 */
export const createTypeahead = (timeout = 500): Typeahead => {
  let buffer = ''
  let timer: ReturnType<typeof setTimeout> | undefined

  return {
    push(char) {
      clearTimeout(timer)
      buffer += char
      timer = setTimeout(() => {
        buffer = ''
      }, timeout)
      return buffer
    },
    reset() {
      clearTimeout(timer)
      buffer = ''
    },
    get buffer() {
      return buffer
    }
  }
}

/**
 * Indice de la primera etiqueta que empieza por `buffer`, buscando en circulo
 * a partir de `from`. Devuelve -1 si no hay coincidencia.
 *
 * Si el buffer es un mismo caracter repetido ("aaa"), se comporta como manda
 * WAI-ARIA: cicla entre los elementos que empiezan por esa letra en lugar de
 * buscar el prefijo literal.
 */
export const matchTypeahead = (
  labels: string[],
  buffer: string,
  from = -1
): number => {
  if (buffer.length === 0 || labels.length === 0) return -1

  const normalized = buffer.toLowerCase()
  const isRepeatedChar =
    normalized.length > 1 && normalized.split('').every((c) => c === normalized[0])
  const needle = isRepeatedChar ? normalized[0] : normalized

  for (let offset = 1; offset <= labels.length; offset++) {
    const index = (from + offset + labels.length) % labels.length
    if (labels[index]?.trim().toLowerCase().startsWith(needle)) {
      return index
    }
  }

  return -1
}
