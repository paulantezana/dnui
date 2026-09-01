import { useRef } from 'react'
import { Link } from 'react-router'
import { Button, message } from '@dnui/react'
import { CodeBlock } from '../ui/CodeBlock'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const MONTAJE = `import { App } from '@dnui/react'

// El proveedor monta el contenedor por ti
<App>
  <MiAplicacion />
</App>`

const DESDE_HOOK = `import { useApp } from '@dnui/react'

const Guardar = () => {
  const { message } = useApp()
  return <Button onClick={() => message.success('Guardado')}>Guardar</Button>
}`

const PROGRESO = `const id = message.info('Subiendo archivo…', Infinity)

try {
  await subir(archivo)
  message.update(id, { content: 'Subido', type: 'success', icon: 'success' })
  setTimeout(() => message.close(id), 2000)
} catch {
  message.update(id, { content: 'Fallo la subida', type: 'danger', icon: 'danger' })
}`

export const MessagePage = () => {
  const idPersistente = useRef<number | null>(null)

  const abrirPersistente = () => {
    if (idPersistente.current !== null) return
    idPersistente.current = message.info('No me voy solo. Cierrame tu.', Infinity)
  }

  const cerrarPersistente = () => {
    if (idPersistente.current === null) return
    message.close(idPersistente.current)
    idPersistente.current = null
  }

  const simularSubida = () => {
    const id = message.info('Subiendo archivo…', Infinity)
    setTimeout(() => {
      message.update(id, { content: 'Archivo subido', type: 'success', icon: 'success' })
      setTimeout(() => message.close(id), 2000)
    }, 1500)
  }

  return (
    <Page
      title="Message"
      description="Avisos flotantes que se van solos. Se llaman desde cualquier sitio, tambien fuera de React."
      importFrom={`import { MessageHost, message } from '@dnui/react'`}
    >
      <Section title="Montaje">
        <Prose>
          <p>
            <code>message.*</code> escribe en un store; hace falta algo que lo pinte. Lo mas comodo
            es envolver la aplicacion en <Link to="/app">App</Link>, que monta el contenedor por
            dentro. Si prefieres montarlo suelto, existe <code>&lt;MessageHost /&gt;</code>.
          </p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-6">
          <CodeBlock code={MONTAJE} filename="main.tsx" />
        </div>

        <Prose>
          <p>Y dentro de cualquier componente:</p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-4">
          <CodeBlock code={DESDE_HOOK} />
        </div>
      </Section>

      <Section title="Tipos">
        <Example
          description="Pruebalo: los avisos salen arriba a la derecha."
          code={`message.info('Un aviso informativo')
message.success('Guardado correctamente')
message.warning('Revisa los datos')
message.danger('No se pudo guardar')`}
        >
          <Button onClick={() => message.info('Un aviso informativo')}>info</Button>
          <Button variant="success" onClick={() => message.success('Guardado correctamente')}>
            success
          </Button>
          <Button variant="warning" onClick={() => message.warning('Revisa los datos')}>
            warning
          </Button>
          <Button variant="error" onClick={() => message.danger('No se pudo guardar')}>
            danger
          </Button>
        </Example>
      </Section>

      <Section title="Duracion">
        <Prose>
          <p>
            Por defecto son <strong>6000 ms</strong>. Se pasa otro valor como segundo argumento, o
            como <code>duration</code> si usas la forma de objeto. Con <code>Infinity</code> el aviso
            no se va solo.
          </p>
        </Prose>
        <Example
          code={`message.info('Rapido', 1500)
message.info({ content: 'Con objeto', duration: 3000 })
message.info('Persistente', Infinity)`}
        >
          <Button onClick={() => message.info('Rapido, 1,5 s', 1500)}>1,5 s</Button>
          <Button onClick={() => message.info({ content: 'Con objeto, 3 s', duration: 3000 })}>
            forma de objeto
          </Button>
          <Button onClick={abrirPersistente}>persistente</Button>
          <Button appearance="ghost" onClick={cerrarPersistente}>
            cerrar el persistente
          </Button>
        </Example>

        <Note title="La regla rara de message()">
          <p>
            <code>message.message(texto, duracion)</code> conserva un detalle de dn-ui: cualquier
            duracion <em>falsy</em> — incluido <code>0</code> — se sustituye por 20 s. Si quieres un
            aviso que no se cierre, usa <code>Infinity</code>, no <code>0</code>.
          </p>
        </Note>
      </Section>

      <Section title="Actualizar un aviso">
        <Prose>
          <p>
            Cada llamada devuelve un id. Con el se puede cambiar el contenido o el tipo sin cerrar y
            volver a abrir — util para una operacion larga.
          </p>
        </Prose>
        <Example code={PROGRESO} openByDefault>
          <Button variant="primary" onClick={simularSubida}>
            Simular una subida
          </Button>
        </Example>
      </Section>

      <Section title="Cerrar">
        <Example
          code={`{/* Abrir varios */}
message.info('Uno')
message.success('Dos')
message.warning('Tres')

{/* Cerrar uno concreto */}
const id = message.info('Cargando', Infinity)
message.close(id)

{/* Cerrarlos todos */}
message.closeAll()

{/* Cuantos hay abiertos ahora mismo */}
message.getAll().length`}
        >
          <Button
            onClick={() => {
              message.info('Uno')
              message.success('Dos')
              message.warning('Tres')
            }}
          >
            Abrir tres
          </Button>
          <Button appearance="outline" onClick={() => message.closeAll()}>
            Cerrarlos todos
          </Button>
          <Button
            appearance="ghost"
            onClick={() => message.info(`Ahora mismo hay ${message.getAll().length}`)}
          >
            Contar
          </Button>
        </Example>
      </Section>

      <Section title="Fuera de React">
        <Prose>
          <p>
            <code>message</code> es un objeto normal sobre un store del motor. Se puede llamar desde
            un interceptor de fetch, desde un manejador de errores global o desde cualquier modulo.
          </p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-4">
          <CodeBlock
            code={`// api.ts — ni un componente a la vista
import { message } from '@dnui/react'

export const peticion = async (url: string) => {
  const respuesta = await fetch(url)
  if (!respuesta.ok) message.danger(\`Error \${respuesta.status}\`)
  return respuesta
}`}
          />
        </div>
      </Section>

      <Section title="API">
        <PropsTable
          of="message"
          rows={[
            { name: 'info(contenido, duracion?)', type: '(string | { content, duration }) => number', description: 'Aviso informativo. Devuelve el id.' },
            { name: 'success / warning / danger', type: 'igual que info', description: 'Los otros tres tipos.' },
            { name: 'message(texto, duracion?, tipo?)', type: '(string, number?, MessageType?) => number', description: 'Forma cruda. Una duracion falsy se convierte en 20000, como en dn-ui.' },
            { name: 'update(id, patch)', type: '(number, Partial<MessageItem>) => void', description: 'Cambia contenido, tipo o icono de un aviso abierto.' },
            { name: 'close(id)', type: '(number) => void', description: 'Cierra uno.' },
            { name: 'closeAll()', type: '() => void', description: 'Cierra todos.' },
            { name: 'getAll()', type: '() => MessageItem[]', description: 'Los avisos abiertos ahora mismo.' }
          ]}
        />

        <Note variant="warning" title="Solo arriba a la derecha">
          <p>
            <code>message.css</code> fija el contenedor en esa esquina, asi que no hay otras
            posiciones. La pagina de demo de dn-ui menciona <code>top-left</code> y companeros, pero
            ese codigo nunca existio.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
