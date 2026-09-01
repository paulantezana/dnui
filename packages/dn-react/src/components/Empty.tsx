import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../core/utils/cx'

export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  image?: ReactNode
  description?: ReactNode
}

/** Estado vacio. `children` sirve para poner una accion debajo del texto. */
export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  { image, description = 'Sin datos', className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cx('empty', className)} {...rest}>
      {image}
      {description != null && <p>{description}</p>}
      {children}
    </div>
  )
})
