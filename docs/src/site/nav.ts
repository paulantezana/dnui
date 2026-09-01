export interface NavLink {
  label: string
  path: string
  /** Terminos extra para el buscador del panel lateral. */
  keywords?: string[]
}

export interface NavGroup {
  label: string
  links: NavLink[]
}

/** Estructura del panel lateral y fuente unica de las rutas del sitio. */
export const NAV: NavGroup[] = [
  {
    label: 'Empezar',
    links: [
      { label: 'Introduccion', path: '/', keywords: ['inicio', 'que es', 'filosofia'] },
      { label: 'Instalacion', path: '/instalacion', keywords: ['npm', 'pnpm', 'setup', 'estilos'] },
      { label: 'App (proveedor)', path: '/app', keywords: ['provider', 'contexto', 'useApp', 'antd', 'host'] },
      { label: 'Tema y tokens', path: '/tema', keywords: ['dark', 'colores', 'variables', 'daisyui'] },
      { label: 'El motor', path: '/motor', keywords: ['core', 'stores', 'a11y', 'sin react'] }
    ]
  },
  {
    label: 'Generales',
    links: [
      { label: 'Button', path: '/button', keywords: ['boton', 'btn'] },
      { label: 'Icon', path: '/icon', keywords: ['icono', 'svg'] },
      { label: 'Badge', path: '/badge', keywords: ['etiqueta', 'tag', 'insignia'] },
      { label: 'Avatar', path: '/avatar', keywords: ['foto', 'iniciales'] }
    ]
  },
  {
    label: 'Diseno',
    links: [
      { label: 'Card', path: '/card', keywords: ['tarjeta'] },
      { label: 'Divider', path: '/divider', keywords: ['separador', 'linea'] },
      { label: 'Empty', path: '/empty', keywords: ['vacio', 'sin datos'] },
      { label: 'Join', path: '/join', keywords: ['grupo', 'pegado'] },
      { label: 'List', path: '/list', keywords: ['lista'] },
      { label: 'Table', path: '/table', keywords: ['tabla', 'datos'] },
      { label: 'CodeViewer', path: '/code-viewer', keywords: ['codigo', 'pre'] }
    ]
  },
  {
    label: 'Formulario',
    links: [
      { label: 'Form', path: '/form', keywords: ['input', 'select', 'textarea', 'campo', 'label'] },
      { label: 'Toggle', path: '/toggle', keywords: ['checkbox', 'radio', 'switch', 'casilla'] },
      { label: 'ToggleGroup', path: '/toggle-group', keywords: ['grupo', 'segmentado'] },
      { label: 'ControlGroup', path: '/control-group', keywords: ['prepend', 'append'] },
      { label: 'Upload', path: '/upload', keywords: ['subir', 'imagen', 'archivo'] }
    ]
  },
  {
    label: 'Navegacion',
    links: [
      { label: 'Navigation', path: '/navigation', keywords: ['menu lateral', 'sidebar'] },
      { label: 'Menu', path: '/menu', keywords: ['desplegable', 'dropdown', 'contextual'] },
      { label: 'Tabs', path: '/tabs', keywords: ['pestanas'] },
      { label: 'Collapse', path: '/collapse', keywords: ['plegar', 'acordeon'] },
      { label: 'Pagination', path: '/pagination', keywords: ['paginas', 'paginador'] }
    ]
  },
  {
    label: 'Feedback',
    links: [
      { label: 'Alert', path: '/alert', keywords: ['aviso'] },
      { label: 'Message', path: '/message', keywords: ['toast', 'notificacion'] },
      { label: 'Modal', path: '/modal', keywords: ['dialogo', 'confirm'] },
      { label: 'Tooltip', path: '/tooltip', keywords: ['ayuda', 'globo'] },
      { label: 'Freeze', path: '/freeze', keywords: ['bloquear', 'cargando', 'loading'] }
    ]
  }
]

export const ALL_LINKS: NavLink[] = NAV.flatMap((group) => group.links)

export const findLink = (path: string): NavLink | undefined =>
  ALL_LINKS.find((link) => link.path === path)

/** Enlace anterior y siguiente, para la navegacion al pie de cada pagina. */
export const siblings = (path: string): { prev?: NavLink; next?: NavLink } => {
  const index = ALL_LINKS.findIndex((link) => link.path === path)
  if (index === -1) return {}
  return { prev: ALL_LINKS[index - 1], next: ALL_LINKS[index + 1] }
}
