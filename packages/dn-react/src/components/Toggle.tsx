import { forwardRef, type InputHTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'

export type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

/**
 * `toggle.css` estiliza directamente `input[type=checkbox]` e `input[type=radio]`;
 * la clase `switch` convierte la casilla en un interruptor.
 */
export const Checkbox = forwardRef<HTMLInputElement, ToggleProps>(function Checkbox(
  { className, ...rest },
  ref
) {
  return <input ref={ref} type="checkbox" className={className} {...rest} />
})

export const Radio = forwardRef<HTMLInputElement, ToggleProps>(function Radio(
  { className, ...rest },
  ref
) {
  return <input ref={ref} type="radio" className={className} {...rest} />
})

export const Switch = forwardRef<HTMLInputElement, ToggleProps>(function Switch(
  { className, ...rest },
  ref
) {
  return <input ref={ref} type="checkbox" role="switch" className={cx('switch', className)} {...rest} />
})
