import { useEffect } from 'react'
import { createDismiss, type DismissReason } from '../core/a11y/dismiss'

export interface UseDismissOptions {
  enabled: boolean
  onDismiss(reason: DismissReason, event: Event): void
  /** Refs que NO cuentan como "fuera". */
  contains: Array<{ current: HTMLElement | null }>
  escape?: boolean
  outside?: boolean
}

/** Cierra al hacer click fuera o con Escape. Se desengancha solo al desmontar. */
export const useDismiss = ({
  enabled,
  onDismiss,
  contains,
  escape = true,
  outside = true
}: UseDismissOptions): void => {
  useEffect(() => {
    if (!enabled) return

    return createDismiss({
      onDismiss,
      contains: () => contains.map((ref) => ref.current),
      escape,
      outside
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, escape, outside, onDismiss])
}
