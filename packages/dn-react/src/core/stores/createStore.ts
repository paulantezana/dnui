export type Listener = () => void

export interface Store<T> {
  getSnapshot(): T
  subscribe(listener: Listener): () => void
  set(updater: T | ((prev: T) => T)): void
}

/**
 * Store minimo con la forma que espera `useSyncExternalStore`. No sabe nada de
 * React: cualquier framework puede suscribirse. Es toda la maquinaria de estado
 * compartido que necesita la libreria.
 */
export const createStore = <T,>(initial: T): Store<T> => {
  let state = initial
  const listeners = new Set<Listener>()

  return {
    getSnapshot: () => state,

    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    set(updater) {
      const next =
        typeof updater === 'function' ? (updater as (prev: T) => T)(state) : updater
      if (Object.is(next, state)) return
      state = next
      listeners.forEach((listener) => listener())
    }
  }
}
