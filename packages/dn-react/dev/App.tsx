import { useState, type ReactNode } from 'react'
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  CodeViewer,
  Collapse,
  ControlGroup,
  Divider,
  Empty,
  FormItem,
  Freeze,
  Icon,
  Input,
  Join,
  List,
  ListItem,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  MessageHost,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHost,
  Navigation,
  Pagination,
  PasswordInput,
  Radio,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  ThemeToggle,
  ToggleGroup,
  Tooltip,
  Upload,
  message,
  modal
} from '../src'

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section style={{ marginBottom: '2.5rem' }}>
    <h2 style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.75rem' }}>{title}</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
      {children}
    </div>
  </section>
)

const VARIANTS = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'] as const

export const App = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [page, setPage] = useState(3)
  const [limit, setLimit] = useState(20)
  const [align, setAlign] = useState('izquierda')
  const [avatar, setAvatar] = useState<string>()

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <MessageHost />
      <ModalHost />

      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 500 }}>@dnui/react</h1>
        <ThemeToggle appearance="outline">
          {(resolved) => <>Tema: {resolved}</>}
        </ThemeToggle>
      </header>

      <Section title="Button">
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
        <Button appearance="outline">outline</Button>
        <Button appearance="soft" variant="primary">
          soft
        </Button>
        <Button appearance="ghost">ghost</Button>
        <Button size="xs">xs</Button>
        <Button size="lg">lg</Button>
        <Button disabled>disabled</Button>
        <Button shape="square">
          <Icon name="plus" />
        </Button>
      </Section>

      <Section title="Badge">
        {VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
        <Badge appearance="outline">outline</Badge>
        <Badge appearance="soft" variant="success">
          soft
        </Badge>
      </Section>

      <Section title="Alert">
        <div style={{ display: 'grid', gap: '0.5rem', width: '100%' }}>
          <Alert variant="info">Un aviso informativo</Alert>
          <Alert variant="success" appearance="soft">
            Guardado correctamente
          </Alert>
          <Alert variant="warning" appearance="outline" closable>
            Revisa los datos antes de continuar
          </Alert>
          <Alert variant="error" closable>
            No se pudo guardar
          </Alert>
        </div>
      </Section>

      <Section title="Card, Avatar, Divider, Empty">
        <Card hoverable style={{ width: 280 }}>
          <CardHeader>
            <CardTitle>Tarjeta</CardTitle>
            <CardDescription>Con cabecera y cuerpo</CardDescription>
          </CardHeader>
          <CardBody>
            <Divider>o bien</Divider>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Avatar fallback="AR" />
              <Avatar src="https://placehold.co/64" alt="Ejemplo" />
            </div>
          </CardBody>
        </Card>

        <Card style={{ width: 280 }}>
          <CardBody>
            <Empty description="No hay resultados">
              <Button size="sm" variant="primary">
                Crear el primero
              </Button>
            </Empty>
          </CardBody>
        </Card>
      </Section>

      <Section title="Formulario">
        <div style={{ display: 'grid', gap: '0.25rem', width: 320 }}>
          <FormItem label="Correo" required htmlFor="correo" help="Te enviaremos la confirmacion">
            <Input id="correo" type="email" placeholder="ana@ejemplo.com" />
          </FormItem>

          <FormItem label="Con prefijo" htmlFor="busca">
            <Input id="busca" prefix={<Icon name="filter" />} placeholder="Buscar" />
          </FormItem>

          <FormItem label="Contrasena" htmlFor="clave">
            <PasswordInput id="clave" />
          </FormItem>

          <FormItem label="Con error" status="danger" htmlFor="malo" help="Este campo falla">
            <Input id="malo" defaultValue="valor invalido" />
          </FormItem>

          <FormItem label="Pais" htmlFor="pais">
            <Select id="pais" defaultValue="pe">
              <option value="pe">Peru</option>
              <option value="es">Espana</option>
            </Select>
          </FormItem>

          <FormItem label="Notas" htmlFor="notas">
            <Textarea id="notas" rows={3} />
          </FormItem>

          <ControlGroup append={<Button variant="primary">Ir</Button>}>
            <Input aria-label="Codigo" placeholder="Codigo" />
          </ControlGroup>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Checkbox defaultChecked /> Casilla
          </label>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Switch defaultChecked /> Interruptor
          </label>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Radio name="demo" defaultChecked /> Opcion A
          </label>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Radio name="demo" /> Opcion B
          </label>

          <ToggleGroup
            label="Alineacion"
            value={align}
            onChange={setAlign}
            buttonProps={{ appearance: 'outline', size: 'sm' }}
            options={[
              { value: 'izquierda', label: 'Izquierda' },
              { value: 'centro', label: 'Centro' },
              { value: 'derecha', label: 'Derecha' }
            ]}
          />

          <Upload value={avatar} circle onFileChange={(file) => setAvatar(file ? URL.createObjectURL(file) : undefined)} />
        </div>
      </Section>

      <Section title="Menu, Modal, Message, Tooltip">
        <Menu>
          <MenuTrigger>
            <Button>Acciones</Button>
          </MenuTrigger>
          <MenuContent label="Acciones">
            <MenuItem onSelect={() => message.info('Editando')}>Editar</MenuItem>
            <MenuItem onSelect={() => message.success('Duplicado')}>Duplicar</MenuItem>
            <MenuItem disabled>Borrar</MenuItem>
          </MenuContent>
        </Menu>

        <Menu autoClose={false}>
          <MenuTrigger>
            <Button appearance="outline">Panel (autoClose false)</Button>
          </MenuTrigger>
          <MenuContent panel>
            <div style={{ display: 'grid', gap: '0.5rem', minWidth: 200 }}>
              <Input aria-label="Filtrar" placeholder="Filtrar" size="sm" />
              <label style={{ display: 'flex', gap: '0.5rem' }}>
                <Checkbox /> Solo activos
              </label>
            </div>
          </MenuContent>
        </Menu>

        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Abrir modal
        </Button>

        <Button
          onClick={() =>
            modal.confirm({
              title: 'Borrar registro',
              content: 'Esta accion no se puede deshacer.',
              onOk: () => message.danger('Borrado')
            })
          }
        >
          modal.confirm
        </Button>

        <Button
          onClick={() =>
            modal.confirm({
              title: 'Renombrar',
              input: true,
              inputValue: 'informe.pdf',
              onOk: (value) => message.success(`Nuevo nombre: ${value}`)
            })
          }
        >
          confirm con input
        </Button>

        <Button onClick={() => message.warning('Revisa los datos')}>message.warning</Button>
        <Button onClick={() => message.info('Cargando', Infinity)}>message persistente</Button>
        <Button onClick={() => message.closeAll()}>closeAll</Button>

        <Tooltip content="Guarda los cambios sin salir">
          <Button appearance="outline">Con tooltip</Button>
        </Tooltip>
      </Section>

      <Section title="Tabs y Collapse">
        <div style={{ width: '100%' }}>
          <Tabs>
            <TabList label="Secciones">
              <Tab>General</Tab>
              <Tab>Avanzado</Tab>
              <Tab disabled>Deshabilitado</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>Contenido de la pestana general.</TabPanel>
              <TabPanel>Contenido de la pestana avanzada.</TabPanel>
              <TabPanel>Nunca visible.</TabPanel>
            </TabPanels>
          </Tabs>

          <div style={{ marginTop: '1rem' }}>
            <Collapse trigger={<Button appearance="ghost">Ver detalles</Button>}>
              <Card>
                <CardBody>Contenido plegable.</CardBody>
              </Card>
            </Collapse>
          </div>
        </div>
      </Section>

      <Section title="List, Join, CodeViewer">
        <List menu style={{ minWidth: 200 }}>
          <ListItem>Inicio</ListItem>
          <ListItem active>Componentes</ListItem>
          <ListItem disabled>Ajustes</ListItem>
        </List>

        <Join>
          <Button appearance="outline">Uno</Button>
          <Button appearance="outline">Dos</Button>
          <Button appearance="outline">Tres</Button>
        </Join>

        <Join>
          <Input placeholder="Buscar" aria-label="Buscar" />
          <Button variant="primary">Ir</Button>
        </Join>

        <CodeViewer code={"const total = items.reduce((a, b) => a + b, 0)"} language="ts" />
      </Section>

      <Section title="Navigation">
        <Navigation
          label="Principal"
          style={{ minWidth: 240 }}
          items={[
            { label: 'Inicio', href: '#inicio' },
            {
              label: 'Componentes',
              children: [
                { label: 'Boton', href: '#boton' },
                { label: 'Datos', children: [{ label: 'Tabla', href: '#tabla' }] }
              ]
            },
            { label: 'Ajustes', href: '#ajustes' }
          ]}
        />
      </Section>

      <Section title="Table (presentacional)">
        <div style={{ width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell sort="asc">Nombre</TableHeaderCell>
                <TableHeaderCell>Correo</TableHeaderCell>
                <TableHeaderCell>Rol</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Ana Ruiz</TableCell>
                <TableCell>ana@ejemplo.com</TableCell>
                <TableCell>Admin</TableCell>
              </TableRow>
              <TableRow deleted>
                <TableCell>Luis Paz</TableCell>
                <TableCell>luis@ejemplo.com</TableCell>
                <TableCell>Editor</TableCell>
              </TableRow>
              <TableRow disabled>
                <TableCell>Sara Vera</TableCell>
                <TableCell>sara@ejemplo.com</TableCell>
                <TableCell>Lector</TableCell>
              </TableRow>
            </TableBody>
            <TableFoot>
              <TableRow>
                <TableCell colSpan={3}>3 registros</TableCell>
              </TableRow>
            </TableFoot>
          </Table>
        </div>
      </Section>

      <Section title="Pagination">
        <div style={{ width: '100%' }}>
          <Pagination
            result={{ current: page, pages: Math.ceil(93 / limit), limit, total: 93 }}
            onChange={(nextPage, nextLimit) => {
              setPage(nextPage)
              setLimit(nextLimit)
            }}
          />
        </div>
      </Section>

      <Section title="Freeze">
        <div style={{ width: '100%' }}>
          <Button onClick={() => setFrozen((prev) => !prev)}>
            {frozen ? 'Descongelar' : 'Congelar'}
          </Button>
          <Freeze active={frozen} text="Cargando datos">
            <Card style={{ marginTop: '0.75rem' }}>
              <CardBody>Este bloque se bloquea mientras se carga.</CardBody>
            </Card>
          </Freeze>
        </div>
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Editar registro"
        footer={
          <ModalFooter>
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Guardar
            </Button>
          </ModalFooter>
        }
      >
        <ModalBody>
          <FormItem label="Nombre" htmlFor="nombre">
            <Input id="nombre" defaultValue="Informe mensual" />
          </FormItem>
        </ModalBody>
      </Modal>
    </div>
  )
}
