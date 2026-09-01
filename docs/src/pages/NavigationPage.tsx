import { Icon, Navigation, NavigationToggle, useNavigationDrawer, type NavigationItem } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const BASE = 'https://ejemplo.dev'

const ITEMS: NavigationItem[] = [
  { label: 'Inicio', href: `${BASE}/`, icon: <Icon name="chart" /> },
  {
    label: 'Catalogo',
    icon: <Icon name="columns" />,
    children: [
      { label: 'Productos', href: `${BASE}/productos` },
      { label: 'Categorias', href: `${BASE}/categorias` },
      {
        label: 'Inventario',
        children: [
          { label: 'Existencias', href: `${BASE}/existencias` },
          { label: 'Movimientos', href: `${BASE}/movimientos` }
        ]
      }
    ]
  },
  { label: 'Ajustes', href: `${BASE}/ajustes`, icon: <Icon name="settings" /> }
]

export const NavigationPage = () => {
  const drawer = useNavigationDrawer({ targetId: 'ejemplo-layout' })

  return (
    <Page
      title="Navigation"
      description="Menu lateral con submenus plegables. Marca el enlace activo comparando la url y abre por si solo los grupos que lo contienen."
      importFrom={`import { Navigation, NavigationToggle, useNavigationDrawer } from '@dnui/react'`}
    >
      <Section title="Basico">
        <Prose>
          <p>
            Se define con datos, no con markup. Cada elemento puede tener <code>href</code>,{' '}
            <code>icon</code> e hijos anidados sin limite de profundidad.
          </p>
        </Prose>
        <Example
          code={`const items = [
  { label: 'Inicio', href: '/', icon: <Icon name="chart" /> },
  {
    label: 'Catalogo',
    children: [
      { label: 'Productos', href: '/productos' },
      {
        label: 'Inventario',
        children: [{ label: 'Existencias', href: '/existencias' }]
      }
    ]
  }
]

<Navigation items={items} label="Principal" />`}
          stack
        >
          <div className="w-64 rounded-box border border-base-300 bg-base-100 p-2">
            <Navigation items={ITEMS} label="Principal" currentUrl={`${BASE}/`} />
          </div>
        </Example>
      </Section>

      <Section title="El enlace activo">
        <Prose>
          <p>
            La comparacion es de igualdad exacta sobre el <code>href</code> absoluto, descartando el
            ancla vacia final — la misma que hace dn-ui. El <code>li</code> del activo recibe{' '}
            <code>is-active</code> y el enlace <code>aria-current="page"</code>.
          </p>
          <p>
            Ademas, los grupos que contienen al activo <strong>arrancan abiertos</strong>. En dn-ui
            eso se hacia subiendo por el DOM; aqui se calcula sobre los datos.
          </p>
        </Prose>
        <Example
          description="Aqui la url actual apunta a Movimientos, dos niveles dentro: mira como Catalogo e Inventario ya estan abiertos."
          code={`<Navigation
  items={items}
  currentUrl="https://ejemplo.dev/movimientos"
/>`}
          stack
        >
          <div className="w-64 rounded-box border border-base-300 bg-base-100 p-2">
            <Navigation
              items={ITEMS}
              label="Con activo profundo"
              currentUrl={`${BASE}/movimientos`}
            />
          </div>
        </Example>
      </Section>

      <Section title="Iconos del plegado">
        <Example
          description="Se puede cambiar el par de iconos que indica abierto y cerrado."
          code={`<Navigation
  items={items}
  iconClassDown="icon-small-down"
  iconClassUp="icon-small-up"
/>`}
          stack
        >
          <div className="w-64 rounded-box border border-base-300 bg-base-100 p-2">
            <Navigation
              items={ITEMS}
              label="Con otros iconos"
              currentUrl={`${BASE}/`}
              iconClassDown="icon-small-down"
              iconClassUp="icon-small-up"
            />
          </div>
        </Example>
      </Section>

      <Section title="El cajon en movil">
        <Prose>
          <p>
            <code>navigation.css</code> despliega los submenus por hover a partir de 1024 px y los
            pliega por debajo. Abrir y cerrar el cajon entero es cosa de la aplicacion: se hace
            poniendo una clase en el contenedor del layout, y esa clase la defines tu.
          </p>
        </Prose>
        <Example
          code={`const drawer = useNavigationDrawer({
  targetId: 'siteLayout',
  className: 'navigation-is-show'
})

<NavigationToggle expanded={drawer.isOpen} onClick={drawer.toggle}>
  <Icon name="menu" />
</NavigationToggle>

<div id="siteLayout">
  <Navigation items={items} />
</div>`}
          stack
        >
          <div id="ejemplo-layout" className="w-full">
            <NavigationToggle
              expanded={drawer.isOpen}
              onClick={drawer.toggle}
              className="btn btn-sm btn-outline"
            >
              <Icon name="menu" /> {drawer.isOpen ? 'Cerrar' : 'Abrir'} cajon
            </NavigationToggle>
            <p className="text-sm text-base-content/70 mt-2">
              La clase <code>navigation-is-show</code> {drawer.isOpen ? 'esta' : 'no esta'} en el
              contenedor.
            </p>
          </div>
        </Example>

        <Note variant="warning" title="La clase del cajon es tuya">
          <p>
            <code>navigation-is-show</code> no esta en el CSS de la libreria: en dn-ui la define la
            aplicacion anfitriona. El hook solo la pone y la quita.
          </p>
        </Note>
      </Section>

      <Section title="Con un router">
        <Prose>
          <p>
            El componente pinta enlaces <code>&lt;a&gt;</code> normales. Con un router de cliente,
            pasa la url actual e intercepta la navegacion en el contenedor.
          </p>
        </Prose>
        <Example
          openByDefault
          code={`import { useLocation, useNavigate } from 'react-router'

const { pathname } = useLocation()
const navigate = useNavigate()

<div
  onClick={(event) => {
    const enlace = (event.target as HTMLElement).closest('a')
    if (!enlace || enlace.getAttribute('aria-expanded') !== null) return
    event.preventDefault()
    navigate(new URL(enlace.href).pathname)
  }}
>
  <Navigation items={items} currentUrl={window.location.origin + pathname} />
</div>`}
        >
          <p className="text-sm text-base-content/70">
            Los enlaces de grupo ya llaman a <code>preventDefault</code>, por eso se descartan por{' '}
            <code>aria-expanded</code>.
          </p>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Navigation />"
          rows={[
            { name: 'items', type: 'NavigationItem[]', required: true, description: 'Arbol de navegacion.' },
            { name: 'currentUrl', type: 'string', default: 'document.location.href', description: 'Url con la que comparar para marcar el activo.' },
            { name: 'label', type: 'string', description: 'Nombre accesible de la lista.' },
            { name: 'iconClassDown', type: 'string', default: "'icon-down'", description: 'Icono del submenu cerrado.' },
            { name: 'iconClassUp', type: 'string', default: "'icon-up'", description: 'Icono del submenu abierto.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLUListElement>', description: 'Todo lo demas va al ul raiz.' }
          ]}
        />

        <PropsTable
          of="NavigationItem"
          rows={[
            { name: 'label', type: 'ReactNode', required: true, description: 'Texto del elemento.' },
            { name: 'href', type: 'string', description: 'Destino. Sin el, el elemento solo pliega.' },
            { name: 'icon', type: 'ReactNode', description: 'Se pinta antes de la etiqueta.' },
            { name: 'children', type: 'NavigationItem[]', description: 'Submenu. Anidamiento sin limite.' },
            { name: 'disabled', type: 'boolean', description: 'Marca aria-disabled.' }
          ]}
        />

        <PropsTable
          of="useNavigationDrawer(options)"
          rows={[
            { name: 'targetId', type: 'string', default: "'siteLayout'", description: 'Id del contenedor al que se le pone la clase.' },
            { name: 'className', type: 'string', default: "'navigation-is-show'", description: 'Clase que muestra el cajon.' },
            { name: 'devuelve', type: '{ isOpen, open, close, toggle }', description: 'Estado y acciones del cajon.' }
          ]}
        />

        <Note title="No pinta un landmark">
          <p>
            Igual que dn-ui, el componente es un <code>ul.navigation</code> sin envolver en{' '}
            <code>&lt;nav&gt;</code>. Ponlo tu alrededor si es la navegacion principal de la pagina.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
