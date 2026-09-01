import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMenuStore, type MenuStore } from './menuStore'

let store: MenuStore

beforeEach(() => {
  store = createMenuStore()
})

describe('menuStore', () => {
  it('empieza sin nada abierto', () => {
    expect(store.getSnapshot().openKey).toBeNull()
  })

  it('abre un menu', () => {
    store.open('acciones')
    expect(store.isOpen('acciones')).toBe(true)
  })

  it('solo permite un menu abierto a la vez, como dn-ui', () => {
    store.open('acciones')
    store.open('columnas')

    expect(store.isOpen('acciones')).toBe(false)
    expect(store.isOpen('columnas')).toBe(true)
  })

  it('toggle cierra el que ya estaba abierto', () => {
    store.toggle('acciones')
    expect(store.isOpen('acciones')).toBe(true)

    store.toggle('acciones')
    expect(store.getSnapshot().openKey).toBeNull()
  })

  it('toggle cambia de menu cuando la clave es distinta', () => {
    store.toggle('acciones')
    store.toggle('columnas')

    expect(store.isOpen('columnas')).toBe(true)
  })

  it('guarda autoClose por menu', () => {
    store.open('filtros', { autoClose: false })
    expect(store.getSnapshot().autoClose).toBe(false)

    store.open('acciones')
    expect(store.getSnapshot().autoClose).toBe(true)
  })

  it('close no notifica si ya estaba cerrado', () => {
    const listener = vi.fn()
    store.subscribe(listener)

    store.close()

    expect(listener).not.toHaveBeenCalled()
  })
})
