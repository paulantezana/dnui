import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from 'react'
import { nextRovingIndex } from '../core/a11y/rovingFocus'
import { cx } from '../core/utils/cx'

interface TabsContextValue {
  selected: number
  select(index: number): void
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)
/** Posicion del hijo dentro de su lista, inyectada por TabList y TabPanels. */
const TabIndexContext = createContext(0)

const useTabs = (component: string): TabsContextValue => {
  const context = useContext(TabsContext)
  if (!context) throw new Error(`<${component}> debe usarse dentro de <Tabs>`)
  return context
}

/** Envuelve cada hijo con su indice, para no depender del orden de renderizado. */
const withIndex = (children: ReactNode) =>
  Children.map(children, (child, index) =>
    isValidElement(child) ? (
      <TabIndexContext.Provider value={index}>{child}</TabIndexContext.Provider>
    ) : (
      child
    )
  )

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  index?: number
  defaultIndex?: number
  onChange?(index: number): void
  children: ReactNode
}

/**
 * dn-ui activa la primera pestana y alterna `is-active` por indice.
 * Se conserva esa semantica y se anaden los roles y el teclado de WAI-ARIA.
 */
export const Tabs = ({ index, defaultIndex = 0, onChange, className, children, ...rest }: TabsProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultIndex)
  const baseId = useId()

  const isControlled = index !== undefined
  const selected = isControlled ? index : uncontrolled

  const value = useMemo<TabsContextValue>(
    () => ({
      selected,
      baseId,
      select(next) {
        if (!isControlled) setUncontrolled(next)
        onChange?.(next)
      }
    }),
    [selected, baseId, isControlled, onChange]
  )

  return (
    <TabsContext.Provider value={value}>
      <div className={cx('tab', className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
}

export const TabList = ({ label, className, children, ...rest }: TabListProps) => {
  const { selected, select } = useTabs('TabList')
  const ref = useRef<HTMLDivElement>(null)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      ref.current?.querySelectorAll<HTMLElement>('[role="tab"]:not([aria-disabled="true"])') ?? []
    )
    if (tabs.length === 0) return

    const current = tabs.indexOf(document.activeElement as HTMLElement)
    const target = nextRovingIndex(current === -1 ? selected : current, tabs.length, event.key, {
      orientation: 'horizontal',
      loop: true
    })
    if (target === null) return

    event.preventDefault()
    const next = tabs[target]
    next?.focus()
    select(Number(next?.dataset.tabIndex ?? target))
  }

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      className={cx('tab-header', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {withIndex(children)}
    </div>
  )
}

export interface TabProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'disabled'> {
  disabled?: boolean
}

export const Tab = ({ disabled, className, ...rest }: TabProps) => {
  const { selected, select, baseId } = useTabs('Tab')
  const index = useContext(TabIndexContext)
  const isSelected = selected === index

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${index}`}
      data-tab-index={index}
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${index}`}
      aria-disabled={disabled || undefined}
      tabIndex={isSelected ? 0 : -1}
      className={cx('tab-title', isSelected && 'is-active', disabled && 'disabled', className)}
      onClick={() => !disabled && select(index)}
      {...rest}
    />
  )
}

export const TabPanels = ({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx('tab-body', className)} {...rest}>
    {withIndex(children)}
  </div>
)

export const TabPanel = ({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const { selected, baseId } = useTabs('TabPanel')
  const index = useContext(TabIndexContext)
  const isSelected = selected === index

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${index}`}
      aria-labelledby={`${baseId}-tab-${index}`}
      tabIndex={0}
      hidden={!isSelected}
      className={cx('tab-content', isSelected && 'is-active', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
