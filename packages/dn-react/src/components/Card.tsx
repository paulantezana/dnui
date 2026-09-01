import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Eleva la tarjeta al pasar el raton. */
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { hoverable, className, ...rest },
  ref
) {
  return <div ref={ref} className={cx('card', hoverable && 'hoverable', className)} {...rest} />
})

export const CardCover = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardCover({ className, ...rest }, ref) {
    return <div ref={ref} className={cx('card-cover', className)} {...rest} />
  }
)

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cx('card-header', className)} {...rest} />
  }
)

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...rest }, ref) {
    return <h3 ref={ref} className={cx('card-title', className)} {...rest} />
  }
)

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...rest }, ref) {
    return <p ref={ref} className={cx('card-description', className)} {...rest} />
  }
)

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cx('card-body', className)} {...rest} />
  }
)
