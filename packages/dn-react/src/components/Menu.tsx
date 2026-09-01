import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactElement,
  type ReactNode
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../core/utils/cx'
import { menuStore } from '../core/stores/menuStore'
import type { VirtualPosition } from '../core/floating'
import { useDismiss } from '../hooks/useDismiss'
import { useFloating } from '../hooks/useFloating'
import { useRovingFocus } from '../hooks/useRovingFocus'
import { usePortalScope } from '../hooks/usePortalScope'
import { useStore } from '../hooks/useStore'

interface MenuContextValue {
  id: string
  open: boolean
  autoClose: boolean
  toggle(): void
  close(): void
  openAt(position: VirtualPosition): void
  triggerRef: React.RefObject<HTMLElement | null>
  overlayRef: React.RefObject<HTMLDivElement | null>
  virtual: VirtualPosition | null
  placement: MenuProps['placement']
}

const MenuContext = createContext<MenuContextValue | null>(null)

const useMenuContext = (component: string): MenuContextValue => {
  const context = useContext(MenuContext)
  if (!context) throw new Error(`<${component}> debe usarse dentro de <Menu>`)
  return context
}

export interface MenuProps {
  /**
   * Si un click fuera del disparador cierra el menu. Con `false`, los clicks
   * dentro del overlay tampoco lo cierran. Es la semantica de
   * `data-menuautoclose` en dn-ui.
   */
  autoClose?: boolean
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start'
  onOpenChange?(open: boolean): void
  children: ReactNode
}

/**
 * dn-ui guarda un unico `Menu.openMenu` estatico, asi que abrir un menu cierra
 * cualquier otro de la pagina. `menuStore` conserva exactamente esa regla.
 */
export const Menu = ({ autoClose = true, placement = 'bottom-start', onOpenChange, children }: MenuProps) => {
  const id = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const [virtual, setVirtual] = useState<VirtualPosition | null>(null)

  const { openKey } = useStore(menuStore)
  const open = openKey === id

  useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  const close = useCallback(() => {
    if (menuStore.isOpen(id)) menuStore.close()
  }, [id])

  const toggle = useCallback(() => {
    setVirtual(null)
    menuStore.toggle(id, { autoClose })
  }, [autoClose, id])

  const openAt = useCallback(
    (position: VirtualPosition) => {
      setVirtual(position)
      menuStore.open(id, { autoClose })
    },
    [autoClose, id]
  )

  // dn-ui cierra el menu abierto al redimensionar la ventana.
  useEffect(() => {
    if (!open) return
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [open, close])

  const value = useMemo<MenuContextValue>(
    () => ({ id, open, autoClose, toggle, close, openAt, triggerRef, overlayRef, virtual, placement }),
    [id, open, autoClose, toggle, close, openAt, virtual, placement]
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export interface MenuTriggerProps {
  children: ReactElement
}

/** Clona su hijo y le engancha el toggle y los atributos ARIA. */
export const MenuTrigger = ({ children }: MenuTriggerProps) => {
  const { open, toggle, triggerRef, id } = useMenuContext('MenuTrigger')

  if (!isValidElement(children)) {
    throw new Error('<MenuTrigger> espera un unico elemento React como hijo')
  }

  const childProps = children.props as HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }

  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: triggerRef,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? `${id}-menu` : undefined,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      childProps.onClick?.(event)
      if (!event.defaultPrevented) toggle()
    }
  })
}

export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  /**
   * Contenido libre en lugar de una lista de opciones: sin `role="menu"`, sin
   * foco itinerante y sin enfocar nada al abrir. Es lo que necesita un panel con
   * controles propios, como el filtro de columna de la tabla, que en dn-ui se
   * abre con `data-menuautoclose="false"`.
   */
  panel?: boolean
}

export const MenuContent = ({ label, panel = false, className, children, ...rest }: MenuContentProps) => {
  const { id, open, autoClose, close, triggerRef, overlayRef, virtual, placement } =
    useMenuContext('MenuContent')
  const scope = usePortalScope('MenuScope')
  const listRef = useRef<HTMLUListElement>(null)

  const roving = useRovingFocus({
    containerRef: listRef,
    itemSelector: '[role="menuitem"]:not([aria-disabled="true"])',
    orientation: 'vertical',
    loop: true,
    typeahead: true
  })

  useFloating({ enabled: open, anchorRef: triggerRef, overlayRef, virtual, placement })

  // Con autoClose, cualquier click fuera del disparador cierra, incluidos los
  // del propio menu: es lo que hace que al elegir una opcion se cierre.
  useDismiss({
    enabled: open,
    onDismiss: close,
    contains: autoClose ? [triggerRef] : [triggerRef, overlayRef]
  })

  useEffect(() => {
    if (open && !panel) roving.focusFirst()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, panel])

  if (!open || !scope) return null

  return createPortal(
    <div ref={overlayRef} className="menu-overlay show">
      <div className={cx('menu-content', className)} {...rest}>
        {panel ? (
          children
        ) : (
          <ul
            ref={listRef}
            id={`${id}-menu`}
            role="menu"
            aria-label={label}
            className="menu"
            onKeyDown={roving.onKeyDown}
          >
            {children}
          </ul>
        )}
      </div>
    </div>,
    scope
  )
}

export interface MenuItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'onSelect'> {
  disabled?: boolean
  active?: boolean
  onSelect?(): void
}

export const MenuItem = ({ disabled, active, onSelect, className, onKeyDown, ...rest }: MenuItemProps) => {
  const { close } = useMenuContext('MenuItem')

  const select = () => {
    if (disabled) return
    onSelect?.()
    close()
  }

  return (
    <li
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-roving-item=""
      className={cx('menu-item', disabled && 'disabled', active && 'menu-active', className)}
      onClick={select}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          select()
        }
      }}
      {...rest}
    />
  )
}

/**
 * Abre el menu en las coordenadas del puntero. Reproduce el menu contextual que
 * dn-ui monta con un elemento virtual de @floating-ui.
 */
export const useContextMenu = () => {
  const { openAt } = useMenuContext('useContextMenu')

  return useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      openAt({ x: event.clientX, y: event.clientY })
    },
    [openAt]
  )
}
