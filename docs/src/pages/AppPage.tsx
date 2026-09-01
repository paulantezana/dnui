import { Button, useApp } from '@dnui/react'
import { CodeBlock } from '../ui/CodeBlock'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const MONTAJE = `import { App } from '@dnui/react'
import '@dnui/react/style.css'

createRoot(document.getElementById('root')!).render(
  <App>
    <MiAplicacion />
  </App>
)`

const ANTES = `// Sin proveedor: hay que acordarse de montar los dos contenedores
import { MessageHost, ModalHost, message, modal } from '@dnui/react'

const Raiz = () => (
  <>
    <MessageHost />
    <ModalHost />
    <MiAplicacion />
  </>
)`

const USO = `import { useApp } from '@dnui/react'

const Formulario = () => {
  const { message, modal } = useApp()

  const borrar = () =>
    modal.confirm({
      title: 'Borrar registro',
      content: 'Esta accion no se puede deshacer.',
      onOk: () => message.success('Borrado')
    })

  return <Button onClick={borrar}>Borrar</Button>
}`

const FUERA = `// api.ts — fuera de React, sin proveedor a la vista
import { message } from '@dnui/react'

export const peticion = async (url: string) => {
  const respuesta = await fetch(url)
  if (!respuesta.ok) message.danger(\`Error \${respuesta.status}\`)
  return respuesta
}`

const Consumidor = () => {
  const { message, modal } = useApp()

  return (
    <>
      <Button onClick={() => message.success('Sale del hook, no del import')}>
        message desde useApp
      </Button>
      <Button
        appearance="outline"
        onClick={() =>
          modal.confirm({
            title: 'Tambien el modal',
            content: 'Los dos vienen del mismo contexto.',
            onOk: () => message.info('Confirmado')
          })
        }
      >
        modal desde useApp
      </Button>
    </>
  )
}

export const AppPage = () => (
  <Page
    title="App"
    description="Proveedor global, al estilo del App de Ant Design: monta los contenedores una sola vez y reparte message y modal por contexto."
    importFrom={`import { App, useApp } from '@dnui/react'`}
  >
    <Section title="Montaje">
      <Prose>
        <p>
          Envuelve tu aplicacion una vez, en la raiz. <code>App</code> monta por dentro{' '}
          <code>MessageHost</code> y <code>ModalHost</code>, y arranca el tema.
        </p>
      </Prose>
      <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--docs-line)' }}>
        <CodeBlock code={MONTAJE} filename="main.tsx" />
      </div>

      <Prose>
        <p>Sin el proveedor habria que acordarse de montar los dos contenedores a mano:</p>
      </Prose>
      <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid var(--docs-line)' }}>
        <CodeBlock code={ANTES} />
      </div>
    </Section>

    <Section title="useApp()">
      <Prose>
        <p>
          Desde cualquier componente por debajo del proveedor, <code>useApp()</code> devuelve{' '}
          <code>message</code> y <code>modal</code>.
        </p>
      </Prose>

      <Example description="Estos botones usan el hook, no el import estatico." code={USO}>
        <Consumidor />
      </Example>
    </Section>

    <Section title="Que aporta frente al import estatico">
      <Prose>
        <ul>
          <li>
            <strong>No hay que montar nada mas.</strong> El olvido de <code>MessageHost</code> es el
            fallo tipico: las llamadas no revientan, simplemente no aparece nada.
          </li>
          <li>
            <strong>Falla en voz alta.</strong> Si usas <code>useApp()</code> fuera del proveedor,
            lanza un error con el motivo, en vez de dejarte adivinando.
          </li>
          <li>
            <strong>Un sitio para la configuracion.</strong> El tema inicial se pasa por prop, y ahi
            iran los ajustes que vengan.
          </li>
        </ul>
      </Prose>

      <Note title="Los imports estaticos siguen funcionando">
        <p>
          <code>message</code> y <code>modal</code> se apoyan en stores del motor, no en contexto de
          React, asi que se pueden llamar desde un interceptor de fetch o desde un manejador de
          errores global. Lo unico que necesitan es que el proveedor este montado en algun sitio.
        </p>
      </Note>

      <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid var(--docs-line)' }}>
        <CodeBlock code={FUERA} filename="api.ts" />
      </div>
    </Section>

    <Section title="API">
      <PropsTable
        of="<App />"
        rows={[
          { name: 'children', type: 'ReactNode', required: true, description: 'Tu aplicacion.' },
          { name: 'component', type: "'div' | false", default: "'div'", description: 'Envuelve en un div.dn-app. Con false no anade ningun nodo al arbol.' },
          { name: 'theme', type: "'light' | 'dark' | 'system'", description: 'Tema inicial. Sin el se respeta lo guardado y, en su defecto, la preferencia del sistema.' },
          { name: 'className', type: 'string', description: 'Clases del div envolvente.' }
        ]}
      />

      <PropsTable
        of="useApp()"
        rows={[
          { name: 'message', type: 'typeof message', description: 'La misma API de avisos: info, success, warning, danger, update, close, closeAll, getAll.' },
          { name: 'modal', type: 'typeof modal', description: 'La misma API de dialogos: confirm, info, success, danger, warning, closeAll.' }
        ]}
      />

      <Prose>
        <p>
          Tambien esta disponible como <code>App.useApp()</code>, por si vienes de Ant Design.
        </p>
      </Prose>
    </Section>
  </Page>
)
