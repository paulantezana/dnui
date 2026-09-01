import { useEffect } from 'react'
import { themeStore, type ThemePreference, type ThemeState } from '../core/stores/themeStore'
import { useStore } from './useStore'

export interface UseTheme extends ThemeState {
  set(preference: ThemePreference): void
  toggle(): void
}

/**
 * Lee y cambia el tema. Aplica la clase `dark` en `<html>`, que es la que activa
 * la variante oscura definida en `styles.css`.
 */
export const useTheme = (): UseTheme => {
  const state = useStore(themeStore)

  useEffect(() => themeStore.init(), [])

  return { ...state, set: themeStore.set, toggle: themeStore.toggle }
}
