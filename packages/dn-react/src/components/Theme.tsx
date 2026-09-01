import type { ReactNode } from 'react'
import { cx } from '../core/utils/cx'
import { useTheme } from '../hooks/useTheme'
import { buttonClass, type ButtonVariantProps } from './Button'

export interface ThemeToggleProps extends ButtonVariantProps {
  className?: string
  lightLabel?: string
  darkLabel?: string
  /** Contenido propio. Recibe el tema aplicado. */
  children?: (resolved: 'light' | 'dark') => ReactNode
}

/**
 * Alterna entre claro y oscuro poniendo la clase `dark` en `<html>`, que es lo
 * que activa la variante definida en `styles.css`, y guarda la eleccion.
 */
export const ThemeToggle = ({
  className,
  lightLabel = 'Cambiar a tema claro',
  darkLabel = 'Cambiar a tema oscuro',
  children,
  ...variant
}: ThemeToggleProps) => {
  const { resolved, toggle } = useTheme()
  const isDark = resolved === 'dark'

  return (
    <button
      type="button"
      className={cx(buttonClass(variant), className)}
      aria-label={isDark ? lightLabel : darkLabel}
      aria-pressed={isDark}
      onClick={toggle}
    >
      {children ? (
        children(resolved)
      ) : (
        <span className={cx('icon', isDark ? 'icon-eye' : 'icon-eye-slash')} aria-hidden="true" />
      )}
    </button>
  )
}
