/**
 * `@dnui/react` — los componentes de dn-ui en React.
 *
 * La logica vive en `src/core`, que no importa React y se publica aparte como
 * `@dnui/react/core`. Aqui solo esta la capa de render y los hooks que la unen
 * con ese motor.
 *
 * Los estilos no se inyectan solos: importa `@dnui/react/style.css` (compilado)
 * o `@dnui/react/styles.css` (fuente, si compilas Tailwind en tu app).
 */

export * from './components'
export * from './hooks'

// Del motor se reexporta todo menos `Icon` / `IconType`, que ahi son el mapa de
// SVG de estado y chocarian con el componente `Icon`. Siguen disponibles en
// `@dnui/react/core`.
export {
  bodyScrollLock,
  confirmStore,
  createConfirmStore,
  createDismiss,
  createFocusTrap,
  createMenuStore,
  createMessageStore,
  createModalStack,
  createStore,
  createThemeStore,
  createTypeahead,
  cx,
  DARK_CLASS,
  debounce,
  DEFAULT_DURATION,
  DEFAULT_LIMIT_OPTIONS,
  FALLBACK_DURATION,
  findActiveLink,
  FOCUSABLE_SELECTOR,
  formatNumber,
  getFocusable,
  isActiveLink,
  loadingState,
  matchTypeahead,
  menuStore,
  messageStore,
  modalStack,
  nextRovingIndex,
  normalizeUrl,
  paginationSummary,
  positionOverlay,
  resolveTheme,
  THEME_STORAGE_KEY,
  themeStore,
  trackOverlay,
  uniqueId,
  virtualElementAt
} from './core'

export type {
  Anchor,
  ClassValue,
  ConfirmCallback,
  ConfirmOptions,
  ConfirmRequest,
  ConfirmState,
  ConfirmStore,
  Debounced,
  DismissOptions,
  DismissReason,
  FocusTrap,
  FocusTrapOptions,
  MenuState,
  MenuStore,
  MessageItem,
  MessageOptions,
  MessageState,
  MessageStore,
  MessageType,
  ModalStackState,
  ModalStackStore,
  Orientation,
  PaginationResult,
  PaginationSummary,
  PositionOptions,
  ResolvedTheme,
  RovingOptions,
  ScrollLock,
  Store,
  ThemePreference,
  ThemeState,
  ThemeStore,
  Typeahead,
  VirtualPosition
} from './core'
