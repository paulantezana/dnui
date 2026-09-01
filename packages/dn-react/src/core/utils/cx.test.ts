import { describe, expect, it } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('une clases separadas por espacio', () => {
    expect(cx('btn', 'btn-primary')).toBe('btn btn-primary')
  })

  it('descarta falsy', () => {
    expect(cx('btn', false, null, undefined, '', 'btn-sm')).toBe('btn btn-sm')
  })

  it('aplana arrays anidados', () => {
    expect(cx('btn', ['btn-primary', ['btn-sm']])).toBe('btn btn-primary btn-sm')
  })

  it('devuelve cadena vacia sin argumentos utiles', () => {
    expect(cx()).toBe('')
    expect(cx(false, null)).toBe('')
  })

  it('permite condicionales en linea', () => {
    const active = true
    expect(cx('menu-item', active && 'menu-active')).toBe('menu-item menu-active')
  })
})
