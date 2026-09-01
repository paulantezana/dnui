import { useSyncExternalStore } from 'react'

export interface ReadableStore<T> {
  getSnapshot(): T
  subscribe(listener: () => void): () => void
}

/**
 * Puente entre los stores de `src/core/stores` y React. El store no sabe nada de
 * React; este hook es todo el pegamento que hace falta.
 */
export const useStore = <T,>(store: ReadableStore<T>): T =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
