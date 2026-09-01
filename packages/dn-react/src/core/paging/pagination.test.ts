import { describe, expect, it } from 'vitest'
import { DEFAULT_LIMIT_OPTIONS, paginationSummary } from './pagination'

describe('paginationSummary', () => {
  it('calcula el rango de filas de la primera pagina', () => {
    const s = paginationSummary({ current: 1, pages: 5, limit: 20, total: 93 })

    expect(s.startRow).toBe(1)
    expect(s.endRow).toBe(20)
    expect(s.isFirst).toBe(true)
    expect(s.isLast).toBe(false)
  })

  it('calcula el rango de una pagina intermedia', () => {
    const s = paginationSummary({ current: 3, pages: 5, limit: 20, total: 93 })

    expect(s.startRow).toBe(41)
    expect(s.endRow).toBe(60)
    expect(s.isFirst).toBe(false)
    expect(s.isLast).toBe(false)
  })

  it('recorta la ultima pagina al total real', () => {
    const s = paginationSummary({ current: 5, pages: 5, limit: 20, total: 93 })

    expect(s.startRow).toBe(81)
    expect(s.endRow).toBe(93)
    expect(s.isLast).toBe(true)
  })

  it('acepta los valores como cadena, que es como llegan del backend', () => {
    const s = paginationSummary({ current: '2', pages: '4', limit: '10', total: '35' })

    expect(s.page).toBe(2)
    expect(s.pages).toBe(4)
    expect(s.startRow).toBe(11)
    expect(s.endRow).toBe(20)
  })

  it('marca primera y ultima a la vez cuando solo hay una pagina', () => {
    const s = paginationSummary({ current: 1, pages: 1, limit: 20, total: 7 })

    expect(s.isFirst).toBe(true)
    expect(s.isLast).toBe(true)
    expect(s.endRow).toBe(7)
  })

  it('reproduce el caso sin resultados de dn-ui', () => {
    const s = paginationSummary({ current: 1, pages: 1, limit: 20, total: 0 })

    expect(s.startRow).toBe(1)
    expect(s.endRow).toBe(0)
    expect(s.total).toBe(0)
  })

  it('no propaga NaN cuando el backend manda basura', () => {
    const s = paginationSummary({ current: '', pages: 'x', limit: null as never, total: undefined as never })

    expect(Number.isNaN(s.page)).toBe(false)
    expect(Number.isNaN(s.startRow)).toBe(false)
    expect(Number.isNaN(s.endRow)).toBe(false)
  })

  it('conserva los tamanos de pagina de dn-ui', () => {
    expect([...DEFAULT_LIMIT_OPTIONS]).toEqual([10, 20, 50, 100, 200, 300, 500, 1000])
  })
})
