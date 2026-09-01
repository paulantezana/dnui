import { describe, expect, it } from 'vitest'
import { findActiveLink, isActiveLink, normalizeUrl } from './activeUrl'

describe('normalizeUrl', () => {
  it('quita el ancla vacia final', () => {
    expect(normalizeUrl('https://x.dev/a#')).toBe('https://x.dev/a')
  })

  it('conserva un ancla con nombre', () => {
    expect(normalizeUrl('https://x.dev/a#seccion')).toBe('https://x.dev/a#seccion')
  })
})

describe('isActiveLink', () => {
  const actual = 'https://x.dev/components/table'

  it('marca el enlace que apunta a la pagina actual', () => {
    expect(isActiveLink(actual, actual)).toBe(true)
  })

  it('ignora otras rutas', () => {
    expect(isActiveLink('https://x.dev/components/menu', actual)).toBe(false)
  })

  it('no considera activo un ancla suelta ni un href vacio', () => {
    expect(isActiveLink('#', actual)).toBe(false)
    expect(isActiveLink('', actual)).toBe(false)
  })

  it('trata igual la url con y sin ancla vacia final', () => {
    expect(isActiveLink(`${actual}#`, actual)).toBe(true)
    expect(isActiveLink(actual, `${actual}#`)).toBe(true)
  })

  it('distingue rutas que comparten prefijo', () => {
    expect(isActiveLink('https://x.dev/components/tab', actual)).toBe(false)
  })
})

describe('findActiveLink', () => {
  it('devuelve el indice del activo', () => {
    const hrefs = ['https://x.dev/a', 'https://x.dev/b', 'https://x.dev/c']
    expect(findActiveLink(hrefs, 'https://x.dev/b')).toBe(1)
  })

  it('devuelve -1 cuando ninguno coincide', () => {
    expect(findActiveLink(['https://x.dev/a'], 'https://x.dev/z')).toBe(-1)
  })
})
