import { beforeEach, describe, expect, it } from 'vitest'
import {
  createMessageStore,
  DEFAULT_DURATION,
  FALLBACK_DURATION,
  type MessageStore
} from './messageStore'

let store: MessageStore

beforeEach(() => {
  store = createMessageStore()
})

describe('messageStore', () => {
  it('encola el mas reciente primero, como el prepend de dn-ui', () => {
    store.info('primero')
    store.info('segundo')

    expect(store.getAll().map((m) => m.content)).toEqual(['segundo', 'primero'])
  })

  it('acepta tanto objeto como cadena', () => {
    store.info({ content: 'objeto' })
    store.success('cadena')

    expect(store.getAll().map((m) => m.content)).toEqual(['cadena', 'objeto'])
  })

  it('usa 6000 ms por defecto', () => {
    store.info('hola')
    expect(store.getAll()[0].duration).toBe(DEFAULT_DURATION)
  })

  it('respeta la duracion explicita', () => {
    store.warning('ojo', 1500)
    expect(store.getAll()[0].duration).toBe(1500)
  })

  it('message sustituye una duracion falsy por 20 s, igual que dn-ui', () => {
    store.message('sin duracion')
    expect(store.getAll()[0].duration).toBe(FALLBACK_DURATION)

    store.message('cero', 0)
    expect(store.getAll()[0].duration).toBe(FALLBACK_DURATION)
  })

  it('asigna el icono correspondiente al tipo', () => {
    store.danger('error')
    store.success('ok')

    const [ok, error] = store.getAll()
    expect(ok.icon).toBe('success')
    expect(error.icon).toBe('danger')
  })

  it('devuelve un id con el que cerrar el mensaje', () => {
    const id = store.info('cargando', Infinity)
    expect(store.getAll()).toHaveLength(1)

    store.close(id)
    expect(store.getAll()).toHaveLength(0)
  })

  it('update modifica solo el mensaje indicado', () => {
    const id = store.info('cargando')
    store.info('otro')

    store.update(id, { content: 'listo', type: 'success' })

    const updated = store.getAll().find((m) => m.id === id)!
    expect(updated.content).toBe('listo')
    expect(updated.type).toBe('success')
    expect(store.getAll().find((m) => m.id !== id)!.content).toBe('otro')
  })

  it('closeAll vacia la cola', () => {
    store.info('a')
    store.info('b')
    store.closeAll()

    expect(store.getAll()).toEqual([])
  })

  it('permite duracion infinita para mensajes persistentes', () => {
    store.info('cargando', Infinity)
    expect(store.getAll()[0].duration).toBe(Infinity)
  })
})
