import { createStore } from './createStore'

export interface ModalStackState {
  /** Ids de los modales abiertos, del mas antiguo al mas reciente. */
  stack: string[]
}

export interface ScrollLock {
  lock(): void
  unlock(): void
}

/** Bloqueo de scroll sobre `document.body`, igual que dn-ui `modal.ts`. */
export const bodyScrollLock: ScrollLock = {
  lock() {
    document.body.style.overflow = 'hidden'
  },
  unlock() {
    document.body.style.overflow = 'auto'
  }
}

export interface ModalStackStore {
  getSnapshot(): ModalStackState
  subscribe(listener: () => void): () => void
  open(id: string): void
  close(id: string): void
  closeLast(): void
  closeAll(): void
  isOpen(id: string): boolean
  top(): string | null
}

/**
 * Pila de modales abiertos. dn-ui apila igual, pero su `close()` pone
 * `body.overflow = 'auto'` incondicionalmente, asi que cerrar un modal
 * desbloquea el scroll aunque queden otros abiertos. Aqui el bloqueo va por
 * contador: se libera solo cuando la pila queda vacia.
 */
export const createModalStack = (scrollLock: ScrollLock = bodyScrollLock): ModalStackStore => {
  const store = createStore<ModalStackState>({ stack: [] })

  const commit = (stack: string[]) => {
    const wasEmpty = store.getSnapshot().stack.length === 0
    const isEmpty = stack.length === 0

    store.set({ stack })

    if (wasEmpty && !isEmpty) scrollLock.lock()
    if (!wasEmpty && isEmpty) scrollLock.unlock()
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,

    open(id) {
      const { stack } = store.getSnapshot()
      if (stack.includes(id)) return
      commit([...stack, id])
    },

    close(id) {
      const { stack } = store.getSnapshot()
      if (!stack.includes(id)) return
      commit(stack.filter((item) => item !== id))
    },

    closeLast() {
      const { stack } = store.getSnapshot()
      if (stack.length === 0) return
      commit(stack.slice(0, -1))
    },

    closeAll() {
      if (store.getSnapshot().stack.length === 0) return
      commit([])
    },

    isOpen(id) {
      return store.getSnapshot().stack.includes(id)
    },

    top() {
      const { stack } = store.getSnapshot()
      return stack.length > 0 ? stack[stack.length - 1] : null
    }
  }
}

export const modalStack = createModalStack()
