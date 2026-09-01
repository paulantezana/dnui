import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Posicion del texto dentro de la linea. */
  align?: 'left' | 'center' | 'right'
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { align = 'center', className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cx('divider', align !== 'center' && `text-${align}`, className)}
      {...rest}
    >
      {children != null && <span className="divider-innerText">{children}</span>}
    </div>
  )
})
