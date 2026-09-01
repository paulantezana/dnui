import { useEffect, type RefObject } from 'react'
import { createFocusTrap } from '../core/a11y/focusTrap'

export interface UseFocusTrapOptions {
  enabled: boolean
  containerRef: RefObject<HTMLElement | null>
  initialFocusRef?: RefObject<HTMLElement | null>
  returnFocusRef?: RefObject<HTMLElement | null>
}

/** Encierra el foco en `containerRef` y lo devuelve al salir. */
export const useFocusTrap = ({
  enabled,
  containerRef,
  initialFocusRef,
  returnFocusRef
}: UseFocusTrapOptions): void => {
  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) return

    const trap = createFocusTrap(container, {
      initialFocus: () => initialFocusRef?.current ?? null,
      returnFocus: returnFocusRef?.current ?? null
    })

    trap.activate()
    return () => trap.deactivate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
}
