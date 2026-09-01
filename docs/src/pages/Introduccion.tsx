import { Link } from 'react-router'
import { Badge, Button, Menu, MenuContent, MenuItem, MenuTrigger, message } from '@dnui/react'
import { CodeBlock } from '../ui/CodeBlock'
import { Note, Prose, Section } from '../ui/Page'

const EJEMPLO = `import { Button, Menu, MenuContent, MenuItem, MenuTrigger, message } from '@dnui/react'

export const Acciones = () => (
  <Menu>
    <MenuTrigger>
      <Button variant="primary">Acciones</Button>
    </MenuTrigger>
    <MenuContent label="Acciones">
      <MenuItem onSelect={() => message.success('Guardado')}>Guardar</MenuItem>
      <MenuItem onSelect={() => message.info('Duplicado')}>Duplicar</MenuItem>
      <MenuItem disabled>Borrar</MenuItem>
    </MenuContent>
  </Menu>
)`

const CIFRAS = [
  { valor: '29', etiqueta: 'componentes' },
  { valor: '223', etiqueta: 'tests' },
  { valor: '9,4 KB', etiqueta: 'JS comprimido' },
  { valor: '0', etiqueta: 'librerias headless' }
]

const PILARES = [
  {
    titulo: 'Motor en TypeScript',
    texto: 'Stores, accesibilidad, posicionamiento y utilidades. Ni una importacion de React, y hay un script que lo comprueba en cada compilacion.'
  },
  {
    titulo: 'Sin librerias headless',
    texto: 'La unica dependencia es @floating-ui/dom, que ya usaba dn-ui. El resto es codigo propio, con las mismas clases CSS.'
  },
  {
    titulo: 'Accesibilidad de serie',
    texto: 'Roles, teclado, foco atrapado y retorno de foco donde dn-ui no tenia absolutamente nada.'
  }
]

export const Introduccion = () => (
  <article>
    <header className="mb-14">
      <Badge variant="info" appearance="soft" size="sm" className="mb-4">
        Etapa 1 · todo menos el data grid
      </Badge>

      <h1 className="text-[2.6rem] leading-[1.12] font-medium tracking-tight mb-4 max-w-2xl">
        Los componentes de dn-ui,
        <br />
        ahora en React.
      </h1>

      <p className="text-[18px] leading-relaxed text-base-content/65 max-w-xl mb-7">
        Los mismos componentes, el mismo comportamiento y las mismas clases CSS. React se queda
        solo con lo que se pinta; la logica vive aparte, en TypeScript puro.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link to="/instalacion" className="no-underline">
          <Button variant="primary">Empezar</Button>
        </Link>
        <Link to="/button" className="no-underline">
          <Button appearance="outline">Ver componentes</Button>
        </Link>
      </div>

      <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-xl" style={{ background: 'var(--docs-line)' }}>
        {CIFRAS.map((cifra) => (
          <div key={cifra.etiqueta} className="docs-surface px-4 py-4">
            <dt className="text-[22px] font-medium tracking-tight">{cifra.valor}</dt>
            <dd className="text-[12.5px] text-base-content/55 mt-0.5">{cifra.etiqueta}</dd>
          </div>
        ))}
      </dl>
    </header>

    <Section title="La idea">
      <Prose>
        <p>
          La logica de cada componente vive en <code>src/core</code>, que <strong>no importa
          React</strong>. La capa de React se limita a pintar y a enganchar eventos. Es la
          separacion motor / render que usa AG Grid, y es lo que permite reutilizar el motor desde
          otro framework, o desde ninguno.
        </p>
        <p>
          No es una convencion que se pueda romper sin darse cuenta: un script recorre esa carpeta
          antes de cada compilacion y falla si encuentra un import de React o un archivo{' '}
          <code>.tsx</code>.
        </p>
      </Prose>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {PILARES.map((pilar) => (
          <div
            key={pilar.titulo}
            className="docs-surface rounded-xl p-4"
            style={{ border: '1px solid var(--docs-line)' }}
          >
            <p className="font-medium text-[14.5px] mb-1.5">{pilar.titulo}</p>
            <p className="text-[13.5px] leading-relaxed text-base-content/60">{pilar.texto}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Un vistazo">
      <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid var(--docs-line)' }}>
        <CodeBlock code={EJEMPLO} filename="Acciones.tsx" />
      </div>

      <div
        className="docs-surface rounded-xl p-6 mb-5 flex items-center gap-4"
        style={{ border: '1px solid var(--docs-line)' }}
      >
        <Menu>
          <MenuTrigger>
            <Button variant="primary">Acciones</Button>
          </MenuTrigger>
          <MenuContent label="Acciones">
            <MenuItem onSelect={() => message.success('Guardado')}>Guardar</MenuItem>
            <MenuItem onSelect={() => message.info('Duplicado')}>Duplicar</MenuItem>
            <MenuItem disabled>Borrar</MenuItem>
          </MenuContent>
        </Menu>

        <p className="text-[13px] text-base-content/55">
          Pruebalo: flechas, Home, End, escribir para buscar, Escape para cerrar.
        </p>
      </div>

      <Prose>
        <p>
          Ese menu es accesible por teclado y el foco vuelve al disparador al cerrarlo. Nada de eso
          hay que configurarlo.
        </p>
      </Prose>
    </Section>

    <Section title="Estado">
      <Prose>
        <p>
          Todos los componentes de dn-ui estan portados salvo el <strong>data grid</strong>: la
          tabla con paginacion por servidor, filtros anidados, orden, seleccion y columnas
          configurables. La version presentacional de <Link to="/table">Table</Link> si esta
          disponible.
        </p>
      </Prose>

      <Note variant="warning" title="Dos piezas sin estilo">
        <p>
          <Link to="/tooltip">Tooltip</Link> y el hook <code>useRipple</code> funcionan, pero no
          traen CSS. dn-ui tampoco lo envia: sus reglas viven en un pipeline SCSS desactivado. Hay
          que darles estilo.
        </p>
      </Note>
    </Section>

    <Section title="Esta pagina es tambien el banco de pruebas">
      <Prose>
        <p>
          Cada ejemplo monta el componente real desde el paquete, consumido por su{' '}
          <code>exports</code> igual que lo haria cualquiera. Si la libreria rompe sus tipos o su
          CSS, esta documentacion deja de compilar.
        </p>
      </Prose>
    </Section>
  </article>
)
