import { describe, expect, it } from 'vitest'
import { formatNumber } from './formatNumber'

describe('formatNumber', () => {
  it('agrupa miles y redondea a dos decimales', () => {
    expect(formatNumber(1234.5678)).toBe('1,234.57')
  })

  it('rellena decimales en enteros', () => {
    expect(formatNumber(0)).toBe('0.00')
    expect(formatNumber('42')).toBe('42.00')
  })

  it('conserva el signo delante del numero', () => {
    expect(formatNumber(-9876.5)).toBe('-9,876.50')
  })

  it('respeta la precision indicada', () => {
    expect(formatNumber(1234.5678, 0)).toBe('1,235')
    expect(formatNumber(1000000, 3)).toBe('1,000,000.000')
  })

  it('devuelve el numero 0 cuando la entrada no es parseable', () => {
    expect(formatNumber('abc')).toBe(0)
    expect(formatNumber('')).toBe(0)
  })

  it('parsea prefijos numericos como lo hace parseFloat', () => {
    expect(formatNumber('12.5abc')).toBe('12.50')
  })
})
