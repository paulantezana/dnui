/**
 * Motor de dn-react: TypeScript puro, sin una sola importacion de React.
 * `scripts/check-core-purity.mjs` lo verifica en cada build.
 *
 * Se publica como `@dnui/react/core` para que otros frameworks puedan reutilizar
 * la logica sin arrastrar React.
 */

export { debounce, type Debounced } from './utils/debounce'
export { formatNumber } from './utils/formatNumber'
export { uniqueId } from './utils/uniqueId'
export { loadingState } from './utils/loadingState'
export { Icon, type IconType } from './utils/icon'
export { cx, type ClassValue } from './utils/cx'

export {
  createFocusTrap,
  getFocusable,
  FOCUSABLE_SELECTOR,
  type FocusTrap,
  type FocusTrapOptions
} from './a11y/focusTrap'
export { createDismiss, type DismissOptions, type DismissReason } from './a11y/dismiss'
export { nextRovingIndex, type Orientation, type RovingOptions } from './a11y/rovingFocus'
export { createTypeahead, matchTypeahead, type Typeahead } from './a11y/typeahead'

export {
  positionOverlay,
  trackOverlay,
  virtualElementAt,
  type Anchor,
  type PositionOptions,
  type VirtualPosition
} from './floating'

export { createStore, type Store } from './stores/createStore'
export { createMenuStore, menuStore, type MenuState, type MenuStore } from './stores/menuStore'
export {
  bodyScrollLock,
  createModalStack,
  modalStack,
  type ModalStackState,
  type ModalStackStore,
  type ScrollLock
} from './stores/modalStack'
export {
  createMessageStore,
  messageStore,
  DEFAULT_DURATION,
  FALLBACK_DURATION,
  type MessageItem,
  type MessageOptions,
  type MessageState,
  type MessageStore,
  type MessageType
} from './stores/messageStore'
export {
  createThemeStore,
  resolveTheme,
  themeStore,
  DARK_CLASS,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
  type ThemeState,
  type ThemeStore
} from './stores/themeStore'

export {
  confirmStore,
  createConfirmStore,
  type ConfirmCallback,
  type ConfirmOptions,
  type ConfirmRequest,
  type ConfirmState,
  type ConfirmStore
} from './stores/confirmStore'

export { findActiveLink, isActiveLink, normalizeUrl } from './nav/activeUrl'
export {
  paginationSummary,
  DEFAULT_LIMIT_OPTIONS,
  type PaginationResult,
  type PaginationSummary
} from './paging/pagination'
