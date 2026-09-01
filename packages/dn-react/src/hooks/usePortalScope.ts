import { useState } from 'react'

/**
 * Devuelve el contenedor de portales con esa clase, creandolo en `body` la
 * primera vez. Es idempotente, asi que la doble invocacion de StrictMode no
 * duplica nodos.
 */
const getScope = (className: string): HTMLElement | null => {
  if (typeof document === 'undefined') return null

  const existing = document.querySelector<HTMLElement>(`.${className}`)
  if (existing) return existing

  const element = document.createElement('div')
  element.classList.add(className)
  document.body.appendChild(element)
  return element
}

/**
 * Contenedor unico en `body` donde portalizar overlays. Equivale a los
 * `.MenuScope`, `.modal-gScope` y `.message-scope` que dn-ui crea a mano.
 */
export const usePortalScope = (className: string): HTMLElement | null => {
  const [scope] = useState(() => getScope(className))
  return scope
}
