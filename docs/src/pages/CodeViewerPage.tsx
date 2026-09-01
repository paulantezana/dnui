import { CodeViewer } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const EJEMPLO = `const total = items.reduce((suma, item) => suma + item.precio, 0)

if (total > 1000) {
  aplicarDescuento(total)
}`

const LARGO = `pnpm --filter @dnui/react build && pnpm --filter @dnui/react test && pnpm --filter @dnui/docs build`

export const CodeViewerPage = () => (
  <Page
    title="CodeViewer"
    description="Bloque de codigo con fondo oscuro fijo y scroll horizontal propio."
    importFrom={`import { CodeViewer } from '@dnui/react'`}
  >
    <Section title="Con la prop code">
      <Example
        code={`<CodeViewer code={fuente} language="ts" />`}
        stack
      >
        <div className="w-full">
          <CodeViewer code={EJEMPLO} language="ts" />
        </div>
      </Example>
    </Section>

    <Section title="Con children">
      <Prose>
        <p>
          Si no pasas <code>code</code>, se usa el contenido. Es lo comodo cuando el fragmento va
          escrito a mano.
        </p>
      </Prose>
      <Example
        code={`<CodeViewer>npm install @dnui/react</CodeViewer>`}
        stack
      >
        <div className="w-full">
          <CodeViewer>npm install @dnui/react</CodeViewer>
        </div>
      </Example>
    </Section>

    <Section title="Lineas largas">
      <Prose>
        <p>
          El bloque tiene <code>overflow: auto</code> y <code>max-width: 100%</code>, asi que una
          linea larga desplaza dentro del bloque en vez de romper el ancho de la pagina.
        </p>
      </Prose>
      <Example code={`<CodeViewer code={comandoLargo} language="bash" />`} stack>
        <div className="w-full max-w-md">
          <CodeViewer code={LARGO} language="bash" />
        </div>
      </Example>
    </Section>

    <Section title="API">
      <PropsTable
        of="<CodeViewer />"
        rows={[
          { name: 'code', type: 'string', description: 'Contenido. Si se pasa, manda sobre children.' },
          { name: 'children', type: 'ReactNode', description: 'Contenido alternativo.' },
          { name: 'language', type: 'string', description: 'Anade la clase language-{valor}, para engancharle un resaltador externo.' },
          { name: '…rest', type: 'HTMLAttributes<HTMLPreElement>', description: 'Todo lo demas va al pre.' }
        ]}
      />

      <Note title="No resalta la sintaxis">
        <p>
          El componente solo pinta el bloque; el color es fijo. Si quieres resaltado, pasa{' '}
          <code>language</code> y engancha tu propio resaltador, o compon el HTML como hace este
          sitio: los ejemplos de esta documentacion usan <code>.code-viewer</code> con un
          tokenizador propio de unas cuarenta lineas.
        </p>
      </Note>
    </Section>
  </Page>
)
