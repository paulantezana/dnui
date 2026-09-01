import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../core/utils/cx'
import { useFloating } from '../hooks/useFloating'

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'right'

export interface TooltipProps {
  content: ReactNode
  placement?: TooltipPlacement
  /** Separacion respecto al elemento anclado. dn-ui usa 10 px. */
  distance?: number
  /** Retardo antes de ocultar, en ms. Es el `delay` de dn-ui. */
  delay?: number
  disabled?: boolean
  children: ReactElement
}

/**
 * Aviso flotante al pasar el raton o al enfocar con el teclado.
 *
 * Aviso: dn-ui no envia CSS para el tooltip. Su `tooltip.ts` pinta la clase
 * `TabTooltip` y su `tooltip.scss` (que no entra en el build) define `.tooltip`,
 * asi que hoy sale sin estilo en ambos casos. Aqui se usa `.tooltip`, que es la
 * que el SCSS pretendia; hace falta anadirle estilos para que se vea.
 */
export const Tooltip = ({
  content,
  placement = 'top',
  distance = 10,
  delay = 0,
  disabled = false,
  children
}: TooltipProps) => {
  const id = useId()
  const anchorRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [open, setOpen] = useState(false)

  useFloating({ enabled: open, anchorRef, overlayRef, placement, gap: distance, track: true })

  const show = () => {
    clearTimeout(hideTimer.current)
    if (!disabled) setOpen(true)
  }

  const hide = () => {
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setOpen(false), delay)
  }

  useEffect(() => () => clearTimeout(hideTimer.current), [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!isValidElement(children)) {
    throw new Error('<Tooltip> espera un unico elemento React como hijo')
  }

  const childProps = children.props as HTMLAttributes<HTMLElement>

  // Se pasa el objeto ref como prop, no se lee su `current` durante el render.
  // oxlint-disable-next-line react/refs
  const anchor = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: anchorRef,
    'aria-describedby': open ? id : undefined,
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(event)
      show()
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(event)
      hide()
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event)
      show()
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event)
      hide()
    }
  })

  return (
    <>
      {anchor}
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={overlayRef}
            id={id}
            role="tooltip"
            className={cx('tooltip')}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  )
}
