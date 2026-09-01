export type Orientation = 'vertical' | 'horizontal' | 'both'

export interface RovingOptions {
  /** Que flechas navegan. Por defecto solo arriba/abajo. */
  orientation?: Orientation
  /** Si al pasar del ultimo se vuelve al primero. Por defecto no, igual que dn-ui. */
  loop?: boolean
}

const NEXT_KEYS: Record<Orientation, string[]> = {
  vertical: ['ArrowDown'],
  horizontal: ['ArrowRight'],
  both: ['ArrowDown', 'ArrowRight']
}

const PREV_KEYS: Record<Orientation, string[]> = {
  vertical: ['ArrowUp'],
  horizontal: ['ArrowLeft'],
  both: ['ArrowUp', 'ArrowLeft']
}

/**
 * Indice al que debe moverse el foco, o `null` si la tecla no navega.
 * Reproduce el recorrido de dn-ui `filterColumn.ts` (flechas con tope en los
 * extremos) y anade Home/End, que WAI-ARIA exige en listas y menus.
 */
export const nextRovingIndex = (
  current: number,
  count: number,
  key: string,
  options: RovingOptions = {}
): number | null => {
  const { orientation = 'vertical', loop = false } = options

  if (count <= 0) return null

  if (key === 'Home') return 0
  if (key === 'End') return count - 1

  if (NEXT_KEYS[orientation].includes(key)) {
    if (current >= count - 1) return loop ? 0 : count - 1
    return current + 1
  }

  if (PREV_KEYS[orientation].includes(key)) {
    if (current <= 0) return loop ? count - 1 : 0
    return current - 1
  }

  return null
}
