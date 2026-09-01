import { useState } from 'react'
import {
  Button,
  Checkbox,
  Icon,
  Input,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  message,
  useContextMenu
} from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

/** El menu contextual necesita estar dentro de <Menu> para usar el hook. */
const ZonaContextual = () => {
  const abrirEnPuntero = useContextMenu()

  return (
    <div
      onContextMenu={abrirEnPuntero}
      className="w-full rounded-box border border-dashed border-base-300 p-8 text-center text-sm text-base-content/60 select-none"
    >
      Pulsa con el boton derecho aqui
    </div>
  )
}

export const MenuPage = () => {
  const [columnas, setColumnas] = useState<string[]>(['cliente', 'total'])

  const alternar = (columna: string) =>
    setColumnas((prev) =>
      prev.includes(columna) ? prev.filter((c) => c !== columna) : [...prev, columna]
    )

  return (
    <Page
      title="Menu"
      description="Desplegable posicionado con @floating-ui, con teclado completo. Solo puede haber un menu abierto en toda la pagina, igual que en dn-ui."
      importFrom={`import { Menu, MenuTrigger, MenuContent, MenuItem, useContextMenu } from '@dnui/react'`}
    >
      <Section title="Basico">
        <Prose>
          <p>
            <code>MenuTrigger</code> clona a su hijo y le engancha el toggle,{' '}
            <code>aria-haspopup</code> y <code>aria-expanded</code>. No hace falta que sea un boton,
            pero deberia serlo.
          </p>
        </Prose>
        <Example
          code={`<Menu>
  <MenuTrigger>
    <Button>Acciones</Button>
  </MenuTrigger>
  <MenuContent label="Acciones">
    <MenuItem onSelect={() => editar()}>Editar</MenuItem>
    <MenuItem onSelect={() => duplicar()}>Duplicar</MenuItem>
    <MenuItem disabled>Borrar</MenuItem>
  </MenuContent>
</Menu>`}
        >
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

          <Menu>
            <MenuTrigger>
              <Button variant="primary">
                Con iconos <Icon name="small-down" />
              </Button>
            </MenuTrigger>
            <MenuContent label="Con iconos">
              <MenuItem onSelect={() => message.info('Copiado')}>
                <Icon name="copy" /> Copiar
              </MenuItem>
              <MenuItem onSelect={() => message.info('Cortado')}>
                <Icon name="cut" /> Cortar
              </MenuItem>
              <MenuItem onSelect={() => message.info('Pegado')}>
                <Icon name="paste" /> Pegar
              </MenuItem>
            </MenuContent>
          </Menu>
        </Example>
      </Section>

      <Section title="Teclado">
        <Prose>
          <p>Abre el primer menu de arriba y prueba:</p>
          <ul>
            <li>
              <strong>Flechas</strong> arriba y abajo recorren las opciones, dando la vuelta en los
              extremos.
            </li>
            <li>
              <strong>Home</strong> y <strong>End</strong> saltan a la primera y a la ultima.
            </li>
            <li>
              <strong>Escribir</strong> salta a la opcion que empieza por esas letras. Repetir la
              misma letra cicla entre las que empiezan por ella.
            </li>
            <li>
              <strong>Enter</strong> o <strong>espacio</strong> activan la opcion enfocada.
            </li>
            <li>
              <strong>Escape</strong> cierra y el foco vuelve al disparador.
            </li>
          </ul>
          <p>
            Las opciones deshabilitadas quedan fuera del recorrido. Nada de esto existe en dn-ui.
          </p>
        </Prose>
      </Section>

      <Section title="Posicion">
        <Example
          description="El menu se voltea y se desplaza solo si no cabe. La posicion de partida se elige con placement."
          code={`{(['bottom-start', 'bottom-end', 'top-start', 'right-start'] as const).map((placement) => (
  <Menu key={placement} placement={placement}>
    <MenuTrigger>
      <Button appearance="outline" size="sm">{placement}</Button>
    </MenuTrigger>
    <MenuContent label={placement}>
      <MenuItem>Primera</MenuItem>
      <MenuItem>Segunda</MenuItem>
    </MenuContent>
  </Menu>
))}`}
        >
          {(['bottom-start', 'bottom-end', 'top-start', 'right-start'] as const).map((placement) => (
            <Menu key={placement} placement={placement}>
              <MenuTrigger>
                <Button appearance="outline" size="sm">
                  {placement}
                </Button>
              </MenuTrigger>
              <MenuContent label={placement}>
                <MenuItem>Primera</MenuItem>
                <MenuItem>Segunda</MenuItem>
              </MenuContent>
            </Menu>
          ))}
        </Example>
      </Section>

      <Section title="Opcion activa">
        <Example
          code={`<MenuItem active>Recientes</MenuItem>`}
        >
          <Menu>
            <MenuTrigger>
              <Button appearance="outline">Ordenar por</Button>
            </MenuTrigger>
            <MenuContent label="Ordenar por">
              <MenuItem active>Recientes</MenuItem>
              <MenuItem>Antiguos</MenuItem>
              <MenuItem>Alfabetico</MenuItem>
            </MenuContent>
          </Menu>
        </Example>
      </Section>

      <Section title="Panel con controles">
        <Prose>
          <p>
            Un menu no siempre es una lista de opciones. Con <code>panel</code> el contenido se pinta
            tal cual — sin <code>role="menu"</code>, sin foco itinerante — y con{' '}
            <code>autoClose={'{false}'}</code> los clicks dentro no lo cierran. Es lo que en dn-ui se
            conseguia con <code>data-menuautoclose="false"</code>, y lo que necesita el filtro de
            columna de la tabla.
          </p>
        </Prose>
        <Example
          code={`const [columnas, setColumnas] = useState(['cliente', 'total'])

const alternar = (columna) =>
  setColumnas((prev) =>
    prev.includes(columna) ? prev.filter((c) => c !== columna) : [...prev, columna]
  )

<Menu autoClose={false}>
  <MenuTrigger>
    <Button appearance="outline">
      <Icon name="columns" /> Columnas
    </Button>
  </MenuTrigger>

  <MenuContent panel>
    <div className="grid gap-2 min-w-52">
      <Input size="sm" placeholder="Filtrar" aria-label="Filtrar columnas" />

      {['id', 'cliente', 'estado', 'total'].map((columna) => (
        <label key={columna} className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={columnas.includes(columna)}
            onChange={() => alternar(columna)}
          />
          {columna}
        </label>
      ))}
    </div>
  </MenuContent>
</Menu>`}
          stack
        >
          <Menu autoClose={false}>
            <MenuTrigger>
              <Button appearance="outline">
                <Icon name="columns" /> Columnas
              </Button>
            </MenuTrigger>
            <MenuContent panel>
              <div className="grid gap-2 min-w-52">
                <Input size="sm" placeholder="Filtrar" aria-label="Filtrar columnas" />
                {['id', 'cliente', 'estado', 'total'].map((columna) => (
                  <label key={columna} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={columnas.includes(columna)}
                      onChange={() => alternar(columna)}
                    />
                    {columna}
                  </label>
                ))}
              </div>
            </MenuContent>
          </Menu>

          <p className="text-sm text-base-content/70">
            Visibles: {columnas.join(', ') || 'ninguna'}
          </p>
        </Example>
      </Section>

      <Section title="Menu contextual">
        <Prose>
          <p>
            <code>useContextMenu()</code> abre el menu en las coordenadas del puntero usando un
            ancla virtual de <code>@floating-ui</code>. El hook tiene que llamarse dentro de un{' '}
            <code>&lt;Menu&gt;</code>.
          </p>
        </Prose>
        <Example
          code={`const ZonaContextual = () => {
  const abrirEnPuntero = useContextMenu()
  return <div onContextMenu={abrirEnPuntero}>Pulsa con el boton derecho</div>
}

<Menu>
  <ZonaContextual />
  <MenuContent label="Acciones de fila">
    <MenuItem>Abrir</MenuItem>
    <MenuItem>Imprimir</MenuItem>
  </MenuContent>
</Menu>`}
          stack
        >
          <Menu>
            <ZonaContextual />
            <MenuContent label="Acciones de fila">
              <MenuItem onSelect={() => message.info('Abrir')}>Abrir</MenuItem>
              <MenuItem onSelect={() => message.info('Imprimir')}>Imprimir</MenuItem>
              <MenuItem onSelect={() => message.danger('Borrar')}>Borrar</MenuItem>
            </MenuContent>
          </Menu>
        </Example>
      </Section>

      <Section title="Un solo menu abierto">
        <Example
          description="Abre uno y luego el otro: el primero se cierra. Es la regla de dn-ui, que guarda un unico Menu.openMenu estatico."
          code={`// menuStore mantiene una sola clave abierta en toda la aplicacion`}
        >
          <Menu>
            <MenuTrigger>
              <Button appearance="outline">Primero</Button>
            </MenuTrigger>
            <MenuContent label="Primero">
              <MenuItem>Uno</MenuItem>
              <MenuItem>Dos</MenuItem>
            </MenuContent>
          </Menu>
          <Menu>
            <MenuTrigger>
              <Button appearance="outline">Segundo</Button>
            </MenuTrigger>
            <MenuContent label="Segundo">
              <MenuItem>Tres</MenuItem>
              <MenuItem>Cuatro</MenuItem>
            </MenuContent>
          </Menu>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Menu />"
          rows={[
            { name: 'autoClose', type: 'boolean', default: 'true', description: 'Con true, cualquier click fuera del disparador cierra, incluidos los del propio menu: por eso al elegir una opcion se cierra. Con false, los clicks dentro del overlay no lo cierran.' },
            { name: 'placement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start'", default: "'bottom-start'", description: 'Posicion de partida. Se voltea y desplaza sola si no cabe.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Avisa al abrir y al cerrar.' }
          ]}
        />

        <PropsTable
          of="<MenuTrigger />"
          rows={[
            { name: 'children', type: 'ReactElement', required: true, description: 'Un unico elemento. Recibe la ref, el onClick y los atributos ARIA.' }
          ]}
        />

        <PropsTable
          of="<MenuContent />"
          rows={[
            { name: 'label', type: 'string', description: 'Nombre accesible del menu.' },
            { name: 'panel', type: 'boolean', default: 'false', description: 'Contenido libre: sin role="menu", sin foco itinerante y sin enfocar nada al abrir.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div .menu-content.' }
          ]}
        />

        <PropsTable
          of="<MenuItem />"
          rows={[
            { name: 'onSelect', type: '() => void', description: 'Se llama al activar la opcion. Despues el menu se cierra.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Marca aria-disabled y la saca del recorrido con flechas.' },
            { name: 'active', type: 'boolean', default: 'false', description: 'Aspecto de opcion seleccionada.' },
            { name: '…rest', type: 'LiHTMLAttributes', description: 'Todo lo demas va al li.' }
          ]}
        />

        <Note title="Donde se pinta">
          <p>
            El overlay se portaliza a un div <code>.MenuScope</code> creado en <code>body</code>, el
            mismo nombre que usa dn-ui. Asi no lo recorta ningun <code>overflow: hidden</code>.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
