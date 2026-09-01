import { useState } from 'react'
import {
  Button,
  FormItem,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  message,
  modal
} from '@dnui/react'
import { CodeBlock } from '../ui/CodeBlock'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const MONTAJE = `import { ModalHost } from '@dnui/react'

// Una sola vez, cerca de la raiz. Solo hace falta para modal.confirm y companeros.
<ModalHost />`

export const ModalPage = () => {
  const [basico, setBasico] = useState(false)
  const [conFormulario, setConFormulario] = useState(false)
  const [sinMascara, setSinMascara] = useState(false)
  const [primero, setPrimero] = useState(false)
  const [segundo, setSegundo] = useState(false)

  return (
    <Page
      title="Modal"
      description="Dialogo con foco atrapado, cierre con Escape y bloqueo de scroll por contador. Hay dos formas de usarlo: como componente o con la API imperativa."
      importFrom={`import { Modal, ModalBody, ModalFooter, ModalHost, modal } from '@dnui/react'`}
    >
      <Section title="Como componente">
        <Prose>
          <p>
            La forma declarativa: tu guardas el estado abierto y el componente se portaliza solo. No
            necesita ningun host.
          </p>
        </Prose>
        <Example
          code={`const [abierto, setAbierto] = useState(false)

<Button onClick={() => setAbierto(true)}>Editar</Button>

<Modal
  open={abierto}
  onClose={() => setAbierto(false)}
  title="Editar registro"
  footer={
    <ModalFooter>
      <Button onClick={() => setAbierto(false)}>Cancelar</Button>
      <Button variant="primary" onClick={guardar}>Guardar</Button>
    </ModalFooter>
  }
>
  <ModalBody>
    <FormItem label="Nombre" htmlFor="nombre">
      <Input id="nombre" defaultValue="Informe mensual" />
    </FormItem>
  </ModalBody>
</Modal>`}
        >
          <Button variant="primary" onClick={() => setConFormulario(true)}>
            Editar registro
          </Button>

          <Modal
            open={conFormulario}
            onClose={() => setConFormulario(false)}
            title="Editar registro"
            footer={
              <ModalFooter>
                <Button onClick={() => setConFormulario(false)}>Cancelar</Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setConFormulario(false)
                    message.success('Guardado')
                  }}
                >
                  Guardar
                </Button>
              </ModalFooter>
            }
          >
            <ModalBody>
              <FormItem label="Nombre" htmlFor="modal-nombre">
                <Input id="modal-nombre" defaultValue="Informe mensual" />
              </FormItem>
              <FormItem label="Descripcion" htmlFor="modal-desc">
                <Input id="modal-desc" placeholder="Opcional" />
              </FormItem>
            </ModalBody>
          </Modal>
        </Example>
      </Section>

      <Section title="Comportamiento">
        <Prose>
          <ul>
            <li>Al abrirse, el foco entra en el dialogo y no puede salir con Tab.</li>
            <li>Al cerrarse, el foco vuelve exactamente a donde estaba.</li>
            <li>Escape cierra solo el modal de arriba de la pila.</li>
            <li>El scroll de la pagina se bloquea mientras quede algun modal abierto.</li>
          </ul>
          <p>Nada de eso existe en dn-ui.</p>
        </Prose>

        <Example
          description="Sin titulo, sin boton de cierre y sin cierre al pulsar el fondo: solo se sale por los botones."
          code={`<Button appearance="outline" onClick={() => setAbierto(true)}>
  Sin salida facil
</Button>

<Modal
  open={abierto}
  onClose={() => setAbierto(false)}
  maskClosable={false}
  closable={false}
  title="Confirma antes de salir"
  footer={
    <ModalFooter>
      <Button variant="primary" onClick={() => setAbierto(false)}>Entendido</Button>
    </ModalFooter>
  }
>
  <ModalBody>
    <p className="text-sm">
      Pulsar el fondo no cierra, y no hay boton de aspa. Escape si sigue funcionando.
    </p>
  </ModalBody>
</Modal>`}
        >
          <Button appearance="outline" onClick={() => setSinMascara(true)}>
            Sin salida facil
          </Button>

          <Modal
            open={sinMascara}
            onClose={() => setSinMascara(false)}
            maskClosable={false}
            closable={false}
            title="Confirma antes de salir"
            footer={
              <ModalFooter>
                <Button variant="primary" onClick={() => setSinMascara(false)}>
                  Entendido
                </Button>
              </ModalFooter>
            }
          >
            <ModalBody>
              <p className="text-sm">
                Pulsar el fondo no cierra, y no hay boton de aspa. Escape si sigue funcionando.
              </p>
            </ModalBody>
          </Modal>
        </Example>
      </Section>

      <Section title="Apilados">
        <Example
          description="Abre el primero y desde el, el segundo. Escape cierra solo el de arriba, y el scroll no se libera hasta que se cierren los dos."
          code={`<Button onClick={() => setPrimero(true)}>Abrir el primero</Button>

<Modal open={primero} onClose={() => setPrimero(false)} title="Primero">
  <ModalBody>
    <p className="text-sm mb-4">Este es el modal de abajo.</p>
    <Button variant="primary" onClick={() => setSegundo(true)}>
      Abrir otro encima
    </Button>
  </ModalBody>
</Modal>

<Modal
  open={segundo}
  onClose={() => setSegundo(false)}
  size="confirm"
  title="Segundo"
  footer={
    <ModalFooter>
      <Button variant="primary" onClick={() => setSegundo(false)}>Cerrar este</Button>
    </ModalFooter>
  }
>
  <ModalBody>
    <p className="text-sm">Escape cierra este, no el de abajo.</p>
  </ModalBody>
</Modal>`}
        >
          <Button onClick={() => setPrimero(true)}>Abrir el primero</Button>

          <Modal open={primero} onClose={() => setPrimero(false)} title="Primero">
            <ModalBody>
              <p className="text-sm mb-4">Este es el modal de abajo.</p>
              <Button variant="primary" onClick={() => setSegundo(true)}>
                Abrir otro encima
              </Button>
            </ModalBody>
          </Modal>

          <Modal
            open={segundo}
            onClose={() => setSegundo(false)}
            size="confirm"
            title="Segundo"
            footer={
              <ModalFooter>
                <Button variant="primary" onClick={() => setSegundo(false)}>
                  Cerrar este
                </Button>
              </ModalFooter>
            }
          >
            <ModalBody>
              <p className="text-sm">Escape cierra este, no el de abajo.</p>
            </ModalBody>
          </Modal>
        </Example>

        <Note title="Un defecto corregido">
          <p>
            En dn-ui, cerrar cualquier modal pone <code>body.overflow = 'auto'</code>, asi que
            cerrar el de arriba devolvia el scroll aunque quedara otro abierto. Aqui el bloqueo va
            por contador y solo se libera cuando la pila queda vacia.
          </p>
        </Note>
      </Section>

      <Section title="Tamanos">
        <Example
          code={`{/* 520 px, el valor por defecto */}
<Modal open={abierto} onClose={cerrar} title="Tamano por defecto">
  <ModalBody>
    <p className="text-sm">520 px de ancho maximo.</p>
  </ModalBody>
</Modal>

{/* 416 px, el de los dialogos de confirmacion */}
<Modal size="confirm" open={abierto} onClose={cerrar} title="Estrecho">
  <ModalBody confirm>
    <p className="text-sm">416 px, con el relleno mayor.</p>
  </ModalBody>
</Modal>

{/* Casi todo el ancho de la ventana */}
<Modal size="contain" open={abierto} onClose={cerrar} title="Ancho">
  <ModalBody>
    <p className="text-sm">Para tablas y contenido que necesita sitio.</p>
  </ModalBody>
</Modal>`}
        >
          <Button appearance="ghost" onClick={() => setBasico(true)}>
            Ver el tamano por defecto
          </Button>

          <Modal open={basico} onClose={() => setBasico(false)} title="Tamano por defecto">
            <ModalBody>
              <p className="text-sm">520 px de ancho maximo.</p>
            </ModalBody>
          </Modal>
        </Example>
      </Section>

      <Section title="La API imperativa">
        <Prose>
          <p>
            Para confirmaciones rapidas no hace falta montar nada: <code>modal.confirm()</code> y
            companeros abren el dialogo desde donde sea. Necesitan{' '}
            <code>&lt;ModalHost /&gt;</code> montado una vez.
          </p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-6">
          <CodeBlock code={MONTAJE} />
        </div>

        <Example
          code={`<Button
  variant="error"
  onClick={() =>
    modal.confirm({
      title: 'Borrar registro',
      content: 'Esta accion no se puede deshacer.',
      okClassNames: 'btn-error',
      onOk: () => message.danger('Borrado'),
      onCancel: () => message.info('Cancelado')
    })
  }
>
  confirm
</Button>

<Button onClick={() => modal.info({ title: 'Aviso', content: 'Solo informativo.' })}>
  info
</Button>

<Button
  variant="success"
  onClick={() => modal.success({ title: 'Listo', content: 'Todo salio bien.' })}
>
  success
</Button>

<Button
  variant="warning"
  onClick={() => modal.warning({ title: 'Cuidado', content: 'Revisa antes de seguir.' })}
>
  warning
</Button>

{/* Tambien existe modal.danger, con el icono de error */}`}
        >
          <Button
            variant="error"
            onClick={() =>
              modal.confirm({
                title: 'Borrar registro',
                content: 'Esta accion no se puede deshacer.',
                okClassNames: 'btn-error',
                onOk: () => message.danger('Borrado'),
                onCancel: () => message.info('Cancelado')
              })
            }
          >
            confirm
          </Button>
          <Button onClick={() => modal.info({ title: 'Aviso', content: 'Solo informativo.' })}>
            info
          </Button>
          <Button
            variant="success"
            onClick={() => modal.success({ title: 'Listo', content: 'Todo salio bien.' })}
          >
            success
          </Button>
          <Button
            variant="warning"
            onClick={() => modal.warning({ title: 'Cuidado', content: 'Revisa antes de seguir.' })}
          >
            warning
          </Button>
        </Example>
      </Section>

      <Section title="Con entrada de texto">
        <Example
          description="onOk recibe el valor del campo."
          code={`modal.confirm({
  title: 'Renombrar',
  input: true,
  inputValue: 'informe.pdf',
  onOk: (valor) => renombrar(valor)
})`}
        >
          <Button
            variant="primary"
            onClick={() =>
              modal.confirm({
                title: 'Renombrar archivo',
                input: true,
                inputValue: 'informe.pdf',
                onOk: (valor) => message.success(`Nuevo nombre: ${valor}`)
              })
            }
          >
            Renombrar
          </Button>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Modal />"
          rows={[
            { name: 'open', type: 'boolean', required: true, description: 'Si el dialogo esta abierto.' },
            { name: 'onClose', type: '() => void', required: true, description: 'Se llama con Escape, con el aspa y al pulsar el fondo.' },
            { name: 'title', type: 'ReactNode', description: 'Cabecera. Tambien da el nombre accesible del dialogo.' },
            { name: 'size', type: "'default' | 'confirm' | 'contain'", default: "'default'", description: 'Ancho maximo: 520 px, 416 px o casi toda la ventana.' },
            { name: 'maskClosable', type: 'boolean', default: 'true', description: 'Cerrar al pulsar el fondo.' },
            { name: 'closable', type: 'boolean', default: 'true', description: 'Muestra el aspa de la esquina.' },
            { name: 'closeLabel', type: 'string', default: "'Cerrar'", description: 'Etiqueta accesible del aspa.' },
            { name: 'footer', type: 'ReactNode', description: 'Se pinta despues del contenido. Suele ser un ModalFooter.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al envoltorio.' }
          ]}
        />

        <PropsTable
          of="modal.confirm(options)"
          rows={[
            { name: 'title', type: 'string', default: "''", description: 'Titulo del dialogo.' },
            { name: 'content', type: 'string', default: "''", description: 'Cuerpo.' },
            { name: 'type', type: "'info' | 'success' | 'warning' | 'danger' | 'question'", default: "'question'", description: 'Icono. Los atajos lo fijan por ti.' },
            { name: 'confirm', type: 'boolean', default: 'true', description: 'Muestra el boton de cancelar. Los atajos lo ponen a false.' },
            { name: 'input', type: 'boolean', default: 'false', description: 'Anade un campo de texto. Su valor llega a onOk y onCancel.' },
            { name: 'inputValue', type: 'string', default: "''", description: 'Valor inicial del campo.' },
            { name: 'inputType', type: 'string', default: "'text'", description: 'Tipo del campo.' },
            { name: 'okText / cancelText', type: 'string', default: "'OK' / 'Cancelar'", description: 'Textos de los botones.' },
            { name: 'okClassNames / cancelClassNames', type: 'string', default: "'btn-primary' / ''", description: 'Clases extra de los botones.' },
            { name: 'onOk / onCancel', type: '(value?: string) => void', description: 'Se llaman al pulsar cada boton. Reciben el valor del campo si lo hay.' }
          ]}
        />

        <PropsTable
          of="Piezas"
          rows={[
            { name: 'ModalBody', type: '{ confirm?: boolean }', description: 'Cuerpo con relleno. confirm usa el relleno mayor de los dialogos.' },
            { name: 'ModalHeader', type: 'div.modal-header', description: 'Cabecera suelta, por si no usas la prop title.' },
            { name: 'ModalFooter', type: 'div.modal-confirmBtns', description: 'Fila de botones alineada a la derecha.' },
            { name: 'ModalHost', type: 'componente', description: 'Monta una vez para habilitar modal.confirm y companeros.' }
          ]}
        />
      </Section>
    </Page>
  )
}
