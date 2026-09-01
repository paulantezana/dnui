import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import type { Middleware, Placement, Strategy } from '@floating-ui/dom'

export interface VirtualPosition {
  x: number
  y: number
}

export type Anchor = HTMLElement | VirtualPosition

export interface PositionOptions {
  /** dn-ui usa siempre `bottom-start`. */
  placement?: Placement
  /** Separacion entre el anclaje y el overlay, en px. */
  gap?: number
  strategy?: Strategy
  middleware?: Middleware[]
}

const isVirtual = (anchor: Anchor): anchor is VirtualPosition =>
  !(anchor instanceof Element)

/** Elemento virtual de tamano cero en unas coordenadas: menus contextuales. */
export const virtualElementAt = (position: VirtualPosition) => ({
  getBoundingClientRect: (): DOMRect =>
    ({
      width: 0,
      height: 0,
      x: position.x,
      y: position.y,
      top: position.y,
      left: position.x,
      right: position.x,
      bottom: position.y,
      toJSON: () => ''
    }) as DOMRect
})

const defaultMiddleware = (gap: number): Middleware[] => [
  ...(gap > 0 ? [offset(gap)] : []),
  flip(),
  shift({ padding: 8 })
]

/**
 * Coloca `overlay` respecto a `anchor` y escribe `left`/`top` en su estilo,
 * igual que dn-ui `menu.ts`. Se anade `shift()` al middleware: sin el, un menu
 * cerca del borde derecho se sale de la pantalla.
 */
export const positionOverlay = async (
  anchor: Anchor,
  overlay: HTMLElement,
  options: PositionOptions = {}
): Promise<VirtualPosition> => {
  const { placement = 'bottom-start', gap = 0, strategy = 'absolute', middleware } = options
  const reference = isVirtual(anchor) ? virtualElementAt(anchor) : anchor

  const { x, y } = await computePosition(reference, overlay, {
    placement,
    strategy,
    middleware: middleware ?? defaultMiddleware(gap)
  })

  Object.assign(overlay.style, { left: `${x}px`, top: `${y}px` })
  return { x, y }
}

/**
 * Igual que `positionOverlay` pero reposiciona mientras el overlay este visible
 * (scroll, resize, cambios de tamano). Devuelve el cleanup.
 */
export const trackOverlay = (
  anchor: Anchor,
  overlay: HTMLElement,
  options: PositionOptions = {}
): (() => void) => {
  if (isVirtual(anchor)) {
    void positionOverlay(anchor, overlay, options)
    return () => {}
  }

  return autoUpdate(anchor, overlay, () => {
    void positionOverlay(anchor, overlay, options)
  })
}
