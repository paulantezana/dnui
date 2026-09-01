import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'
import type { Appearance, Size, Variant } from './types'

export interface BadgeVariantProps {
  variant?: Variant
  size?: Size
  /** `badge.css` define outline, dash, soft y ghost. */
  appearance?: Exclude<Appearance, 'link'>
}

export const badgeClass = ({ variant, size, appearance }: BadgeVariantProps = {}): string =>
  cx('badge', variant && `badge-${variant}`, size && `badge-${size}`, appearance && `badge-${appearance}`)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariantProps {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant, size, appearance, className, ...rest },
  ref
) {
  return <span ref={ref} className={cx(badgeClass({ variant, size, appearance }), className)} {...rest} />
})
