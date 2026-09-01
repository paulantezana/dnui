import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode
} from 'react'
import { cx } from '../core/utils/cx'

export interface CollapseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Elemento que abre y cierra. Recibe `aria-expanded` y `aria-controls`. */
  trigger: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  children: ReactNode
}

/**
 * dn-ui alterna la clase `collapse-expanded` sobre `[data-collapse]` desde un
 * `[data-collapsetrigger]`. Aqui es estado, y el disparador recibe los atributos
 * ARIA que alli faltaban.
 */
export const Collapse = ({
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...rest
}: CollapseProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const panelId = useId()

  const isControlled = open !== undefined
  const expanded = isControlled ? open : uncontrolled

  const toggle = () => {
    if (!isControlled) setUncontrolled((prev) => !prev)
    onOpenChange?.(!expanded)
  }

  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<HTMLAttributes<HTMLElement>>, {
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          ;(trigger.props as HTMLAttributes<HTMLElement>).onClick?.(event)
          if (!event.defaultPrevented) toggle()
        },
        'aria-expanded': expanded,
        'aria-controls': panelId
      } as HTMLAttributes<HTMLElement>)
    : trigger

  return (
    <>
      {triggerNode}
      <div
        id={panelId}
        className={cx('collapse', expanded && 'collapse-expanded', className)}
        {...rest}
      >
        {children}
      </div>
    </>
  )
}
