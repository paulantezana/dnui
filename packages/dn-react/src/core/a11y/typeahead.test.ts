import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTypeahead, matchTypeahead } from './typeahead'

describe('createTypeahead', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('acumula caracteres', () => {
    const t = createTypeahead()
    expect(t.push('c')).toBe('c')
    expect(t.push('a')).toBe('ca')
    expect(t.buffer).toBe('ca')
  })

  it('se vacia tras el timeout de inactividad', () => {
    const t = createTypeahead(500)
    t.push('c')
    vi.advanceTimersByTime(499)
    expect(t.buffer).toBe('c')
    vi.advanceTimersByTime(1)
    expect(t.buffer).toBe('')
  })

  it('cada tecla reinicia el timeout', () => {
    const t = createTypeahead(500)
    t.push('c')
    vi.advanceTimersByTime(400)
    t.push('a')
    vi.advanceTimersByTime(400)
    expect(t.buffer).toBe('ca')
  })

  it('reset vacia el buffer de inmediato', () => {
    const t = createTypeahead()
    t.push('c')
    t.reset()
    expect(t.buffer).toBe('')
  })
})

describe('matchTypeahead', () => {
  const labels = ['Archivo', 'Editar', 'Ver', 'Exportar', 'Ayuda']

  it('encuentra por prefijo sin distinguir mayusculas', () => {
    expect(matchTypeahead(labels, 'ed')).toBe(1)
    expect(matchTypeahead(labels, 'VE')).toBe(2)
  })

  it('busca en circulo a partir del indice dado', () => {
    expect(matchTypeahead(labels, 'a', 0)).toBe(4)
    expect(matchTypeahead(labels, 'a', 4)).toBe(0)
  })

  it('cicla entre coincidencias cuando se repite la misma letra', () => {
    expect(matchTypeahead(labels, 'ee', 1)).toBe(3)
    expect(matchTypeahead(labels, 'eee', 3)).toBe(1)
  })

  it('ignora espacios alrededor de la etiqueta', () => {
    expect(matchTypeahead(['  Guardar  '], 'gu')).toBe(0)
  })

  it('devuelve -1 cuando no hay coincidencia o no hay buffer', () => {
    expect(matchTypeahead(labels, 'zz')).toBe(-1)
    expect(matchTypeahead(labels, '')).toBe(-1)
    expect(matchTypeahead([], 'a')).toBe(-1)
  })
})
