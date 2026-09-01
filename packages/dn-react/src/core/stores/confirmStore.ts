import type { IconType } from '../utils/icon'
import { uniqueId } from '../utils/uniqueId'
import { createStore } from './createStore'

export type ConfirmCallback = (value?: string) => void

/** Mismas opciones y valores por defecto que `Modal.confirm` en dn-ui. */
export interface ConfirmOptions {
  /** Muestra el boton de cancelar. `info`, `success`, etc. lo ponen en false. */
  confirm?: boolean
  title?: string
  type?: IconType
  content?: string
  input?: boolean
  inputValue?: string
  inputType?: string
  okClassNames?: string
  cancelClassNames?: string
  cancelText?: string
  okText?: string
  onOk?: ConfirmCallback
  onCancel?: ConfirmCallback
}

export interface ConfirmRequest extends Required<Omit<ConfirmOptions, 'onOk' | 'onCancel'>> {
  id: number
  onOk?: ConfirmCallback
  onCancel?: ConfirmCallback
}

export interface ConfirmState {
  items: ConfirmRequest[]
}

const DEFAULTS = {
  confirm: true,
  title: '',
  type: 'question' as IconType,
  content: '',
  input: false,
  inputValue: '',
  inputType: 'text',
  okClassNames: 'btn-primary',
  cancelClassNames: '',
  cancelText: 'Cancelar',
  okText: 'OK'
}

export interface ConfirmStore {
  getSnapshot(): ConfirmState
  subscribe(listener: () => void): () => void
  confirm(options: ConfirmOptions): number
  info(options: ConfirmOptions): number
  success(options: ConfirmOptions): number
  danger(options: ConfirmOptions): number
  warning(options: ConfirmOptions): number
  dismiss(id: number): void
  dismissAll(): void
}

/** Cola de dialogos abiertos por la API imperativa `modal.confirm(...)`. */
export const createConfirmStore = (): ConfirmStore => {
  const store = createStore<ConfirmState>({ items: [] })

  const push = (options: ConfirmOptions): number => {
    const id = uniqueId()
    const request: ConfirmRequest = { ...DEFAULTS, ...options, id }
    store.set((prev) => ({ items: [...prev.items, request] }))
    return id
  }

  const shorthand = (type: IconType) => (options: ConfirmOptions) =>
    push({ okText: 'OK', ...options, confirm: false, type })

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,

    confirm: push,
    info: shorthand('info'),
    success: shorthand('success'),
    danger: shorthand('danger'),
    warning: shorthand('warning'),

    dismiss(id) {
      store.set((prev) => {
        const items = prev.items.filter((item) => item.id !== id)
        return items.length === prev.items.length ? prev : { items }
      })
    },

    dismissAll() {
      if (store.getSnapshot().items.length === 0) return
      store.set({ items: [] })
    }
  }
}

export const confirmStore = createConfirmStore()
