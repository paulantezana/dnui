import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../core/utils/cx'
import type { Variant } from './types'

export type AlertVariant = Extract<Variant, 'info' | 'success' | 'warning' | 'error'>

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  appearance?: 'outline' | 'dash' | 'soft'
  /** `vertical` apila icono, texto y acciones. */
  direction?: 'horizontal' | 'vertical'
  icon?: ReactNode
  /** Muestra el boton de cierre. Equivale al `.alert-close` de dn-ui. */
  closable?: boolean
  closeLabel?: string
  onClose?(): void
}

/**
 * dn-ui `alert.ts` se limita a borrar el nodo al pulsar `.alert-close`.
 * Aqui el cierre es estado: si se pasa `onClose` manda el consumidor, y si no,
 * el propio componente se oculta.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant,
    appearance,
    direction,
    icon,
    closable = false,
    closeLabel = 'Cerrar',
    onClose,
    className,
    children,
    ...rest
  },
  ref
) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }
    setDismissed(true)
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cx(
        'alert',
        variant && `alert-${variant}`,
        appearance && `alert-${appearance}`,
        direction && `alert-${direction}`,
        className
      )}
      {...rest}
    >
      {icon}
      {children}
      {closable && (
        <button type="button" className="alert-close btn btn-ghost btn-xs btn-square" aria-label={closeLabel} onClick={handleClose}>
          <span className="icon icon-cross" aria-hidden="true" />
        </button>
      )}
    </div>
  )
})
