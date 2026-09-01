export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const isVisible = (el: HTMLElement): boolean =>
  !el.hasAttribute('inert') &&
  el.getAttribute('aria-hidden') !== 'true' &&
  !el.closest('[inert]')

/** Elementos enfocables del contenedor, en orden de tabulacion. */
export const getFocusable = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible)

export interface FocusTrapOptions {
  /** Que enfocar al activar. Por defecto, el primer enfocable del contenedor. */
  initialFocus?: HTMLElement | (() => HTMLElement | null) | null
  /** Adonde devolver el foco al desactivar. Por defecto, donde estaba antes. */
  returnFocus?: HTMLElement | null
}

export interface FocusTrap {
  activate(): void
  deactivate(): void
}

/**
 * Mantiene el foco dentro de `container` mientras esta activo y lo devuelve al
 * desactivarse. dn-ui no tiene nada equivalente: sus modales dejan escapar el
 * foco al fondo de la pagina.
 */
export const createFocusTrap = (
  container: HTMLElement,
  options: FocusTrapOptions = {}
): FocusTrap => {
  let previouslyFocused: HTMLElement | null = null
  let active = false

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return

    const focusable = getFocusable(container)
    if (focusable.length === 0) {
      event.preventDefault()
      container.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const activeEl = document.activeElement as HTMLElement | null

    if (event.shiftKey && (activeEl === first || !container.contains(activeEl))) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && (activeEl === last || !container.contains(activeEl))) {
      event.preventDefault()
      first.focus()
    }
  }

  return {
    activate() {
      if (active) return
      active = true
      previouslyFocused = document.activeElement as HTMLElement | null

      const requested =
        typeof options.initialFocus === 'function' ? options.initialFocus() : options.initialFocus
      const target = requested ?? getFocusable(container)[0] ?? container

      if (target === container && !container.hasAttribute('tabindex')) {
        container.setAttribute('tabindex', '-1')
      }
      target.focus()

      document.addEventListener('keydown', onKeyDown, true)
    },

    deactivate() {
      if (!active) return
      active = false
      document.removeEventListener('keydown', onKeyDown, true)

      const target = options.returnFocus ?? previouslyFocused
      if (target && typeof target.focus === 'function' && document.contains(target)) {
        target.focus()
      }
      previouslyFocused = null
    }
  }
}
