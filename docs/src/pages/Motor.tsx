import { useState } from 'react'
import { Badge, Button, Input, paginationSummary } from '@dnui/react'
import { CodeBlock } from '../ui/CodeBlock'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const IMPORT = `import {
  createMenuStore,
  createModalStack,
  createMessageStore,
  createThemeStore,
  createFocusTrap,
  createDismiss,
  nextRovingIndex,
  matchTypeahead,
  positionOverlay,
  paginationSummary,
  debounce,
  formatNumber,
  cx
} from '@dnui/react/core'`

const STORE = `import { createStore } from '@dnui/react/core'

const contador = createStore(0)

const parar = contador.subscribe(() => console.log(contador.getSnapshot()))
contador.set((n) => n + 1)   // imprime 1
contador.set(1)              // no imprime: el valor no cambio
parar()`

const REACT = `import { useSyncExternalStore } from 'react'

// Asi es como la capa de React consume cualquier store del motor
const useStore = (store) =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)`

const PAGINACION = `import { paginationSummary } from '@dnui/react/core'

paginationSummary({ current: 3, pages: 5, limit: 20, total: 93 })
// {
//   page: 3, pages: 5, limit: 20, total: 93,
//   startRow: 41, endRow: 60,
//   isFirst: false, isLast: false
// }`

const PUREZA = `> @dnui/react@0.0.1 check:core
check:core ok — 37 archivo(s) en src/core/, ninguno depende de React`

export const Motor = () => {
  const [pagina, setPagina] = useState(3)
  const [limite, setLimite] = useState(20)
  const [total, setTotal] = useState(93)

  const resumen = paginationSummary({
    current: pagina,
    pages: Math.max(1, Math.ceil(total / Math.max(1, limite))),
    limit: limite,
    total
  })

  return (
    <Page
      title="El motor"
      description="Toda la logica de la libreria vive en TypeScript puro, sin una sola importacion de React. Se publica aparte para poder reutilizarla desde cualquier sitio."
      importFrom={IMPORT}
    >
      <Section title="La frontera esta verificada">
        <Prose>
          <p>
            No es una convencion que se pueda romper sin darse cuenta: un script recorre{' '}
            <code>src/core/</code> antes de cada compilacion y falla si encuentra un import de React
            o un archivo <code>.tsx</code>.
          </p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-4">
          <CodeBlock code={PUREZA} language="bash" />
        </div>
      </Section>

      <Section title="Stores">
        <Prose>
          <p>
            Todos los stores tienen la misma forma minima —{' '}
            <code>getSnapshot</code>, <code>subscribe</code>, <code>set</code> — que es justo la que
            espera <code>useSyncExternalStore</code>. No hay libreria de estado detras.
          </p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-6">
          <CodeBlock code={STORE} language="ts" />
        </div>
        <div className="rounded-box overflow-hidden mb-6">
          <CodeBlock code={REACT} language="ts" />
        </div>

        <PropsTable
          of="Stores disponibles"
          rows={[
            { name: 'createMenuStore', type: '() => MenuStore', description: 'Un unico menu abierto en toda la pagina, como el Menu.openMenu estatico de dn-ui.' },
            { name: 'createModalStack', type: '(scrollLock?) => ModalStackStore', description: 'Pila de modales y bloqueo de scroll por contador.' },
            { name: 'createMessageStore', type: '() => MessageStore', description: 'Cola de avisos con duracion y cierre.' },
            { name: 'createConfirmStore', type: '() => ConfirmStore', description: 'Cola de dialogos de confirmacion.' },
            { name: 'createThemeStore', type: '() => ThemeStore', description: 'Preferencia de tema, resolucion y persistencia.' },
            { name: 'createStore', type: '<T>(initial: T) => Store<T>', description: 'La primitiva sobre la que se construyen los demas.' }
          ]}
        />
        <Prose>
          <p>
            Cada uno exporta ademas una instancia compartida (<code>menuStore</code>,{' '}
            <code>modalStack</code>, <code>messageStore</code>, <code>themeStore</code>) que es la que
            usan los componentes.
          </p>
        </Prose>
      </Section>

      <Section title="Accesibilidad">
        <PropsTable
          rows={[
            { name: 'createFocusTrap', type: '(container, options?) => FocusTrap', description: 'Encierra el foco y lo devuelve al desactivarse.' },
            { name: 'createDismiss', type: '(options) => cleanup', description: 'Cierra al hacer click fuera o con Escape. Escucha en fase de captura, como dn-ui.' },
            { name: 'nextRovingIndex', type: '(current, count, key, options?) => number | null', description: 'Recorrido con flechas, Home y End. Devuelve null si la tecla no navega.' },
            { name: 'createTypeahead', type: '(timeout?) => Typeahead', description: 'Buffer de escritura rapida que se vacia solo.' },
            { name: 'matchTypeahead', type: '(labels, buffer, from?) => number', description: 'Busca por prefijo en circulo. Con una letra repetida cicla entre coincidencias, como manda WAI-ARIA.' },
            { name: 'getFocusable', type: '(container) => HTMLElement[]', description: 'Enfocables en orden de tabulacion, descartando inert y aria-hidden.' }
          ]}
        />
      </Section>

      <Section title="Posicionamiento">
        <PropsTable
          rows={[
            { name: 'positionOverlay', type: '(anchor, overlay, options?) => Promise<{x, y}>', description: 'Coloca un overlay y escribe left/top. Envuelve @floating-ui/dom.' },
            { name: 'trackOverlay', type: '(anchor, overlay, options?) => cleanup', description: 'Igual, pero reposiciona al hacer scroll o cambiar de tamano.' },
            { name: 'virtualElementAt', type: '({x, y}) => VirtualElement', description: 'Ancla de tamano cero en unas coordenadas, para menus contextuales.' }
          ]}
        />
        <Note title="Una diferencia deliberada">
          <p>
            dn-ui solo usa <code>flip()</code>. Aqui se anade <code>shift()</code>: sin el, un menu
            cerca del borde derecho se sale de la pantalla.
          </p>
        </Note>
      </Section>

      <Section title="Paginacion">
        <Prose>
          <p>
            La aritmetica del paginador es una funcion pura y esta probada aparte. Puedes usarla sin
            pintar nada.
          </p>
        </Prose>

        <Example description="Cambia los valores y mira como responde la funcion." code={PAGINACION} stack>
          <div className="flex flex-wrap gap-3">
            <label className="text-sm">
              Pagina
              <Input
                size="sm"
                type="number"
                min={1}
                value={pagina}
                onChange={(event) => setPagina(Number(event.target.value))}
              />
            </label>
            <label className="text-sm">
              Limite
              <Input
                size="sm"
                type="number"
                min={1}
                value={limite}
                onChange={(event) => setLimite(Number(event.target.value))}
              />
            </label>
            <label className="text-sm">
              Total
              <Input
                size="sm"
                type="number"
                min={0}
                value={total}
                onChange={(event) => setTotal(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge appearance="soft">startRow: {resumen.startRow}</Badge>
            <Badge appearance="soft">endRow: {resumen.endRow}</Badge>
            <Badge appearance="soft">pages: {resumen.pages}</Badge>
            <Badge appearance="soft" variant={resumen.isFirst ? 'info' : 'neutral'}>
              isFirst: {String(resumen.isFirst)}
            </Badge>
            <Badge appearance="soft" variant={resumen.isLast ? 'info' : 'neutral'}>
              isLast: {String(resumen.isLast)}
            </Badge>
          </div>
        </Example>
      </Section>

      <Section title="Utilidades">
        <PropsTable
          rows={[
            { name: 'debounce', type: '(fn, wait?) => Debounced', description: 'Con cancel(), para limpiar al desmontar.' },
            { name: 'formatNumber', type: '(value, precision?) => string | number', description: 'Locale es-US y dos decimales, igual que dn-ui. Devuelve el numero 0 si la entrada no es parseable.' },
            { name: 'uniqueId', type: '(length?) => number', description: 'Identificador numerico pseudo-unico.' },
            { name: 'loadingState', type: '(state, className, submitId?, root?) => void', description: 'Deshabilita en bloque los elementos con esa clase.' },
            { name: 'cx', type: '(...values) => string', description: 'Une clases descartando lo vacio. Sin dependencias.' },
            { name: 'isActiveLink', type: '(href, currentUrl) => boolean', description: 'La comparacion de URL que usa Navigation.' }
          ]}
        />
      </Section>

      <Section title="Y la tabla">
        <Note variant="warning" title="Pendiente">
          <p>
            El motor del data grid — reducer de estado, arbol de filtros, orden, seleccion, columnas
            y resumen — es la segunda etapa. Vivira en <code>core/table</code> y{' '}
            <code>core/filter</code>, con la misma regla: sin React.
          </p>
        </Note>
        <Button appearance="outline" disabled>
          DataGrid — proximamente
        </Button>
      </Section>
    </Page>
  )
}
