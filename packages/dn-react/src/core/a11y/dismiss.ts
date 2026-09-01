export type DismissReason = 'outside' | 'escape'

export interface DismissOptions {
  onDismiss(reason: DismissReason, event: Event): void
  /** Nodos que NO cuentan como "fuera". Suele ser el overlay y su trigger. */
  contains?: Array<HTMLElement | null | undefined> | (() => Array<HTMLElement | null | undefined>)
  escape?: boolean
  outside?: boolean
  /**
   * Escuchar el click en fase de captura. dn-ui lo hace asi en `menu.ts` para
   * llegar antes que el handler del trigger; se conserva como valor por defecto.
   */
  capture?: boolean
  ownerDocument?: Document
}

/** Cierra un overlay al hacer click fuera o al pulsar Escape. Devuelve el cleanup. */
export const createDismiss = (options: DismissOptions): (() => void) => {
  const {
    onDismiss,
    contains = [],
    escape = true,
    outside = true,
    capture = true,
    ownerDocument = document
  } = options

  const resolveContainers = () => (typeof contains === 'function' ? contains() : contains)

  const isInside = (target: Node | null): boolean =>
    resolveContainers().some((el) => !!el && !!target && el.contains(target))

  const onPointerDown = (event: MouseEvent) => {
    if (isInside(event.target as Node)) return
    onDismiss('outside', event)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return
    onDismiss('escape', event)
  }

  if (outside) ownerDocument.addEventListener('click', onPointerDown, capture)
  if (escape) ownerDocument.addEventListener('keydown', onKeyDown, true)

  return () => {
    if (outside) ownerDocument.removeEventListener('click', onPointerDown, capture)
    if (escape) ownerDocument.removeEventListener('keydown', onKeyDown, true)
  }
}
