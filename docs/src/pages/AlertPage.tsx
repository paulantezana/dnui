import { useState } from 'react'
import { Alert, Button, Icon } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const AlertPage = () => {
  const [visible, setVisible] = useState(true)

  return (
    <Page
      title="Alert"
      description="Aviso fijo dentro del contenido. Para avisos flotantes que se van solos, usa Message."
      importFrom={`import { Alert } from '@dnui/react'`}
    >
      <Section title="Variantes">
        <Example
          code={`<Alert variant="info">Un aviso informativo</Alert>
<Alert variant="success">Guardado correctamente</Alert>
<Alert variant="warning">Revisa los datos</Alert>
<Alert variant="error">No se pudo guardar</Alert>`}
          stack
        >
          <div className="w-full grid gap-2">
            <Alert>Sin variante</Alert>
            <Alert variant="info">Un aviso informativo</Alert>
            <Alert variant="success">Guardado correctamente</Alert>
            <Alert variant="warning">Revisa los datos antes de continuar</Alert>
            <Alert variant="error">No se pudo guardar</Alert>
          </div>
        </Example>
      </Section>

      <Section title="Acabados">
        <Example
          code={`<Alert variant="info" appearance="soft">soft</Alert>
<Alert variant="info" appearance="outline">outline</Alert>
<Alert variant="info" appearance="dash">dash</Alert>`}
          stack
        >
          <div className="w-full grid gap-2">
            <Alert variant="info" appearance="soft">
              soft
            </Alert>
            <Alert variant="info" appearance="outline">
              outline
            </Alert>
            <Alert variant="info" appearance="dash">
              dash
            </Alert>
          </div>
        </Example>
      </Section>

      <Section title="Con icono">
        <Prose>
          <p>
            El icono no viene de serie: se pasa por <code>icon</code> y se coloca antes del
            contenido.
          </p>
        </Prose>
        <Example
          code={`<Alert variant="success" appearance="soft" icon={<Icon name="tick" />}>
  Los cambios se guardaron
</Alert>

<Alert variant="error" appearance="soft" icon={<Icon name="cross" />}>
  La conexion se perdio
</Alert>

<Alert variant="warning" appearance="soft" icon={<Icon name="not-allowed" />}>
  No tienes permiso para editar este registro
</Alert>`}
          stack
        >
          <div className="w-full grid gap-2">
            <Alert variant="success" appearance="soft" icon={<Icon name="tick" />}>
              Los cambios se guardaron
            </Alert>
            <Alert variant="error" appearance="soft" icon={<Icon name="cross" />}>
              La conexion se perdio
            </Alert>
            <Alert variant="warning" appearance="soft" icon={<Icon name="not-allowed" />}>
              No tienes permiso para editar este registro
            </Alert>
          </div>
        </Example>
      </Section>

      <Section title="Con acciones">
        <Prose>
          <p>
            <code>direction="vertical"</code> apila el contenido, que es lo que hace falta cuando el
            aviso lleva botones o varias lineas.
          </p>
        </Prose>
        <Example
          code={`<Alert variant="warning" appearance="soft" direction="vertical">
  <div>
    <p className="font-medium">Tu suscripcion vence en 3 dias</p>
    <p className="text-sm">Renueva ahora para no perder el acceso.</p>
  </div>
  <div className="flex gap-2">
    <Button size="sm" variant="primary">Renovar</Button>
    <Button size="sm" appearance="ghost">Mas tarde</Button>
  </div>
</Alert>`}
          stack
        >
          <div className="w-full">
            <Alert variant="warning" appearance="soft" direction="vertical">
              <div>
                <p className="font-medium">Tu suscripcion vence en 3 dias</p>
                <p className="text-sm">Renueva ahora para no perder el acceso.</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary">
                  Renovar
                </Button>
                <Button size="sm" appearance="ghost">
                  Mas tarde
                </Button>
              </div>
            </Alert>
          </div>
        </Example>
      </Section>

      <Section title="Cerrable">
        <Prose>
          <p>
            Sin <code>onClose</code>, el componente se oculta solo. Con <code>onClose</code> manda
            quien lo usa y el aviso sigue montado hasta que decida quitarlo — que es lo que hace
            falta si el estado vive fuera.
          </p>
        </Prose>
        <Example
          code={`const [visible, setVisible] = useState(true)

{/* Sin onClose, el componente se oculta solo */}
<Alert variant="info" closable>
  Puedes cerrarme, me oculto solo
</Alert>

{/* Con onClose, mandas tu */}
{visible ? (
  <Alert variant="warning" closable onClose={() => setVisible(false)}>
    Controlado desde fuera
  </Alert>
) : (
  <Button size="sm" appearance="outline" onClick={() => setVisible(true)}>
    Volver a mostrar
  </Button>
)}`}
          stack
        >
          <div className="w-full grid gap-2">
            <Alert variant="info" closable>
              Puedes cerrarme, me oculto solo
            </Alert>

            {visible ? (
              <Alert variant="warning" closable onClose={() => setVisible(false)}>
                Controlado desde fuera
              </Alert>
            ) : (
              <Button size="sm" appearance="outline" onClick={() => setVisible(true)}>
                Volver a mostrar
              </Button>
            )}
          </div>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Alert />"
          rows={[
            { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", description: 'Color del aviso.' },
            { name: 'appearance', type: "'outline' | 'dash' | 'soft'", description: 'Acabado.' },
            { name: 'direction', type: "'horizontal' | 'vertical'", description: 'vertical apila icono, texto y acciones.' },
            { name: 'icon', type: 'ReactNode', description: 'Se pinta antes del contenido.' },
            { name: 'closable', type: 'boolean', default: 'false', description: 'Muestra el boton de cierre.' },
            { name: 'onClose', type: '() => void', description: 'Si se pasa, el componente no se oculta solo.' },
            { name: 'closeLabel', type: 'string', default: "'Cerrar'", description: 'Etiqueta accesible del boton de cierre.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div, que ya lleva role="alert".' }
          ]}
        />

        <Note title="role=alert interrumpe">
          <p>
            Un lector de pantalla anuncia el contenido en cuanto aparece, cortando lo que estuviera
            leyendo. Es lo correcto para un error, no para un texto informativo que ya estaba en la
            pagina al cargarla.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
