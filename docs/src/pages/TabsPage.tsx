import { useState } from 'react'
import { Badge, Button, Card, CardBody, Tab, TabList, TabPanel, TabPanels, Tabs } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const TabsPage = () => {
  const [indice, setIndice] = useState(0)

  return (
    <Page
      title="Tabs"
      description="Pestanas con los roles y el teclado de WAI-ARIA. La primera queda activa por defecto, igual que en dn-ui."
      importFrom={`import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@dnui/react'`}
    >
      <Section title="Basico">
        <Prose>
          <p>
            El indice de cada pestana sale de su posicion entre los hijos, asi que{' '}
            <code>TabList</code> y <code>TabPanels</code> tienen que llevar el mismo orden.
          </p>
        </Prose>
        <Example
          code={`<Tabs>
  <TabList label="Secciones">
    <Tab>General</Tab>
    <Tab>Avanzado</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Contenido general</TabPanel>
    <TabPanel>Contenido avanzado</TabPanel>
  </TabPanels>
</Tabs>`}
          stack
        >
          <div className="w-full">
            <Tabs>
              <TabList label="Secciones">
                <Tab>General</Tab>
                <Tab>Avanzado</Tab>
                <Tab>Permisos</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p className="text-sm">Ajustes basicos de la cuenta.</p>
                </TabPanel>
                <TabPanel>
                  <p className="text-sm">Opciones para quien sabe lo que hace.</p>
                </TabPanel>
                <TabPanel>
                  <p className="text-sm">Quien puede ver y editar que.</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </Example>
      </Section>

      <Section title="Teclado">
        <Prose>
          <ul>
            <li>
              <strong>Flechas</strong> izquierda y derecha cambian de pestana, dando la vuelta en los
              extremos.
            </li>
            <li>
              <strong>Tab</strong> entra en el panel: solo la pestana activa es tabulable, que es lo
              que manda WAI-ARIA.
            </li>
            <li>Las deshabilitadas se saltan.</li>
          </ul>
        </Prose>
      </Section>

      <Section title="Pestana inicial y deshabilitadas">
        <Example
          code={`<Tabs defaultIndex={1}>
  <TabList label="Con deshabilitada">
    <Tab>Uno</Tab>
    <Tab>Dos</Tab>
    <Tab disabled>Tres (deshabilitada)</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Panel uno</TabPanel>
    <TabPanel>Panel dos, activo de partida</TabPanel>
    <TabPanel>Nunca visible</TabPanel>
  </TabPanels>
</Tabs>`}
          stack
        >
          <div className="w-full">
            <Tabs defaultIndex={1}>
              <TabList label="Con deshabilitada">
                <Tab>Uno</Tab>
                <Tab>Dos</Tab>
                <Tab disabled>Tres (deshabilitada)</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p className="text-sm">Panel uno</p>
                </TabPanel>
                <TabPanel>
                  <p className="text-sm">Panel dos, activo de partida</p>
                </TabPanel>
                <TabPanel>
                  <p className="text-sm">Nunca visible</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </Example>
      </Section>

      <Section title="Controlado">
        <Example
          description="Con index el componente deja de guardar estado y manda quien lo usa."
          code={`const [indice, setIndice] = useState(0)

<Tabs index={indice} onChange={setIndice}>
  <TabList label="Controlado">
    <Tab>Resumen</Tab>
    <Tab>Detalle</Tab>
    <Tab>Historial</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Resumen del periodo.</TabPanel>
    <TabPanel>Linea a linea.</TabPanel>
    <TabPanel>Cambios registrados.</TabPanel>
  </TabPanels>
</Tabs>

{/* Cambiar de pestana desde fuera del componente */}
<div className="flex gap-2 mt-3">
  {['Resumen', 'Detalle', 'Historial'].map((etiqueta, i) => (
    <Button key={etiqueta} size="sm" appearance="ghost" onClick={() => setIndice(i)}>
      Ir a {etiqueta}
    </Button>
  ))}
  <Badge appearance="soft" className="ml-auto">indice: {indice}</Badge>
</div>`}
          stack
        >
          <div className="w-full">
            <Tabs index={indice} onChange={setIndice}>
              <TabList label="Controlado">
                <Tab>Resumen</Tab>
                <Tab>Detalle</Tab>
                <Tab>Historial</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p className="text-sm">Resumen del periodo.</p>
                </TabPanel>
                <TabPanel>
                  <p className="text-sm">Linea a linea.</p>
                </TabPanel>
                <TabPanel>
                  <p className="text-sm">Cambios registrados.</p>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <div className="flex gap-2 mt-3">
              {['Resumen', 'Detalle', 'Historial'].map((etiqueta, i) => (
                <Button key={etiqueta} size="sm" appearance="ghost" onClick={() => setIndice(i)}>
                  Ir a {etiqueta}
                </Button>
              ))}
              <Badge appearance="soft" className="ml-auto">
                indice: {indice}
              </Badge>
            </div>
          </div>
        </Example>
      </Section>

      <Section title="Con contenido en la pestana">
        <Example
          code={`<Tabs>
  <TabList label="Bandeja">
    <Tab>
      Todos <Badge size="xs" appearance="soft" className="ml-1">12</Badge>
    </Tab>
    <Tab>
      Pendientes <Badge size="xs" variant="warning" appearance="soft" className="ml-1">3</Badge>
    </Tab>
  </TabList>

  <TabPanels>
    <TabPanel>
      <Card><CardBody>12 elementos en total.</CardBody></Card>
    </TabPanel>
    <TabPanel>
      <Card><CardBody>3 esperando revision.</CardBody></Card>
    </TabPanel>
  </TabPanels>
</Tabs>`}
          stack
        >
          <div className="w-full">
            <Tabs>
              <TabList label="Bandeja">
                <Tab>
                  Todos{' '}
                  <Badge size="xs" appearance="soft" className="ml-1">
                    12
                  </Badge>
                </Tab>
                <Tab>
                  Pendientes{' '}
                  <Badge size="xs" variant="warning" appearance="soft" className="ml-1">
                    3
                  </Badge>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Card>
                    <CardBody>12 elementos en total.</CardBody>
                  </Card>
                </TabPanel>
                <TabPanel>
                  <Card>
                    <CardBody>3 esperando revision.</CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Tabs />"
          rows={[
            { name: 'index', type: 'number', description: 'Pestana activa. Si se pasa, el componente queda controlado.' },
            { name: 'defaultIndex', type: 'number', default: '0', description: 'Pestana inicial cuando no esta controlado.' },
            { name: 'onChange', type: '(index: number) => void', description: 'Se llama con el indice de la nueva pestana.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div contenedor.' }
          ]}
        />

        <PropsTable
          of="Piezas"
          rows={[
            { name: 'TabList', type: '{ label?: string }', description: 'role="tablist". label le da nombre accesible. Aqui vive el manejo de flechas.' },
            { name: 'Tab', type: '{ disabled?: boolean }', description: 'role="tab". Solo la activa es tabulable.' },
            { name: 'TabPanels', type: 'div', description: 'Contenedor de los paneles. Da el indice a cada hijo.' },
            { name: 'TabPanel', type: 'div', description: 'role="tabpanel", enlazado con su pestana. Los inactivos llevan hidden.' }
          ]}
        />

        <Note title="Los paneles no se desmontan">
          <p>
            Un panel inactivo se oculta con <code>hidden</code>, no se quita del arbol. Su estado se
            conserva al cambiar de pestana, y tambien su coste: si el contenido es pesado, montalo
            tu solo cuando toque.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
