import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../core/utils/cx'

export interface ControlGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Contenido pegado a la izquierda del control. */
  prepend?: ReactNode
  /** Contenido pegado a la derecha del control. */
  append?: ReactNode
}

/**
 * Input con botones o etiquetas pegados a los lados.
 *
 * `control-group.css` quita el redondeo interior pero no solapa los bordes, asi
 * que entre el control y sus adornos quedaria una costura de dos pixeles. Se
 * corrige con el mismo margen negativo que usa `join`.
 */
export const ControlGroup = forwardRef<HTMLDivElement, ControlGroupProps>(function ControlGroup(
  { prepend, append, className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cx('control-group', className)} {...rest}>
      {prepend != null && <div className="control-group-prepend -me-px">{prepend}</div>}

      <div className="control-group-input">{children}</div>

      {append != null && <div className="control-group-append -ms-px">{append}</div>}
    </div>
  )
})
