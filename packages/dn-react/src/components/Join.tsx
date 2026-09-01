import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode
} from 'react'
import { cx } from '../core/utils/cx'

/** Clase que `join.css` usa para repartir el redondeo entre los extremos. */
export const JOIN_ITEM = 'join-item'

const withJoinItem = (children: ReactNode): ReactNode =>
  Children.map(children, (child) => {
    if (!isValidElement(child)) return child

    const props = child.props as { className?: string }
    // Idempotente: si ya lo trae puesto a mano, no se toca.
    if (props.className?.split(' ').includes(JOIN_ITEM)) return child

    return cloneElement(child as ReactElement<{ className?: string }>, {
      className: cx(props.className, JOIN_ITEM)
    })
  })

export interface JoinProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical'
  /**
   * Por defecto la clase `join-item` se pone sola en cada hijo. Desactivalo si
   * necesitas colocarla tu, por ejemplo cuando el control real va dentro de otro
   * elemento.
   */
  autoItems?: boolean
}

/**
 * Pega varios controles en un bloque: solo se redondean los extremos y los
 * bordes interiores se solapan.
 *
 * `join.css` espera la clase `join-item` **en el propio control**, no en un
 * envoltorio, igual que daisyUI. Como todos los componentes de la libreria
 * pasan su `className` al elemento final, basta con anadirsela a cada hijo.
 */
export const Join = forwardRef<HTMLDivElement, JoinProps>(function Join(
  { direction = 'horizontal', autoItems = true, className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cx('join', `join-${direction}`, className)} {...rest}>
      {autoItems ? withJoinItem(children) : children}
    </div>
  )
})
