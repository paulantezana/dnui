import { createStore } from './createStore'

export interface MenuState {
  /** Clave del unico menu abierto, o null. */
  openKey: string | null
  /** Si un click fuera del overlay lo cierra. */
  autoClose: boolean
}

const INITIAL: MenuState = { openKey: null, autoClose: true }

export interface MenuStore {
  getSnapshot(): MenuState
  subscribe(listener: () => void): () => void
  open(key: string, options?: { autoClose?: boolean }): void
  close(): void
  toggle(key: string, options?: { autoClose?: boolean }): void
  isOpen(key: string): boolean
}

/**
 * dn-ui `menu.ts` guarda un unico `Menu.openMenu` estatico: solo puede haber un
 * menu abierto en toda la aplicacion. Se conserva esa semantica exacta.
 */
export const createMenuStore = (): MenuStore => {
  const store = createStore<MenuState>(INITIAL)

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,

    open(key, options = {}) {
      store.set({ openKey: key, autoClose: options.autoClose ?? true })
    },

    close() {
      if (store.getSnapshot().openKey === null) return
      store.set(INITIAL)
    },

    toggle(key, options = {}) {
      if (store.getSnapshot().openKey === key) {
        store.set(INITIAL)
        return
      }
      store.set({ openKey: key, autoClose: options.autoClose ?? true })
    },

    isOpen(key) {
      return store.getSnapshot().openKey === key
    }
  }
}

export const menuStore = createMenuStore()
