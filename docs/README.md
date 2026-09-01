# @dnui/docs

Documentacion de `@dnui/react` y, a la vez, su banco de pruebas.

Cada ejemplo de estas paginas monta el componente real desde el paquete del
workspace, asi que si algo se rompe se ve aqui antes que en ningun otro sitio.
No es una galeria de capturas: los menus se abren, los modales atrapan el foco y
los avisos se cierran solos.

## Arrancar

```bash
pnpm --filter @dnui/docs dev
```

## Que verifica indirectamente

- **Los tipos publicados.** El sitio consume `@dnui/react` por su `exports` y su
  `dist/types`, no por la fuente. Si el paquete deja de exportar un tipo, o si
  las declaraciones no resuelven, `pnpm --filter @dnui/docs build` falla. Asi se
  encontro que `dist/core.js` y el arbol de tipos `dist/core/` colisionaban al
  resolver.
- **El CSS compilado.** Importa `@dnui/react/styles.css` (la fuente) y compila
  Tailwind con `@tailwindcss/vite`, que es el camino B de la guia de instalacion.
  Si un `@apply` deja de resolver, se ve al instante.
- **Los dos temas.** El interruptor de la cabecera cambia entre claro y oscuro
  sobre los componentes de verdad.

## Estructura

```
src/
├── App.tsx          # rutas; el mapa ruta → pagina
├── styles.css       # importa la fuente del CSS de la libreria
├── site/
│   ├── nav.ts       # fuente unica de la navegacion y de las rutas
│   ├── Sidebar.tsx  # panel lateral con buscador
│   └── Layout.tsx   # cabecera, cajon movil y navegacion entre paginas
├── ui/
│   ├── Page.tsx        # Page, Section (con ancla), Prose, Note
│   ├── Example.tsx     # demo viva + fuente desplegable
│   ├── CodeBlock.tsx   # bloque de codigo con barra y boton de copiar
│   ├── PropsTable.tsx  # tabla de props que se apila en movil
│   ├── Toc.tsx         # indice de la pagina, leido del DOM
│   └── highlight.ts    # resaltado minimo, sin dependencias
└── pages/           # una pagina por ruta
```

## Los ejemplos no se abrevian

El bloque que sale al pulsar «Ver codigo» tiene que reflejar **exactamente** lo
que se ve arriba. Si la vista previa recorre una lista, el codigo tambien la
recorre; nada de puntos suspensivos ni de mostrar tres botones cuando se pintan
nueve. Es la unica forma de que el codigo se pueda copiar y funcione.

## Anadir una pagina

1. Crea `src/pages/MiComponentePage.tsx` usando `Page`, `Section`, `Example` y
   `PropsTable`.
2. Anade la entrada en `src/site/nav.ts`, dentro del grupo que le toque.
3. Registrala en el mapa `PAGES` de `src/App.tsx`.

El panel lateral, el buscador y los enlaces de anterior y siguiente salen todos
de `nav.ts`, asi que no hay que tocar nada mas.

## Dogfooding

El interruptor de tema es un `ThemeToggle` de la libreria, y los avisos de los
ejemplos son `message`. El resto del armazon —panel lateral, indice, tabla de
props— es propio del sitio, a proposito: si la documentacion se montara sobre los
mismos componentes que documenta, un fallo en uno de ellos romperia la pagina que
lo explica.

Los tokens y el CSS si son los de la libreria, sin retoques: el sitio solo les
pone alias (`--docs-page`, `--docs-surface`, `--docs-line`) para no repetir
`var(--color-base-200)` en cada componente del armazon.
