import { Fragment, forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../core/utils/cx'
import { buttonClass, type ButtonVariantProps } from './Button'

export interface ToggleGroupOption<T extends string = string> {
  value: T
  label: ReactNode
  disabled?: boolean
}

export interface ToggleGroupProps<T extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: ToggleGroupOption<T>[]
  value?: T
  defaultValue?: T
  onChange?(value: T): void
  name?: string
  /** Estilo de los botones del grupo. */
  buttonProps?: ButtonVariantProps
  label?: string
}

/**
 * Grupo de botones excluyentes. `toggle-group.css` espera un input oculto
 * seguido de un `<label class="btn">`, y pinta el activo con
 * `input:checked + .btn`.
 *
 * Los pares van en un `Fragment`, sin envoltorio: el CSS redondea los extremos
 * con `.btn:first-of-type` y `.btn:last-of-type`, y cualquier nodo intermedio
 * —aunque sea `display: contents`— haria que cada etiqueta fuese primera y
 * ultima de su propio contenedor, dejando los tres botones redondeados por
 * separado.
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  { options, value, defaultValue, onChange, name, buttonProps, label, className, ...rest },
  ref
) {
  const generatedName = useId()
  const groupName = name ?? generatedName
  const isControlled = value !== undefined

  return (
    <div ref={ref} role="group" aria-label={label} className={cx('btn-group', className)} {...rest}>
      {options.map((option) => {
        const id = `${groupName}-${option.value}`

        return (
          <Fragment key={option.value}>
            <input
              type="radio"
              id={id}
              name={groupName}
              value={option.value}
              disabled={option.disabled}
              {...(isControlled
                ? { checked: value === option.value }
                : { defaultChecked: defaultValue === option.value })}
              onChange={() => onChange?.(option.value)}
            />
            <label htmlFor={id} className={buttonClass(buttonProps)}>
              {option.label}
            </label>
          </Fragment>
        )
      })}
    </div>
  )
}) as <T extends string = string>(
  props: ToggleGroupProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement
