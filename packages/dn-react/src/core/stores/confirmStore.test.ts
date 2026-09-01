import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createConfirmStore, type ConfirmStore } from './confirmStore'

let store: ConfirmStore

beforeEach(() => {
  store = createConfirmStore()
})

describe('confirmStore', () => {
  it('aplica los valores por defecto de dn-ui', () => {
    store.confirm({ title: 'Borrar' })
    const [item] = store.getSnapshot().items

    expect(item.confirm).toBe(true)
    expect(item.type).toBe('question')
    expect(item.okText).toBe('OK')
    expect(item.cancelText).toBe('Cancelar')
    expect(item.okClassNames).toBe('btn-primary')
    expect(item.input).toBe(false)
    expect(item.inputType).toBe('text')
  })

  it('info, success, danger y warning ocultan el boton de cancelar', () => {
    store.info({ title: 'a' })
    store.success({ title: 'b' })
    store.danger({ title: 'c' })
    store.warning({ title: 'd' })

    const items = store.getSnapshot().items
    expect(items.map((i) => i.confirm)).toEqual([false, false, false, false])
    expect(items.map((i) => i.type)).toEqual(['info', 'success', 'danger', 'warning'])
  })

  it('deja sobrescribir los textos', () => {
    store.confirm({ okText: 'Si', cancelText: 'No' })
    const [item] = store.getSnapshot().items

    expect(item.okText).toBe('Si')
    expect(item.cancelText).toBe('No')
  })

  it('conserva las callbacks', () => {
    const onOk = vi.fn()
    store.confirm({ onOk })

    store.getSnapshot().items[0].onOk?.('valor')
    expect(onOk).toHaveBeenCalledWith('valor')
  })

  it('apila varios dialogos en orden de apertura', () => {
    store.confirm({ title: 'a' })
    store.confirm({ title: 'b' })

    expect(store.getSnapshot().items.map((i) => i.title)).toEqual(['a', 'b'])
  })

  it('dismiss quita solo el indicado', () => {
    const first = store.confirm({ title: 'a' })
    store.confirm({ title: 'b' })

    store.dismiss(first)

    expect(store.getSnapshot().items.map((i) => i.title)).toEqual(['b'])
  })

  it('dismissAll vacia la cola', () => {
    store.confirm({ title: 'a' })
    store.confirm({ title: 'b' })
    store.dismissAll()

    expect(store.getSnapshot().items).toEqual([])
  })
})
