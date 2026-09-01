import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes
} from 'react'
import { cx } from '../core/utils/cx'
import type { Size } from './types'

export const controlClass = (size?: Size, className?: string): string =>
  cx('form-control', size && `form-control-${size}`, className)

export interface ControlWrapperProps {
  prefix?: ReactNode
  suffix?: ReactNode
  children: ReactNode
}

/**
 * Coloca prefijo y sufijo sobre el control. `input.css` usa la posicion del
 * hermano (`.control:not(:first-child)`) para reservar el hueco, asi que el
 * orden de los nodos importa.
 */
export const ControlWrapper = ({ prefix, suffix, children }: ControlWrapperProps) => {
  if (prefix == null && suffix == null) return <>{children}</>

  return (
    <span className="control-wrapper">
      {prefix != null && <span className="control-prefix">{prefix}</span>}
      {children}
      {suffix != null && <span className="control-suffix">{suffix}</span>}
    </span>
  )
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> {
  size?: Size
  prefix?: ReactNode
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, prefix, suffix, className, ...rest },
  ref
) {
  const hasAddon = prefix != null || suffix != null

  return (
    <ControlWrapper prefix={prefix} suffix={suffix}>
      <input ref={ref} className={cx(controlClass(size, className), hasAddon && 'control')} {...rest} />
    </ControlWrapper>
  )
})

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  controlSize?: Size
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { controlSize, className, ...rest },
  ref
) {
  return <textarea ref={ref} className={controlClass(controlSize, className)} {...rest} />
})

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: Size
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size, className, ...rest },
  ref
) {
  return <select ref={ref} className={controlClass(size, className)} {...rest} />
})

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'suffix'> {
  showLabel?: string
  hideLabel?: string
}

/**
 * Unica logica que dn-ui tiene en `form.ts`: alternar entre `password` y `text`.
 * Alli se hacia mutando `input.type` desde un hermano; aqui es estado.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ showLabel = 'Mostrar contrasena', hideLabel = 'Ocultar contrasena', id, ...rest }, ref) {
    const [visible, setVisible] = useState(false)
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <Input
        ref={ref}
        id={inputId}
        type={visible ? 'text' : 'password'}
        suffix={
          <button
            type="button"
            className="togglePassword"
            aria-label={visible ? hideLabel : showLabel}
            aria-controls={inputId}
            aria-pressed={visible}
            onClick={() => setVisible((prev) => !prev)}
          >
            <span className={cx('icon', visible ? 'icon-eye-slash' : 'icon-eye')} aria-hidden="true" />
          </button>
        }
        {...rest}
      />
    )
  }
)
