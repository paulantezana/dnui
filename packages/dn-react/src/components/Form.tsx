import { forwardRef, type FormHTMLAttributes, type HTMLAttributes, type LabelHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../core/utils/cx'

export type FieldStatus = 'danger' | 'success'
/** `inner` mete la etiqueta dentro del control; `outlined` la flota sobre el borde. */
export type FieldVariant = 'default' | 'inner' | 'outlined'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  horizontal?: boolean
}

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { horizontal, className, ...rest },
  ref
) {
  return <form ref={ref} className={cx('form', horizontal && 'horizontal', className)} {...rest} />
})

export const FormLabel = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  function FormLabel({ className, ...rest }, ref) {
    return <label ref={ref} className={cx('form-label', className)} {...rest} />
  }
)

export const FormHelp = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function FormHelp({ className, ...rest }, ref) {
    return <p ref={ref} className={cx('form-help', className)} {...rest} />
  }
)

export interface FormItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label?: ReactNode
  help?: ReactNode
  required?: boolean
  status?: FieldStatus
  variant?: FieldVariant
  disabled?: boolean
  /** Id del control, para enlazar la etiqueta y `aria-describedby`. */
  htmlFor?: string
  children?: ReactNode
}

/**
 * Envoltorio de un campo. En la variante `outlined` la etiqueta va despues del
 * control, porque `form.css` la posiciona con el selector `+ .form-label`.
 */
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(function FormItem(
  { label, help, required, status, variant = 'default', disabled, htmlFor, className, children, ...rest },
  ref
) {
  const helpId = help != null && htmlFor ? `${htmlFor}-help` : undefined

  const labelNode =
    label != null ? (
      <FormLabel htmlFor={htmlFor} id={htmlFor ? `${htmlFor}-label` : undefined}>
        {label}
      </FormLabel>
    ) : null

  return (
    <div
      ref={ref}
      className={cx(
        'form-item',
        required && 'required',
        status && `has-${status}`,
        variant !== 'default' && variant,
        disabled && 'disabled',
        className
      )}
      {...rest}
    >
      {variant !== 'outlined' && labelNode}
      {children}
      {variant === 'outlined' && labelNode}
      {help != null && <FormHelp id={helpId}>{help}</FormHelp>}
    </div>
  )
})
