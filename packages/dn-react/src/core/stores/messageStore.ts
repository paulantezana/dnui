import type { IconType } from '../utils/icon'
import { uniqueId } from '../utils/uniqueId'
import { createStore } from './createStore'

export type MessageType = 'info' | 'success' | 'warning' | 'danger' | 'default'

export interface MessageItem {
  id: number
  content: string
  type: MessageType
  icon: IconType
  /** ms hasta el cierre automatico. `Infinity` = no se cierra solo. */
  duration: number
}

export interface MessageOptions {
  content?: string
  duration?: number
}

export interface MessageState {
  items: MessageItem[]
}

/** Duracion por defecto de info/success/warning/danger en dn-ui `message.ts`. */
export const DEFAULT_DURATION = 6000
/** dn-ui sustituye cualquier duracion falsy por 20 s en `message()`. */
export const FALLBACK_DURATION = 20000

const ICON_BY_TYPE: Record<MessageType, IconType> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  default: 'question'
}

export interface MessageStore {
  getSnapshot(): MessageState
  subscribe(listener: () => void): () => void
  message(content: string, duration?: number, type?: MessageType): number
  info(options: MessageOptions | string, duration?: number): number
  success(options: MessageOptions | string, duration?: number): number
  warning(options: MessageOptions | string, duration?: number): number
  danger(options: MessageOptions | string, duration?: number): number
  update(id: number, patch: Partial<Omit<MessageItem, 'id'>>): void
  close(id: number): void
  closeAll(): void
  getAll(): MessageItem[]
}

const normalize = (options: MessageOptions | string, duration?: number): MessageOptions =>
  typeof options === 'string' ? { content: options, duration } : options

/**
 * Cola de mensajes. dn-ui monta y desmonta el DOM a mano; aqui el store solo
 * mantiene la lista y el componente la pinta. `close`, `closeAll`, `getAll` y
 * `update` no existen en dn-ui pero hacen falta para limpiar al desmontar, y ya
 * estaban documentados en la pagina de demo.
 */
export const createMessageStore = (): MessageStore => {
  const store = createStore<MessageState>({ items: [] })

  const push = (content: string, duration: number, type: MessageType): number => {
    const id = uniqueId()
    const item: MessageItem = { id, content, type, icon: ICON_BY_TYPE[type], duration }
    store.set((prev) => ({ items: [item, ...prev.items] }))
    return id
  }

  const withDefault = (options: MessageOptions | string, duration: number | undefined, type: MessageType) => {
    const normalized = normalize(options, duration)
    return push(normalized.content ?? '', normalized.duration ?? DEFAULT_DURATION, type)
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,

    message(content, duration, type = 'default') {
      return push(content, duration || FALLBACK_DURATION, type)
    },

    info: (options, duration) => withDefault(options, duration, 'info'),
    success: (options, duration) => withDefault(options, duration, 'success'),
    warning: (options, duration) => withDefault(options, duration, 'warning'),
    danger: (options, duration) => withDefault(options, duration, 'danger'),

    update(id, patch) {
      store.set((prev) => ({
        items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item))
      }))
    },

    close(id) {
      store.set((prev) => {
        const items = prev.items.filter((item) => item.id !== id)
        return items.length === prev.items.length ? prev : { items }
      })
    },

    closeAll() {
      if (store.getSnapshot().items.length === 0) return
      store.set({ items: [] })
    },

    getAll() {
      return store.getSnapshot().items
    }
  }
}

export const messageStore = createMessageStore()
