import { useCallback, useMemo, useRef, type KeyboardEvent, type RefObject } from 'react'
import { nextRovingIndex, type Orientation } from '../core/a11y/rovingFocus'
import { createTypeahead, matchTypeahead } from '../core/a11y/typeahead'

export interface UseRovingFocusOptions {
  containerRef: RefObject<HTMLElement | null>
  /** Selector de los elementos navegables dentro del contenedor. */
  itemSelector?: string
  orientation?: Orientation
  loop?: boolean
  /** Saltar al elemento cuyo texto empieza por lo que se teclea. */
  typeahead?: boolean
}

export interface RovingFocus {
  onKeyDown(event: KeyboardEvent): void
  focusIndex(index: number): void
  focusFirst(): void
  focusLast(): void
}

/**
 * Foco itinerante con flechas, Home/End y escritura rapida. Generaliza el
 * recorrido que dn-ui solo tenia en `filterColumn.ts`.
 */
export const useRovingFocus = ({
  containerRef,
  itemSelector = '[data-roving-item]:not([aria-disabled="true"])',
  orientation = 'vertical',
  loop = false,
  typeahead = false
}: UseRovingFocusOptions): RovingFocus => {
  const buffer = useMemo(() => createTypeahead(), [])
  const itemsRef = useRef<HTMLElement[]>([])

  const readItems = useCallback((): HTMLElement[] => {
    const container = containerRef.current
    itemsRef.current = container
      ? Array.from(container.querySelectorAll<HTMLElement>(itemSelector))
      : []
    return itemsRef.current
  }, [containerRef, itemSelector])

  const focusIndex = useCallback(
    (index: number) => {
      const items = readItems()
      items[index]?.focus()
    },
    [readItems]
  )

  const focusFirst = useCallback(() => focusIndex(0), [focusIndex])
  const focusLast = useCallback(() => focusIndex(readItems().length - 1), [focusIndex, readItems])

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const items = readItems()
      if (items.length === 0) return

      const current = items.indexOf(document.activeElement as HTMLElement)
      const target = nextRovingIndex(current, items.length, event.key, { orientation, loop })

      if (target !== null) {
        event.preventDefault()
        items[target]?.focus()
        return
      }

      if (!typeahead) return
      if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return

      const query = buffer.push(event.key)
      const labels = items.map((item) => item.textContent ?? '')
      const match = matchTypeahead(labels, query, current)

      if (match !== -1) {
        event.preventDefault()
        items[match]?.focus()
      }
    },
    [buffer, loop, orientation, readItems, typeahead]
  )

  return { onKeyDown, focusIndex, focusFirst, focusLast }
}
