import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../core/utils/cx'

export interface FreezeOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Texto del overlay. `freeze.css` lo pinta con `content: attr(data-text)`. */
  text?: string
  /** `absolute` para cubrir solo al contenedor; `fixed` para toda la pantalla. */
  position?: 'absolute' | 'fixed'
}

export const FreezeOverlay = forwardRef<HTMLDivElement, FreezeOverlayProps>(function FreezeOverlay(
  { text = 'loading', position = 'fixed', className, style, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cx('freeze-wrapper', className)}
      data-text={text}
      role="status"
      aria-live="polite"
      aria-label={text}
      style={position === 'absolute' ? { position: 'absolute', ...style } : style}
      {...rest}
    />
  )
})

export interface FreezeProps extends HTMLAttributes<HTMLDivElement> {
  active: boolean
  text?: string
  children?: ReactNode
}

/**
 * Bloquea la interaccion con su contenido mientras `active`.
 *
 * dn-ui reutiliza un unico nodo `.freeze-wrapper` global, asi que dos peticiones
 * simultaneas se pisan y la primera en terminar descongela a la otra. Aqui el
 * overlay es por instancia.
 */
export const Freeze = forwardRef<HTMLDivElement, FreezeProps>(function Freeze(
  { active, text, className, style, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={className} style={{ position: 'relative', ...style }} {...rest}>
      {children}
      {active && <FreezeOverlay text={text} position="absolute" />}
    </div>
  )
})
