/** dn-ui compara contra `location.href` sin el `#` final. */
export const normalizeUrl = (url: string): string => url.replace(/#$/, '')

/**
 * Si un enlace apunta a la pagina actual. Reproduce la comparacion de dn-ui
 * `navigation.ts`: igualdad exacta de `href` absoluto, descartando el ancla suelta.
 */
export const isActiveLink = (href: string, currentUrl: string): boolean => {
  if (!href || href === '#') return false
  return normalizeUrl(href) === normalizeUrl(currentUrl)
}

/**
 * Indice del enlace activo dentro de una lista de `href`, o -1.
 * Util para marcar `aria-current` sin tocar el DOM.
 */
export const findActiveLink = (hrefs: string[], currentUrl: string): number =>
  hrefs.findIndex((href) => isActiveLink(href, currentUrl))
