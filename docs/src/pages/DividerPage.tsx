import { Button, Card, CardBody, Divider } from '@dnui/react'
import { Example } from '../ui/Example'
import { Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const DividerPage = () => (
  <Page
    title="Divider"
    description="Separador horizontal, con texto opcional en medio. Se anuncia como separator."
    importFrom={`import { Divider } from '@dnui/react'`}
  >
    <Section title="Sin texto">
      <Example code={`<Divider />`} stack>
        <div className="w-full">
          <p className="text-sm">Bloque de arriba</p>
          <Divider />
          <p className="text-sm">Bloque de abajo</p>
        </div>
      </Example>
    </Section>

    <Section title="Con texto">
      <Prose>
        <p>
          El texto va dentro de <code>.divider-innerText</code> y las lineas se dibujan con los
          pseudoelementos, asi que se reparten el espacio que sobra.
        </p>
      </Prose>
      <Example
        code={`<Divider>o bien</Divider>`}
        stack
      >
        <div className="w-full">
          <Divider>o bien</Divider>
        </div>
      </Example>
    </Section>

    <Section title="Alineacion">
      <Example
        description="Con left o right la linea de ese lado se reduce al 5%."
        code={`<Divider align="left">izquierda</Divider>
<Divider>centro</Divider>
<Divider align="right">derecha</Divider>`}
        stack
      >
        <div className="w-full">
          <Divider align="left">izquierda</Divider>
          <Divider>centro</Divider>
          <Divider align="right">derecha</Divider>
        </div>
      </Example>
    </Section>

    <Section title="En contexto">
      <Example
        code={`<Card>
  <CardBody>
    <Button block variant="primary">Entrar con correo</Button>
    <Divider>o</Divider>
    <Button block appearance="outline">Entrar con Google</Button>
  </CardBody>
</Card>`}
      >
        <Card className="w-80">
          <CardBody>
            <Button block variant="primary">
              Entrar con correo
            </Button>
            <Divider>o</Divider>
            <Button block appearance="outline">
              Entrar con Google
            </Button>
          </CardBody>
        </Card>
      </Example>
    </Section>

    <Section title="API">
      <PropsTable
        of="<Divider />"
        rows={[
          { name: 'align', type: "'left' | 'center' | 'right'", default: "'center'", description: 'Posicion del texto. Con center no se anade ninguna clase extra.' },
          { name: 'children', type: 'ReactNode', description: 'Texto del centro. Si no hay, se pinta solo la linea.' },
          { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div, que ya lleva role="separator".' }
        ]}
      />
    </Section>
  </Page>
)
