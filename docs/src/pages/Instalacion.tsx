import { Link } from 'react-router'
import { CodeBlock } from '../ui/CodeBlock'
import { Note, Page, Prose, Section } from '../ui/Page'

const INSTALAR = `pnpm add @dnui/react
# npm i @dnui/react
# yarn add @dnui/react`

const PEERS = `pnpm add react react-dom`

const ESTILOS_COMPILADOS = `// main.tsx — CSS ya compilado, no necesitas Tailwind
import '@dnui/react/style.css'`

const ESTILOS_FUENTE = `/* styles.css — si ya compilas Tailwind v4 en tu app */
@import "@dnui/react/styles.css";`

const APP = `import { App } from '@dnui/react'
import '@dnui/react/style.css'

createRoot(document.getElementById('root')!).render(
  <App>
    <MiAplicacion />
  </App>
)`

const USO = `import { useApp } from '@dnui/react'

const Guardar = () => {
  const { message } = useApp()

  return (
    <Button variant="primary" onClick={() => message.success('Listo')}>
      Guardar
    </Button>
  )
}`

const CORE = `// Sin React: el motor se publica aparte
import { paginationSummary, createMenuStore } from '@dnui/react/core'`

export const Instalacion = () => (
  <Page
    title="Instalacion"
    description="Instalar el paquete, conectar los estilos y envolver la aplicacion en el proveedor."
  >
    <Section title="1. Instalar">
      <div className="rounded-box overflow-hidden mb-4">
        <CodeBlock code={INSTALAR} language="bash" />
      </div>
      <Prose>
        <p>
          <code>react</code> y <code>react-dom</code> son <em>peer dependencies</em>. Hace falta la
          version 19 o superior.
        </p>
      </Prose>
      <div className="rounded-box overflow-hidden mb-4">
        <CodeBlock code={PEERS} language="bash" />
      </div>
    </Section>

    <Section title="2. Conectar los estilos">
      <Prose>
        <p>
          Los estilos <strong>no se inyectan solos</strong>. Hay dos formas, segun si tu aplicacion
          ya compila Tailwind v4 o no.
        </p>
      </Prose>

      <h3 className="text-base font-medium mb-2">Opcion A — CSS ya compilado</h3>
      <Prose>
        <p>Lo mas rapido. No necesitas Tailwind en tu proyecto.</p>
      </Prose>
      <div className="rounded-box overflow-hidden mb-6">
        <CodeBlock code={ESTILOS_COMPILADOS} />
      </div>

      <h3 className="text-base font-medium mb-2">Opcion B — la fuente</h3>
      <Prose>
        <p>
          Si ya usas Tailwind v4, importa la fuente: comparte una sola pasada de compilacion y
          puedes reajustar los tokens desde tu propio <code>@theme</code>.
        </p>
      </Prose>
      <div className="rounded-box overflow-hidden mb-4">
        <CodeBlock code={ESTILOS_FUENTE} language="css" />
      </div>

      <Note title="Esta pagina usa la opcion B">
        <p>
          Este sitio importa la fuente y compila Tailwind con{' '}
          <code>@tailwindcss/vite</code>. Sirve de ejemplo real de esa configuracion.
        </p>
      </Note>
    </Section>

    <Section title="3. Envolver en App">
      <Prose>
        <p>
          <Link to="/app">App</Link> es el proveedor global, al estilo de Ant Design. Monta por
          dentro los contenedores de avisos y dialogos, y arranca el tema.
        </p>
      </Prose>
      <div className="rounded-box overflow-hidden mb-6">
        <CodeBlock code={APP} filename="main.tsx" />
      </div>

      <Prose>
        <p>
          A partir de ahi, <code>useApp()</code> da acceso a <code>message</code> y{' '}
          <code>modal</code> desde cualquier componente.
        </p>
      </Prose>
      <div className="rounded-box overflow-hidden mb-4">
        <CodeBlock code={USO} />
      </div>

      <Prose>
        <p>
          Los componentes declarativos (<Link to="/modal">Modal</Link>,{' '}
          <Link to="/menu">Menu</Link>, <Link to="/tooltip">Tooltip</Link>) no necesitan nada de
          esto: se portalizan solos.
        </p>
      </Prose>
    </Section>

    <Section title="Solo el motor, sin React">
      <Prose>
        <p>
          Toda la logica se publica tambien por separado. Util desde un worker, desde Vue o desde un
          test que no monta nada.
        </p>
      </Prose>
      <div className="rounded-box overflow-hidden mb-4">
        <CodeBlock code={CORE} language="ts" />
      </div>
      <Prose>
        <p>
          Lo que hay dentro esta en <Link to="/motor">El motor</Link>.
        </p>
      </Prose>
    </Section>
  </Page>
)
