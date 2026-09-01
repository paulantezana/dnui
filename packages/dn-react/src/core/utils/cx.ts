export type ClassValue = string | number | null | undefined | false | ClassValue[]

/** Une clases descartando lo vacio. Sin dependencias. */
export const cx = (...values: ClassValue[]): string => {
  let out = ''

  for (const value of values) {
    if (!value) continue

    const part = Array.isArray(value) ? cx(...value) : String(value)
    if (part.length === 0) continue

    out = out.length === 0 ? part : `${out} ${part}`
  }

  return out
}
