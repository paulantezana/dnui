import { useState } from 'react'
import { Badge, Icon, List, ListItem } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const ListPage = () => {
  const [activo, setActivo] = useState('componentes')

  return (
    <Page
      title="List"
      description="Lista de elementos, con una variante de menu para paneles desplegables."
      importFrom={`import { List, ListItem } from '@dnui/react'`}
    >
      <Note variant="warning" title="Aviso sobre los estilos">
        <p>
          En dn-ui <code>list.css</code> esta <strong>enteramente comentado</strong>: las clases{' '}
          <code>.list</code> y <code>.list-item</code> no tienen ninguna regla. Lo que si tiene
          estilo es la variante <code>menu</code>, porque reutiliza <code>menu.css</code>. El
          componente respeta ese contrato tal cual.
        </p>
      </Note>

      <Section title="Variante de menu">
        <Prose>
          <p>
            Con <code>menu</code> la lista recibe fondo, borde y el estilo de fila de{' '}
            <code>menu.css</code>. Es la que usan los paneles desplegables.
          </p>
        </Prose>
        <Example
          code={`<List menu>
  <ListItem>Inicio</ListItem>
  <ListItem active>Componentes</ListItem>
  <ListItem disabled>Ajustes</ListItem>
</List>`}
        >
          <List menu className="w-56">
            <ListItem>Inicio</ListItem>
            <ListItem active>Componentes</ListItem>
            <ListItem disabled>Ajustes</ListItem>
          </List>
        </Example>
      </Section>

      <Section title="Estados">
        <Example
          description="active pinta la fila como seleccionada; disabled la atenua y bloquea el puntero."
          code={`<ListItem active>Seleccionada</ListItem>
<ListItem disabled>Deshabilitada</ListItem>`}
        >
          <List menu className="w-56">
            <ListItem>Normal</ListItem>
            <ListItem active>Seleccionada</ListItem>
            <ListItem disabled>Deshabilitada</ListItem>
          </List>
        </Example>
      </Section>

      <Section title="Con iconos y contenido">
        <Example
          code={`<List menu>
  <ListItem>
    <Icon name="chart" /> Informes
    <Badge size="xs" variant="info" appearance="soft" className="ml-auto">3</Badge>
  </ListItem>
</List>`}
        >
          <List menu className="w-64">
            <ListItem>
              <Icon name="chart" /> Informes
              <Badge size="xs" variant="info" appearance="soft" className="ml-auto">
                3
              </Badge>
            </ListItem>
            <ListItem>
              <Icon name="settings" /> Ajustes
            </ListItem>
            <ListItem>
              <Icon name="save" /> Guardados
              <Badge size="xs" appearance="soft" className="ml-auto">
                12
              </Badge>
            </ListItem>
          </List>
        </Example>
      </Section>

      <Section title="Seleccionable">
        <Example
          description="El componente no guarda seleccion: la controlas tu con active."
          code={`const [activo, setActivo] = useState('componentes')

<List menu>
  {items.map((item) => (
    <ListItem
      key={item.id}
      active={activo === item.id}
      onClick={() => setActivo(item.id)}
    >
      {item.label}
    </ListItem>
  ))}
</List>`}
          stack
        >
          <List menu className="w-56">
            {[
              { id: 'inicio', label: 'Inicio' },
              { id: 'componentes', label: 'Componentes' },
              { id: 'ajustes', label: 'Ajustes' }
            ].map((item) => (
              <ListItem
                key={item.id}
                active={activo === item.id}
                onClick={() => setActivo(item.id)}
              >
                {item.label}
              </ListItem>
            ))}
          </List>
          <p className="text-sm text-base-content/70">Activo: {activo}</p>
        </Example>

        <Note title="Si la lista es un menu de verdad">
          <p>
            Para un desplegable con teclado, roles y cierre al elegir, usa{' '}
            <code>Menu</code> en vez de montarlo sobre <code>List</code>. Este componente es
            presentacion.
          </p>
        </Note>
      </Section>

      <Section title="API">
        <PropsTable
          of="<List />"
          rows={[
            { name: 'menu', type: 'boolean', default: 'false', description: 'Aspecto de panel desplegable. Anade las clases list-menu y menu.' },
            { name: 'shadow', type: 'boolean', default: 'false', description: 'Anade la clase shadow.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLUListElement>', description: 'Todo lo demas va al ul.' }
          ]}
        />

        <PropsTable
          of="<ListItem />"
          rows={[
            { name: 'active', type: 'boolean', default: 'false', description: 'Fila seleccionada.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Atenua la fila, bloquea el puntero y marca aria-disabled.' },
            { name: '…rest', type: 'LiHTMLAttributes<HTMLLIElement>', description: 'Todo lo demas va al li.' }
          ]}
        />
      </Section>
    </Page>
  )
}
