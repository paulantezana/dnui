import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'
import type { Appearance, Size, Variant } from './types'

export interface ButtonVariantProps {
  variant?: Variant
  size?: Size
  appearance?: Appearance
  shape?: 'square' | 'circle'
  block?: boolean
  wide?: boolean
  active?: boolean
}

/**
 * Clases de un boton, para poder aplicar el mismo estilo a un `<a>` o a
 * cualquier otro elemento sin duplicar la logica.
 */
export const buttonClass = ({
  variant,
  size,
  appearance,
  shape,
  block,
  wide,
  active
}: ButtonVariantProps = {}): string =>
  cx(
    'btn',
    variant && `btn-${variant}`,
    size && `btn-${size}`,
    appearance && `btn-${appearance}`,
    shape && `btn-${shape}`,
    block && 'btn-block',
    wide && 'btn-wide',
    active && 'btn-active'
  )

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, appearance, shape, block, wide, active, className, type = 'button', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        buttonClass({ variant, size, appearance, shape, block, wide, active }),
        rest.disabled && 'btn-disabled',
        className
      )}
      {...rest}
    />
  )
})
