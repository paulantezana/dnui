import { useState } from 'react'
import { Button, Card, CardBody, Collapse, Icon } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const PREGUNTAS = [
  { titulo: 'Necesito Tailwind en mi aplicacion', texto: 'No. Importa el CSS ya compilado y listo.' },
  { titulo: 'Puedo cambiar los colores', texto: 'Si: redefine los tokens despues de importar la fuente del CSS.' },
  { titulo: 'Funciona sin React', texto: 'El motor si. Se publica como @dnui/react/core.' }
]

export const CollapsePage = () => {
  const [abierta, setAbierta] = useState<number | null>(0)

  return (
    <Page
      title="Collapse"
      description="Contenido que se pliega. El disparador recibe aria-expanded y aria-controls, que en dn-ui no existian."
      importFrom={`import { Collapse } from '@dnui/react'`}
    >
      <Section title="Basico">
        <Prose>
          <p>
            <code>Collapse</code> clona el elemento que le pases como <code>trigger</code> y le
            engancha el toggle y los atributos ARIA.
          </p>
        </Prose>
        <Example
          code={`<Collapse trigger={<Button appearance="ghost">Ver detalles</Button>}>
  <Card>
    <CardBody>Contenido plegable.</CardBody>
  </Card>
</Collapse>`}
          stack
        >
          <div className="w-full max-w-md">
            <Collapse trigger={<Button appearance="ghost">Ver detalles</Button>}>
              <Card className="mt-2">
                <CardBody>Contenido plegable.</CardBody>
              </Card>
            </Collapse>
          </div>
        </Example>
      </Section>

      <Section title="Abierto de partida">
        <Example
          code={`<Collapse defaultOpen trigger={<Button appearance="outline">Alternar</Button>}>
  <Card className="mt-2">
    <CardBody>Este arranca abierto.</CardBody>
  </Card>
</Collapse>`}
          stack
        >
          <div className="w-full max-w-md">
            <Collapse defaultOpen trigger={<Button appearance="outline">Alternar</Button>}>
              <Card className="mt-2">
                <CardBody>Este arranca abierto.</CardBody>
              </Card>
            </Collapse>
          </div>
        </Example>
      </Section>

      <Section title="Controlado">
        <Prose>
          <p>
            Con <code>open</code> manda quien lo usa. Es lo que hace falta para un acordeon, donde
            abrir uno cierra los demas.
          </p>
        </Prose>
        <Example
          code={`const [abierta, setAbierta] = useState<number | null>(0)

{preguntas.map((pregunta, i) => (
  <Collapse
    key={pregunta.titulo}
    open={abierta === i}
    onOpenChange={(open) => setAbierta(open ? i : null)}
    trigger={<Button appearance="ghost" block>{pregunta.titulo}</Button>}
  >
    <p>{pregunta.texto}</p>
  </Collapse>
))}`}
          stack
        >
          <div className="w-full max-w-md border border-base-300 rounded-box divide-y divide-base-300">
            {PREGUNTAS.map((pregunta, i) => (
              <div key={pregunta.titulo} className="p-1">
                <Collapse
                  open={abierta === i}
                  onOpenChange={(open) => setAbierta(open ? i : null)}
                  trigger={
                    <Button appearance="ghost" block className="justify-between">
                      {pregunta.titulo}
                      <Icon name={abierta === i ? 'small-up' : 'small-down'} />
                    </Button>
                  }
                >
                  <p className="text-sm px-4 pb-3 text-base-content/70">{pregunta.texto}</p>
                </Collapse>
              </div>
            ))}
          </div>
        </Example>
      </Section>

      <Section title="Cualquier disparador">
        <Example
          description="El trigger no tiene que ser un Button; cualquier elemento que acepte onClick sirve."
          code={`<Collapse
  trigger={
    <button type="button" className="text-sm text-primary underline">
      Mostrar mas
    </button>
  }
>
  <p className="text-sm mt-2 text-base-content/70">
    Texto adicional que casi nadie necesita leer.
  </p>
</Collapse>`}
          stack
        >
          <div className="w-full max-w-md">
            <Collapse
              trigger={
                <button type="button" className="text-sm text-primary underline">
                  Mostrar mas
                </button>
              }
            >
              <p className="text-sm mt-2 text-base-content/70">
                Texto adicional que casi nadie necesita leer.
              </p>
            </Collapse>
          </div>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Collapse />"
          rows={[
            { name: 'trigger', type: 'ReactNode', required: true, description: 'Elemento que abre y cierra. Si es un elemento React se clona y recibe onClick, aria-expanded y aria-controls.' },
            { name: 'open', type: 'boolean', description: 'Estado abierto. Si se pasa, el componente queda controlado.' },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Estado inicial cuando no esta controlado.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Se llama con el nuevo estado.' },
            { name: 'children', type: 'ReactNode', required: true, description: 'Contenido plegable.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al panel.' }
          ]}
        />

        <Note title="Sin animacion">
          <p>
            <code>collapse.css</code> alterna entre <code>display: none</code> y{' '}
            <code>display: block</code>, asi que no hay transicion de altura. Es lo que hace dn-ui.
            Para animarlo hace falta CSS adicional.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
