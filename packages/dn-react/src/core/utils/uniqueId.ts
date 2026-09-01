const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

/**
 * Identificador numerico pseudo-unico. Portado tal cual de dn-ui
 * `utils/unique-id.ts`: baraja los digitos del timestamp actual y antepone
 * un `1` para que el resultado nunca empiece por cero.
 */
export const uniqueId = (length = 6): number => {
  const parts = Date.now().toString().split('').reverse()
  let id = ''

  for (let i = 0; i < length; ++i) {
    id += parts[getRandomInt(0, parts.length - 1)]
  }

  return parseInt(`1${id}`, 10)
}
