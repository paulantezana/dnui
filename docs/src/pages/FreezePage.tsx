import { useState } from 'react'
import { Button, Card, CardBody, Freeze, FreezeOverlay, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@dnui/react'
import { CodeBlock } from '../ui/CodeBlock'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const CON_PETICION = `const [cargando, setCargando] = useState(false)

const recargar = async () => {
  setCargando(true)
  try {
    setDatos(await buscarVentas())
  } finally {
    setCargando(false)
  }
}

<Freeze active={cargando} text="Actualizando">
  <Table>
    <TableHead>
      <TableRow>
        <TableHeaderCell className="text-left">Cliente</TableHeaderCell>
        <TableHeaderCell className="text-left">Estado</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {datos.map((venta) => (
        <TableRow key={venta.id}>
          <TableCell>{venta.cliente}</TableCell>
          <TableCell>{venta.estado}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Freeze>`

export const FreezePage = () => {
  const [bloqueado, setBloqueado] = useState(false)
  const [pantalla, setPantalla] = useState(false)

  const simular = () => {
    setBloqueado(true)
    setTimeout(() => setBloqueado(false), 1800)
  }

  const simularPantalla = () => {
    setPantalla(true)
    setTimeout(() => setPantalla(false), 1500)
  }

  return (
    <Page
      title="Freeze"
      description="Capa que bloquea la interaccion mientras algo carga, con un giro y un texto."
      importFrom={`import { Freeze, FreezeOverlay } from '@dnui/react'`}
    >
      <Section title="Sobre un bloque">
        <Prose>
          <p>
            <code>Freeze</code> envuelve su contenido y pinta la capa encima. El envoltorio ya lleva{' '}
            <code>position: relative</code>, asi que la capa cubre justo ese bloque.
          </p>
        </Prose>
        <Example
          code={`const [cargando, setCargando] = useState(false)

<Freeze active={cargando} text="Cargando ventas">
  <Card>
    <CardBody>Contenido que se bloquea.</CardBody>
  </Card>
</Freeze>`}
          stack
        >
          <Button onClick={simular} disabled={bloqueado}>
            {bloqueado ? 'Cargando…' : 'Simular una carga'}
          </Button>

          <Freeze active={bloqueado} text="Cargando ventas" className="w-full">
            <Card>
              <CardBody>
                <p className="text-sm mb-3">
                  Mientras esta bloqueado no se puede pulsar nada de aqui dentro.
                </p>
                <Button size="sm" appearance="outline">
                  Intenta pulsarme
                </Button>
              </CardBody>
            </Card>
          </Freeze>
        </Example>
      </Section>

      <Section title="Sobre una tabla">
        <Example
          description="El uso mas frecuente: bloquear la tabla mientras llega la pagina nueva."
          code={CON_PETICION}
          stack
        >
          <Freeze active={bloqueado} text="Actualizando" className="w-full">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="text-left">Cliente</TableHeaderCell>
                  <TableHeaderCell className="text-left">Estado</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Ana Ruiz</TableCell>
                  <TableCell>Emitido</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Luis Paz</TableCell>
                  <TableCell>Pendiente</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Freeze>
        </Example>
      </Section>

      <Section title="A pantalla completa">
        <Prose>
          <p>
            <code>FreezeOverlay</code> es la capa suelta. Por defecto es <code>fixed</code>, asi que
            cubre toda la ventana.
          </p>
        </Prose>
        <Example
          code={`{cargando && <FreezeOverlay text="Guardando" />}`}
          stack
        >
          <Button onClick={simularPantalla} disabled={pantalla}>
            Bloquear toda la pantalla 1,5 s
          </Button>
          {pantalla && <FreezeOverlay text="Guardando" />}
        </Example>
      </Section>

      <Section title="Texto propio">
        <Prose>
          <p>
            El texto se pinta con <code>content: attr(data-text)</code>, y ademas se usa como
            etiqueta accesible de una region <code>role="status"</code>.
          </p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-4">
          <CodeBlock
            code={`<Freeze active text="Recalculando totales">
  <Card>
    <CardBody>El contenido queda bloqueado.</CardBody>
  </Card>
</Freeze>`}
          />
        </div>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Freeze />"
          rows={[
            { name: 'active', type: 'boolean', required: true, description: 'Si la capa esta puesta.' },
            { name: 'text', type: 'string', default: "'loading'", description: 'Texto bajo el giro. Tambien es la etiqueta accesible.' },
            { name: 'children', type: 'ReactNode', description: 'Contenido que se bloquea.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al envoltorio, que ya lleva position relative.' }
          ]}
        />

        <PropsTable
          of="<FreezeOverlay />"
          rows={[
            { name: 'text', type: 'string', default: "'loading'", description: 'Texto bajo el giro.' },
            { name: 'position', type: "'absolute' | 'fixed'", default: "'fixed'", description: 'fixed cubre la ventana; absolute cubre el contenedor posicionado mas cercano.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div.' }
          ]}
        />

        <Note title="Un defecto corregido">
          <p>
            dn-ui reutiliza un unico nodo <code>.freeze-wrapper</code> global y lo mueve de sitio,
            asi que dos cargas a la vez se pisan: la primera en terminar descongela a la otra. Aqui
            la capa es por instancia.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
