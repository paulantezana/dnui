import { describe, expect, it } from 'vitest'
import { nextRovingIndex } from './rovingFocus'

describe('nextRovingIndex', () => {
  it('avanza y retrocede en vertical', () => {
    expect(nextRovingIndex(0, 5, 'ArrowDown')).toBe(1)
    expect(nextRovingIndex(3, 5, 'ArrowUp')).toBe(2)
  })

  it('se detiene en los extremos sin loop, como dn-ui', () => {
    expect(nextRovingIndex(4, 5, 'ArrowDown')).toBe(4)
    expect(nextRovingIndex(0, 5, 'ArrowUp')).toBe(0)
  })

  it('da la vuelta cuando loop esta activo', () => {
    expect(nextRovingIndex(4, 5, 'ArrowDown', { loop: true })).toBe(0)
    expect(nextRovingIndex(0, 5, 'ArrowUp', { loop: true })).toBe(4)
  })

  it('Home y End saltan a los extremos', () => {
    expect(nextRovingIndex(2, 5, 'Home')).toBe(0)
    expect(nextRovingIndex(2, 5, 'End')).toBe(4)
  })

  it('ignora las flechas horizontales en orientacion vertical', () => {
    expect(nextRovingIndex(1, 5, 'ArrowRight')).toBeNull()
    expect(nextRovingIndex(1, 5, 'ArrowLeft')).toBeNull()
  })

  it('usa las flechas horizontales en orientacion horizontal', () => {
    expect(nextRovingIndex(1, 5, 'ArrowRight', { orientation: 'horizontal' })).toBe(2)
    expect(nextRovingIndex(1, 5, 'ArrowLeft', { orientation: 'horizontal' })).toBe(0)
    expect(nextRovingIndex(1, 5, 'ArrowDown', { orientation: 'horizontal' })).toBeNull()
  })

  it('acepta las cuatro flechas en orientacion both', () => {
    expect(nextRovingIndex(1, 5, 'ArrowRight', { orientation: 'both' })).toBe(2)
    expect(nextRovingIndex(1, 5, 'ArrowUp', { orientation: 'both' })).toBe(0)
  })

  it('devuelve null para teclas que no navegan o listas vacias', () => {
    expect(nextRovingIndex(0, 5, 'a')).toBeNull()
    expect(nextRovingIndex(0, 0, 'ArrowDown')).toBeNull()
  })
})
