import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { createModalStack, type ModalStackStore } from './modalStack'

let store: ModalStackStore
let lock: { lock: Mock<() => void>; unlock: Mock<() => void> }

beforeEach(() => {
  lock = { lock: vi.fn(() => {}), unlock: vi.fn(() => {}) }
  store = createModalStack(lock)
})

describe('modalStack', () => {
  it('apila en orden de apertura', () => {
    store.open('a')
    store.open('b')

    expect(store.getSnapshot().stack).toEqual(['a', 'b'])
    expect(store.top()).toBe('b')
  })

  it('ignora una apertura repetida', () => {
    store.open('a')
    store.open('a')

    expect(store.getSnapshot().stack).toEqual(['a'])
  })

  it('closeLast cierra solo el ultimo', () => {
    store.open('a')
    store.open('b')
    store.closeLast()

    expect(store.getSnapshot().stack).toEqual(['a'])
  })

  it('close saca uno del medio sin tocar el resto', () => {
    store.open('a')
    store.open('b')
    store.open('c')
    store.close('b')

    expect(store.getSnapshot().stack).toEqual(['a', 'c'])
  })

  it('bloquea el scroll solo al abrir el primero', () => {
    store.open('a')
    store.open('b')

    expect(lock.lock).toHaveBeenCalledTimes(1)
  })

  it('no libera el scroll mientras quede algun modal abierto', () => {
    store.open('a')
    store.open('b')
    store.close('b')

    expect(lock.unlock).not.toHaveBeenCalled()

    store.close('a')
    expect(lock.unlock).toHaveBeenCalledTimes(1)
  })

  it('closeAll vacia la pila y libera el scroll', () => {
    store.open('a')
    store.open('b')
    store.closeAll()

    expect(store.getSnapshot().stack).toEqual([])
    expect(lock.unlock).toHaveBeenCalledTimes(1)
  })

  it('top devuelve null con la pila vacia', () => {
    expect(store.top()).toBeNull()
  })
})
