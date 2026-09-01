import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardCover,
  CardDescription,
  CardHeader,
  CardTitle
} from '@dnui/react'
import { Example } from '../ui/Example'
import { Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const CardPage = () => (
  <Page
    title="Card"
    description="Contenedor con borde y fondo propio. Se compone de piezas sueltas, asi que solo pones las que necesitas."
    importFrom={`import {
  Card, CardCover, CardHeader, CardTitle, CardDescription, CardBody
} from '@dnui/react'`}
  >
    <Section title="Basico">
      <Example
        code={`<Card>
  <CardBody>Contenido de la tarjeta.</CardBody>
</Card>`}
      >
        <Card className="w-72">
          <CardBody>Contenido de la tarjeta.</CardBody>
        </Card>
      </Example>
    </Section>

    <Section title="Con cabecera">
      <Prose>
        <p>
          <code>CardHeader</code> lleva una linea de separacion abajo. <code>CardTitle</code> pinta
          un <code>h3</code> y <code>CardDescription</code> un <code>p</code>, ambos sin margen.
        </p>
      </Prose>
      <Example
        code={`<Card>
  <CardHeader>
    <CardTitle>Informe mensual</CardTitle>
    <CardDescription>Actualizado hace 2 horas</CardDescription>
  </CardHeader>
  <CardBody>
    Ventas del periodo, agrupadas por linea de producto.
  </CardBody>
</Card>`}
      >
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Informe mensual</CardTitle>
            <CardDescription>Actualizado hace 2 horas</CardDescription>
          </CardHeader>
          <CardBody>Ventas del periodo, agrupadas por linea de producto.</CardBody>
        </Card>
      </Example>
    </Section>

    <Section title="Con portada">
      <Prose>
        <p>
          <code>CardCover</code> es un hueco sin estilo propio: sirve para colocar una imagen o un
          grafico pegado al borde superior.
        </p>
      </Prose>
      <Example
        code={`<Card>
  <CardCover>
    <img src="/portada.jpg" alt="" className="w-full h-32 object-cover" />
  </CardCover>
  <CardBody>
    <CardTitle>Con portada</CardTitle>
  </CardBody>
</Card>`}
      >
        <Card className="w-72 overflow-hidden">
          <CardCover>
            <img
              src="https://placehold.co/600x200/1a6baf/FFF?text=Portada"
              alt=""
              className="w-full h-28 object-cover block"
            />
          </CardCover>
          <CardBody>
            <CardTitle>Con portada</CardTitle>
            <CardDescription>La imagen va pegada al borde.</CardDescription>
          </CardBody>
        </Card>
      </Example>
    </Section>

    <Section title="Interactiva">
      <Example
        description="hoverable eleva la tarjeta al pasar el raton."
        code={`<Card hoverable>
  <CardBody>
    <CardTitle>Pasa el raton</CardTitle>
    <CardDescription>Se eleva con una sombra.</CardDescription>
  </CardBody>
</Card>`}
      >
        <Card hoverable className="w-72">
          <CardBody>
            <CardTitle>Pasa el raton</CardTitle>
            <CardDescription>Se eleva con una sombra.</CardDescription>
          </CardBody>
        </Card>
      </Example>
    </Section>

    <Section title="Composicion completa">
      <Example
        code={`<Card hoverable>
  <CardHeader>
    <div className="flex items-center gap-3">
      <Avatar fallback="AR" className="rounded-full" />
      <div>
        <CardTitle>Ana Ruiz</CardTitle>
        <CardDescription>Administradora</CardDescription>
      </div>
      <Badge variant="success" appearance="soft" className="ml-auto">activa</Badge>
    </div>
  </CardHeader>
  <CardBody>
    <p className="text-sm">Ultimo acceso hace 5 minutos.</p>
    <div className="flex gap-2 mt-4">
      <Button size="sm" variant="primary">Ver perfil</Button>
      <Button size="sm" appearance="ghost">Mensaje</Button>
    </div>
  </CardBody>
</Card>`}
      >
        <Card hoverable className="w-96">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar fallback="AR" className="rounded-full" />
              <div>
                <CardTitle>Ana Ruiz</CardTitle>
                <CardDescription>Administradora</CardDescription>
              </div>
              <Badge variant="success" appearance="soft" className="ml-auto">
                activa
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm">Ultimo acceso hace 5 minutos.</p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="primary">
                Ver perfil
              </Button>
              <Button size="sm" appearance="ghost">
                Mensaje
              </Button>
            </div>
          </CardBody>
        </Card>
      </Example>
    </Section>

    <Section title="En rejilla">
      <Example
        code={`<div className="grid gap-4 sm:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id} hoverable>
      <CardBody>
        <CardTitle>{item.titulo}</CardTitle>
      </CardBody>
    </Card>
  ))}
</div>`}
        stack
      >
        <div className="grid gap-4 sm:grid-cols-3 w-full">
          {['Ventas', 'Compras', 'Inventario'].map((titulo) => (
            <Card key={titulo} hoverable>
              <CardBody>
                <CardTitle>{titulo}</CardTitle>
                <CardDescription>Modulo activo</CardDescription>
              </CardBody>
            </Card>
          ))}
        </div>
      </Example>
    </Section>

    <Section title="API">
      <PropsTable
        of="<Card />"
        rows={[
          { name: 'hoverable', type: 'boolean', default: 'false', description: 'Eleva la tarjeta al pasar el raton.' },
          { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div.' }
        ]}
      />

      <PropsTable
        of="Piezas"
        rows={[
          { name: 'CardCover', type: 'div.card-cover', description: 'Hueco para una imagen pegada al borde superior.' },
          { name: 'CardHeader', type: 'div.card-header', description: 'Cabecera con linea de separacion.' },
          { name: 'CardTitle', type: 'h3.card-title', description: 'Titulo sin margen.' },
          { name: 'CardDescription', type: 'p.card-description', description: 'Texto secundario sin margen.' },
          { name: 'CardBody', type: 'div.card-body', description: 'Cuerpo con relleno.' }
        ]}
      />
    </Section>
  </Page>
)
