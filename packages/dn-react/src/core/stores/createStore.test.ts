import { describe, expect, it, vi } from 'vitest'
import { createStore } from './createStore'

describe('createStore', () => {
  it('devuelve el estado inicial', () => {
    expect(createStore({ n: 1 }).getSnapshot()).toEqual({ n: 1 })
  })

  it('notifica a los suscriptores al cambiar', () => {
    const store = createStore(0)
    const listener = vi.fn()
    store.subscribe(listener)

    store.set(1)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.getSnapshot()).toBe(1)
  })

  it('acepta un updater funcional', () => {
    const store = createStore(1)
    store.set((prev) => prev + 41)
    expect(store.getSnapshot()).toBe(42)
  })

  it('no notifica si el valor no cambia', () => {
    const store = createStore(1)
    const listener = vi.fn()
    store.subscribe(listener)

    store.set(1)

    expect(listener).not.toHaveBeenCalled()
  })

  it('unsubscribe deja de notificar', () => {
    const store = createStore(0)
    const listener = vi.fn()
    store.subscribe(listener)()

    store.set(1)

    expect(listener).not.toHaveBeenCalled()
  })

  it('mantiene la identidad del snapshot entre cambios, para useSyncExternalStore', () => {
    const store = createStore({ n: 1 })
    const first = store.getSnapshot()
    expect(store.getSnapshot()).toBe(first)
  })
})
