import { forwardRef, type HTMLAttributes, type LiHTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Aspecto de menu desplegable. */
  menu?: boolean
  shadow?: boolean
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { menu, shadow, className, ...rest },
  ref
) {
  return (
    <ul ref={ref} className={cx('list', menu && 'list-menu menu', shadow && 'shadow', className)} {...rest} />
  )
})

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  disabled?: boolean
  active?: boolean
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { disabled, active, className, ...rest },
  ref
) {
  return (
    <li
      ref={ref}
      aria-disabled={disabled || undefined}
      className={cx('list-item', disabled && 'disabled', active && 'menu-active', className)}
      {...rest}
    />
  )
})
