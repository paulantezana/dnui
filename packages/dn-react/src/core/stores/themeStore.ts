import { createStore } from './createStore'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeState {
  /** Lo que eligio la persona. */
  preference: ThemePreference
  /** Lo que se esta pintando de verdad. */
  resolved: ResolvedTheme
}

export const THEME_STORAGE_KEY = 'theme'
/** Clase que activa la variante oscura definida en `styles.css`. */
export const DARK_CLASS = 'dark'

const canUseDom = (): boolean => typeof document !== 'undefined'

const readStored = (): ThemePreference | null => {
  if (typeof localStorage === 'undefined') return null
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' || value === 'system' ? value : null
  } catch {
    return null
  }
}

const prefersDark = (): boolean =>
  typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches

export const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? (prefersDark() ? 'dark' : 'light') : preference

export interface ThemeStore {
  getSnapshot(): ThemeState
  subscribe(listener: () => void): () => void
  set(preference: ThemePreference): void
  toggle(): void
  /** Aplica el tema guardado y sigue los cambios del sistema. Devuelve el cleanup. */
  init(): () => void
}

/**
 * dn-ui `theme/theme.ts` pone `theme-light` / `theme-dark` en `<html>` y guarda
 * en `sessionStorage`, pero los tokens de `styles.css` usan la clase `dark` y el
 * demo guarda en `localStorage` bajo la clave `theme`. Se sigue lo que el CSS
 * necesita de verdad; la API (`light` / `dark` / `system`) es la misma.
 */
export const createThemeStore = (): ThemeStore => {
  let suscriptores = 0
  let media: MediaQueryList | null = null
  let onSystemChange: (() => void) | null = null

  const initialPreference = readStored() ?? 'system'
  const store = createStore<ThemeState>({
    preference: initialPreference,
    resolved: canUseDom() ? resolveTheme(initialPreference) : 'light'
  })

  const apply = (resolved: ResolvedTheme) => {
    if (!canUseDom()) return
    document.documentElement.classList.toggle(DARK_CLASS, resolved === 'dark')
  }

  const commit = (preference: ThemePreference, persist: boolean) => {
    const resolved = resolveTheme(preference)
    store.set({ preference, resolved })
    apply(resolved)

    if (!persist || typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference)
    } catch {
      /* modo privado o storage lleno: el tema sigue aplicado en memoria */
    }
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,

    set(preference) {
      commit(preference, true)
    },

    toggle() {
      commit(store.getSnapshot().resolved === 'dark' ? 'light' : 'dark', true)
    },

    init() {
      commit(store.getSnapshot().preference, false)

      if (typeof matchMedia !== 'function') return () => {}

      // Varios consumidores pueden llamar a init(); solo el primero engancha el
      // listener y solo el ultimo en soltarlo lo quita.
      suscriptores += 1

      if (suscriptores === 1) {
        media = matchMedia('(prefers-color-scheme: dark)')
        onSystemChange = () => {
          if (store.getSnapshot().preference !== 'system') return
          commit('system', false)
        }
        media.addEventListener('change', onSystemChange)
      }

      let liberado = false
      return () => {
        if (liberado) return
        liberado = true
        suscriptores -= 1

        if (suscriptores === 0 && media && onSystemChange) {
          media.removeEventListener('change', onSystemChange)
          media = null
          onSystemChange = null
        }
      }
    }
  }
}

export const themeStore = createThemeStore()
