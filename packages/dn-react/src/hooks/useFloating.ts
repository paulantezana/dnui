import { useEffect, type RefObject } from 'react'
import { positionOverlay, trackOverlay, type Anchor, type PositionOptions } from '../core/floating'

export interface UseFloatingOptions extends PositionOptions {
  enabled: boolean
  anchorRef: RefObject<HTMLElement | null>
  overlayRef: RefObject<HTMLElement | null>
  /** Coordenadas fijas en lugar de un elemento: menus contextuales. */
  virtual?: { x: number; y: number } | null
  /** Reposicionar al hacer scroll o cambiar de tamano. dn-ui no lo hace. */
  track?: boolean
}

/** Coloca un overlay respecto a su anclaje usando @floating-ui/dom. */
export const useFloating = ({
  enabled,
  anchorRef,
  overlayRef,
  virtual = null,
  track = false,
  ...position
}: UseFloatingOptions): void => {
  useEffect(() => {
    const overlay = overlayRef.current
    const anchor: Anchor | null = virtual ?? anchorRef.current
    if (!enabled || !overlay || !anchor) return

    if (!track) {
      void positionOverlay(anchor, overlay, position)
      return
    }

    return trackOverlay(anchor, overlay, position)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, track, virtual?.x, virtual?.y, position.placement, position.gap])
}
