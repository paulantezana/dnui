import { describe, expect, it } from 'vitest'
import { uniqueId } from './uniqueId'

describe('uniqueId', () => {
  it('devuelve un entero que empieza por 1', () => {
    const id = uniqueId()
    expect(Number.isInteger(id)).toBe(true)
    expect(String(id).startsWith('1')).toBe(true)
  })

  it('respeta la longitud pedida mas el 1 inicial', () => {
    expect(String(uniqueId(6))).toHaveLength(7)
    expect(String(uniqueId(10))).toHaveLength(11)
  })

  it('genera valores distintos en llamadas sucesivas', () => {
    const ids = new Set(Array.from({ length: 200 }, () => uniqueId(10)))
    expect(ids.size).toBeGreaterThan(150)
  })
})
