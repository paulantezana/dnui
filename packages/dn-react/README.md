# @dnui/react

Los componentes de `@dnui/ui` en React + TypeScript. Mismos componentes, mismo
comportamiento y las mismas clases CSS (`dn-*`), pero con React como capa de
render.

**Etapa 1 (esto): todos los componentes menos el data grid.** La tabla
presentacional si esta; la tabla con paginacion por servidor, filtros anidados,
orden, seleccion y columnas configurables llega en la etapa 2 como `DataGrid`.

## Filosofia

La logica vive en `src/core`, que **no importa React**. La capa de React son los
componentes de `src/components` y los hooks de `src/hooks`, que se limitan a
pintar y a enganchar eventos. Es la separacion motor / render de AG Grid.

`scripts/check-core-purity.mjs` corre antes de cada build y falla si algo bajo
`src/core/` importa React o contiene JSX.

El motor se publica aparte:

```ts
import { paginationSummary, createMenuStore } from '@dnui/react/core'
```

## Instalacion

```bash
pnpm add @dnui/react
```

`react` y `react-dom` (>= 19) son peer dependencies.

## Estilos

Los estilos no se inyectan solos. Dos opciones:

```ts
// CSS ya compilado
import '@dnui/react/style.css'
```

```css
/* o la fuente, si compilas Tailwind v4 en tu aplicacion */
@import "@dnui/react/styles.css";
```

Los tokens usan la misma firma que daisyUI (`--color-base-100`,
`--color-base-content`, `--radius-box`, `--size-field`, ...) pero se definen en
`src/styles/styles.css`; **daisyUI no es una dependencia**. La variante oscura se
activa con la clase `dark` en `<html>`, que es lo que hace `useTheme()`.

## Uso

```tsx
import { Button, Menu, MenuContent, MenuItem, MenuTrigger, MessageHost, message } from '@dnui/react'
import '@dnui/react/style.css'

export const App = () => (
  <>
    <MessageHost />

    <Menu>
      <MenuTrigger>
        <Button variant="primary">Acciones</Button>
      </MenuTrigger>
      <MenuContent label="Acciones">
        <MenuItem onSelect={() => message.success('Guardado')}>Guardar</MenuItem>
        <MenuItem disabled>Borrar</MenuItem>
      </MenuContent>
    </Menu>
  </>
)
```

`MessageHost` y `ModalHost` hay que montarlos una vez cerca de la raiz para que
funcionen las APIs imperativas `message.*` y `modal.*`.

## Componentes

**Presentacionales** — Alert, Avatar, Badge, Button, Card, CodeViewer,
ControlGroup, Divider, Empty, Form (Input, PasswordInput, Textarea, Select),
Icon, Join, List, Table, Toggle (Checkbox, Radio, Switch), ToggleGroup, Upload.

**Con estado** — Collapse, Freeze, Menu, Message, Modal, Navigation, Pagination,
Tabs, ThemeToggle, Tooltip, useRipple.

## Diferencias respecto a dn-ui

Cambios de contrato inevitables al pasar a React:

- Desaparecen los globales `window.Pd*`, los atributos `data-modaltrigger` /
  `data-menutrigger` y los `.init()` / `.listen()`. Todo son componentes y hooks.
- `Menu` sigue permitiendo **un solo menu abierto en toda la pagina**, igual que
  el `Menu.openMenu` estatico de dn-ui.
- `MenuContent` tiene un modo `panel` para contenido que no es una lista de
  opciones. Es lo que en dn-ui se conseguia con `data-menuautoclose="false"`.
- El tema usa la clase `dark` y `localStorage`; `theme.ts` de dn-ui usaba
  `theme-dark` y `sessionStorage`, que no casan con el CSS que se envia.

Defectos de dn-ui que aqui estan corregidos:

- Cerrar un modal ya no desbloquea el scroll si quedan otros abiertos: el
  bloqueo va por contador.
- `Freeze` es por instancia; en dn-ui es un unico nodo compartido, asi que dos
  cargas simultaneas se pisan.
- Se anade ARIA y teclado donde no habia nada: `role="menu"` con flechas,
  Home/End, escritura rapida, Escape y retorno de foco; `role="dialog"` con
  focus trap; `role="tablist"` con flechas; `aria-expanded` en Collapse y
  Navigation.

Cosas que siguen sin resolverse porque dependen del CSS, que se copia tal cual:

- **Tooltip y Ripple no tienen estilos.** dn-ui tampoco los envia: sus reglas
  viven en el pipeline SCSS, que esta desactivado. Hay que darles estilo.
- Los mensajes solo salen arriba a la derecha, que es donde `message.css` fija el
  contenedor.
- `Tree` no se porta: en dn-ui es un objeto vacio.

## Documentacion

Hay un sitio con una pagina por componente, ejemplos vivos y las tablas de props.
Tambien sirve de banco de pruebas: cada ejemplo monta el componente real.

```bash
pnpm docs:dev
```

## Scripts

```bash
pnpm --filter @dnui/react dev     # harness con todos los componentes
pnpm --filter @dnui/react test    # vitest
pnpm --filter @dnui/react build   # purity check + tsc + vite + css
pnpm docs:dev                     # documentacion y banco de pruebas
```
