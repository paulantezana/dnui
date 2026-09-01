import { useCallback, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react'
import { isActiveLink } from '../core/nav/activeUrl'
import { cx } from '../core/utils/cx'

export interface NavigationItem {
  label: ReactNode
  href?: string
  icon?: ReactNode
  disabled?: boolean
  children?: NavigationItem[]
}

/** Ruta de claves hasta el item activo, para poder abrir sus ancestros. */
const findActivePath = (
  items: NavigationItem[],
  currentUrl: string,
  prefix = ''
): string[] | null => {
  for (const [index, item] of items.entries()) {
    const key = prefix ? `${prefix}.${index}` : String(index)

    if (item.href && isActiveLink(item.href, currentUrl)) return [key]

    if (item.children) {
      const nested = findActivePath(item.children, currentUrl, key)
      if (nested) return [key, ...nested]
    }
  }

  return null
}

interface NodeProps {
  items: NavigationItem[]
  prefix: string
  currentUrl: string
  iconClassDown: string
  iconClassUp: string
  expanded: Set<string>
  onToggle(key: string): void
  listProps?: HTMLAttributes<HTMLUListElement>
}

const NavigationNodes = ({
  items,
  prefix,
  currentUrl,
  iconClassDown,
  iconClassUp,
  expanded,
  onToggle,
  listProps
}: NodeProps) => (
  <ul {...listProps}>
    {items.map((item, index) => {
      const key = prefix ? `${prefix}.${index}` : String(index)
      const hasChildren = Boolean(item.children?.length)
      const isOpen = expanded.has(key)
      const active = Boolean(item.href && isActiveLink(item.href, currentUrl))

      return (
        <li key={key} className={cx(active && 'is-active')}>
          <a
            href={item.href ?? '#'}
            aria-current={active ? 'page' : undefined}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-disabled={item.disabled || undefined}
            className={cx(hasChildren && 'is-toggle')}
            onClick={(event) => {
              if (!hasChildren) return
              event.preventDefault()
              onToggle(key)
            }}
          >
            <span>
              {item.icon}
              {item.label}
            </span>
            {hasChildren && (
              <i className={cx('toggle', isOpen ? iconClassUp : iconClassDown)} aria-hidden="true" />
            )}
          </a>

          {hasChildren && (
            <NavigationNodes
              items={item.children!}
              prefix={key}
              currentUrl={currentUrl}
              iconClassDown={iconClassDown}
              iconClassUp={iconClassUp}
              expanded={expanded}
              onToggle={onToggle}
              listProps={{ className: cx(isOpen && 'is-show') }}
            />
          )}
        </li>
      )
    })}
  </ul>
)

export interface NavigationProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  items: NavigationItem[]
  /** Url con la que comparar. Por defecto, la de la pagina. */
  currentUrl?: string
  /** Clase del icono cuando el submenu esta cerrado. */
  iconClassDown?: string
  /** Clase del icono cuando el submenu esta abierto. */
  iconClassUp?: string
  label?: string
}

/**
 * dn-ui detecta los submenus estructuralmente (`li` con exactamente dos hijos),
 * inyecta el icono a mano y abre los ancestros del enlace activo recorriendo el
 * DOM hacia arriba. Aqui la misma logica se aplica sobre los datos, y cada nivel
 * recibe `aria-expanded` y `aria-current`, que alli no existian.
 */
export const Navigation = ({
  items,
  currentUrl,
  iconClassDown = 'icon-down',
  iconClassUp = 'icon-up',
  label,
  className,
  ...rest
}: NavigationProps) => {
  const url = currentUrl ?? (typeof document !== 'undefined' ? document.location.href : '')
  const activePath = useMemo(() => findActivePath(items, url), [items, url])

  // Los ancestros del enlace activo arrancan abiertos; el propio enlace no.
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(activePath?.slice(0, -1) ?? [])
  )

  const onToggle = useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  return (
    <NavigationNodes
      items={items}
      prefix=""
      currentUrl={url}
      iconClassDown={iconClassDown}
      iconClassUp={iconClassUp}
      expanded={expanded}
      onToggle={onToggle}
      listProps={{ ...rest, className: cx('navigation', className), 'aria-label': label }}
    />
  )
}

export interface NavigationToggleProps extends HTMLAttributes<HTMLButtonElement> {
  expanded: boolean
  label?: string
}

/** Boton de hamburguesa. `navigation.css` lo oculta a partir de 1024 px. */
export const NavigationToggle = ({
  expanded,
  label = 'Abrir menu',
  className,
  ...rest
}: NavigationToggleProps) => (
  <button
    type="button"
    className={cx('navigation-toggle', className)}
    aria-expanded={expanded}
    aria-label={label}
    {...rest}
  />
)

export interface UseNavigationDrawerOptions {
  /** Elemento al que se le pone la clase. dn-ui usa `siteLayout`. */
  targetId?: string
  /** Clase que la app anfitriona usa para mostrar el cajon. */
  className?: string
}

/**
 * Abre y cierra el cajon lateral poniendo una clase en el contenedor de la
 * aplicacion, igual que `contextId` / `contextToggleClass` en dn-ui. Esa clase
 * la define la app anfitriona, no esta libreria.
 */
export const useNavigationDrawer = ({
  targetId = 'siteLayout',
  className = 'navigation-is-show'
}: UseNavigationDrawerOptions = {}) => {
  const [isOpen, setIsOpen] = useState(false)

  const apply = useCallback(
    (next: boolean) => {
      setIsOpen(next)
      document.getElementById(targetId)?.classList.toggle(className, next)
    },
    [targetId, className]
  )

  return {
    isOpen,
    open: useCallback(() => apply(true), [apply]),
    close: useCallback(() => apply(false), [apply]),
    toggle: useCallback(() => apply(!isOpen), [apply, isOpen])
  }
}
