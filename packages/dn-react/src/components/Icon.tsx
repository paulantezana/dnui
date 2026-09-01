import type { HTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'

/** Iconos definidos en `styles/components/icon.css`. */
export type IconName =
  | 'aggregation' | 'arrows' | 'asc' | 'cancel' | 'chart' | 'color-picker'
  | 'columns' | 'contracted' | 'copy' | 'cross' | 'csv' | 'cut' | 'desc'
  | 'down' | 'excel' | 'expanded' | 'eye' | 'eye-slash' | 'filter' | 'first'
  | 'grip' | 'group' | 'last' | 'left' | 'linked' | 'loading' | 'maximize'
  | 'menu' | 'menu-alt' | 'minimize' | 'minus' | 'next' | 'none'
  | 'not-allowed' | 'paste' | 'pin' | 'pivot' | 'plus' | 'previous' | 'right'
  | 'save' | 'settings' | 'small-down' | 'small-left' | 'small-right'
  | 'small-up' | 'tick' | 'tree-closed' | 'tree-indeterminate' | 'tree-open'
  | 'unlinked' | 'up'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: IconName
  /** Texto para lectores de pantalla. Sin el, el icono se marca decorativo. */
  label?: string
}

export const Icon = ({ name, label, className, ...rest }: IconProps) => (
  <span
    className={cx('icon', `icon-${name}`, className)}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    {...rest}
  />
)
