import { Button, Card, CardBody, Empty, Icon } from '@dnui/react'
import { Example } from '../ui/Example'
import { Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const EmptyPage = () => (
  <Page
    title="Empty"
    description="Estado vacio: cuando una lista, una busqueda o una tabla no tiene nada que mostrar."
    importFrom={`import { Empty } from '@dnui/react'`}
  >
    <Section title="Por defecto">
      <Example code={`<Empty />`} stack>
        <div className="w-full">
          <Empty />
        </div>
      </Example>
    </Section>

    <Section title="Con texto propio">
      <Example
        code={`<Empty description="No hay ventas en este periodo" />`}
        stack
      >
        <div className="w-full">
          <Empty description="No hay ventas en este periodo" />
        </div>
      </Example>
    </Section>

    <Section title="Con icono y accion">
      <Prose>
        <p>
          <code>image</code> se pinta antes del texto y <code>children</code> despues, que es donde
          suele ir la accion que saca a la persona del callejon.
        </p>
      </Prose>
      <Example
        code={`<Empty
  image={<span className="text-4xl opacity-40"><Icon name="filter" /></span>}
  description="Ningun registro coincide con el filtro"
>
  <Button size="sm" appearance="outline">Limpiar filtros</Button>
</Empty>`}
        stack
      >
        <div className="w-full">
          <Empty
            image={
              <span className="text-4xl opacity-40">
                <Icon name="filter" />
              </span>
            }
            description="Ningun registro coincide con el filtro"
          >
            <Button size="sm" appearance="outline">
              Limpiar filtros
            </Button>
          </Empty>
        </div>
      </Example>
    </Section>

    <Section title="Dentro de una tarjeta">
      <Example
        code={`<Card>
  <CardBody>
    <Empty description="Aun no tienes informes">
      <Button size="sm" variant="primary">Crear el primero</Button>
    </Empty>
  </CardBody>
</Card>`}
      >
        <Card className="w-80">
          <CardBody>
            <Empty
              image={
                <span className="text-4xl opacity-40">
                  <Icon name="chart" />
                </span>
              }
              description="Aun no tienes informes"
            >
              <Button size="sm" variant="primary">
                Crear el primero
              </Button>
            </Empty>
          </CardBody>
        </Card>
      </Example>
    </Section>

    <Section title="Sin texto">
      <Example
        description="Pasa description={null} si vas a componer todo el contenido a mano."
        code={`<Empty description={null}>
  <p className="text-sm">Contenido totalmente propio</p>
</Empty>`}
        stack
      >
        <div className="w-full">
          <Empty description={null}>
            <p className="text-sm">Contenido totalmente propio</p>
          </Empty>
        </div>
      </Example>
    </Section>

    <Section title="API">
      <PropsTable
        of="<Empty />"
        rows={[
          { name: 'description', type: 'ReactNode', default: "'Sin datos'", description: 'Texto principal. Pasa null para no pintarlo.' },
          { name: 'image', type: 'ReactNode', description: 'Se pinta antes del texto: un icono, una ilustracion.' },
          { name: 'children', type: 'ReactNode', description: 'Se pinta despues del texto. Suele ser la accion.' },
          { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div.' }
        ]}
      />
    </Section>
  </Page>
)
