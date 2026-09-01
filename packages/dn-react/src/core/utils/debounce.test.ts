import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('no ejecuta antes de que pase la espera', () => {
    const fn = vi.fn()
    debounce(fn, 300)()

    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('colapsa varias llamadas seguidas en una sola', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('conserva los argumentos de la ultima llamada', () => {
    const fn = vi.fn<(value: string) => void>()
    const debounced = debounce(fn, 100)

    debounced('primero')
    debounced('ultimo')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith('ultimo')
  })

  it('usa 300 ms cuando no se indica espera', () => {
    const fn = vi.fn()
    debounce(fn)()

    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('cancel evita la ejecucion pendiente', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced.cancel()
    vi.advanceTimersByTime(500)

    expect(fn).not.toHaveBeenCalled()
  })
})
