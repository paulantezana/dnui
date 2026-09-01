import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createThemeStore, DARK_CLASS, THEME_STORAGE_KEY } from './themeStore'

const setSystemDark = (dark: boolean) => {
  const listeners = new Set<() => void>()
  const media = {
    matches: dark,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn)
  }
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(media))
  return {
    emit(next: boolean) {
      media.matches = next
      listeners.forEach((fn) => fn())
    },
    listenerCount: () => listeners.size
  }
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.className = ''
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('themeStore', () => {
  it('sin nada guardado arranca en system', () => {
    setSystemDark(false)
    expect(createThemeStore().getSnapshot().preference).toBe('system')
  })

  it('resuelve system segun prefers-color-scheme', () => {
    setSystemDark(true)
    expect(createThemeStore().getSnapshot().resolved).toBe('dark')
  })

  it('lee la preferencia guardada', () => {
    setSystemDark(false)
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')

    expect(createThemeStore().getSnapshot().resolved).toBe('dark')
  })

  it('pone la clase dark en el elemento raiz', () => {
    setSystemDark(false)
    const store = createThemeStore()

    store.set('dark')
    expect(document.documentElement).toHaveClass(DARK_CLASS)

    store.set('light')
    expect(document.documentElement).not.toHaveClass(DARK_CLASS)
  })

  it('persiste la eleccion', () => {
    setSystemDark(false)
    createThemeStore().set('dark')

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('toggle alterna entre claro y oscuro', () => {
    setSystemDark(false)
    const store = createThemeStore()

    store.toggle()
    expect(store.getSnapshot().resolved).toBe('dark')

    store.toggle()
    expect(store.getSnapshot().resolved).toBe('light')
  })

  it('sigue los cambios del sistema solo en modo system', () => {
    const media = setSystemDark(false)
    const store = createThemeStore()
    const cleanup = store.init()

    media.emit(true)
    expect(store.getSnapshot().resolved).toBe('dark')

    store.set('light')
    media.emit(false)
    expect(store.getSnapshot().preference).toBe('light')

    cleanup()
    expect(media.listenerCount()).toBe(0)
  })

  it('init no reescribe lo guardado', () => {
    setSystemDark(false)
    const store = createThemeStore()
    store.init()

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  })
})
