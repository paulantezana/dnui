import { Button, Icon, Tooltip } from '@dnui/react'
import { CodeBlock } from '../ui/CodeBlock'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const ESTILOS = `/* En tu propio CSS: la libreria no envia estilos para el tooltip */
.tooltip {
  @apply px-2 py-1 rounded-field text-xs pointer-events-none z-[1100];
  @apply bg-neutral text-neutral-content shadow-lg;
  max-width: 16rem;
}`

export const TooltipPage = () => (
  <Page
    title="Tooltip"
    description="Aviso flotante al pasar el raton o al enfocar con el teclado, posicionado con @floating-ui."
    importFrom={`import { Tooltip } from '@dnui/react'`}
  >
    <Note variant="warning" title="Hay que darle estilo">
      <p>
        La libreria <strong>no envia CSS para el tooltip</strong>, y dn-ui tampoco: su{' '}
        <code>tooltip.ts</code> pinta la clase <code>TabTooltip</code> mientras su{' '}
        <code>tooltip.scss</code> — que no entra en el build — define <code>.tooltip</code>. Este
        componente usa <code>.tooltip</code>, que es la que el SCSS pretendia. Sin reglas propias
        aparece sin fondo. Los ejemplos de esta pagina llevan un estilo minimo para que se vean.
      </p>
    </Note>

    <Section title="Basico">
      <Example
        code={`<Tooltip content="Guarda sin salir de la pagina">
  <Button>Guardar</Button>
</Tooltip>`}
      >
        <Tooltip content="Guarda sin salir de la pagina">
          <Button>Guardar</Button>
        </Tooltip>

        <Tooltip content="Descarta los cambios">
          <Button appearance="outline">Cancelar</Button>
        </Tooltip>

        <Tooltip content="Esta accion no se puede deshacer">
          <Button variant="error" appearance="soft">
            <Icon name="cross" /> Borrar
          </Button>
        </Tooltip>
      </Example>
    </Section>

    <Section title="Tambien con el teclado">
      <Prose>
        <p>
          Se muestra al enfocar, no solo al pasar el raton, y se cierra con Escape. El elemento
          anclado recibe <code>aria-describedby</code> apuntando al aviso, asi que un lector de
          pantalla lo anuncia. Prueba a tabular por los botones de arriba.
        </p>
      </Prose>
    </Section>

    <Section title="Posicion">
      <Example
        description="Si no cabe, se voltea y se desplaza solo."
        code={`{(['top', 'bottom', 'left', 'right', 'top-start', 'bottom-end'] as const).map((placement) => (
  <Tooltip key={placement} content={\`Estoy en \${placement}\`} placement={placement}>
    <Button appearance="outline" size="sm">{placement}</Button>
  </Tooltip>
))}`}
      >
        {(['top', 'bottom', 'left', 'right', 'top-start', 'bottom-end'] as const).map((placement) => (
          <Tooltip key={placement} content={`Estoy en ${placement}`} placement={placement}>
            <Button appearance="outline" size="sm">
              {placement}
            </Button>
          </Tooltip>
        ))}
      </Example>
    </Section>

    <Section title="Distancia y retardo">
      <Example
        description="distance separa el aviso del elemento; delay retrasa el cierre, que evita parpadeos al mover el raton."
        code={`<Tooltip content="Pegado al boton" distance={2}>
  <Button appearance="outline" size="sm">distance 2</Button>
</Tooltip>

<Tooltip content="Separado" distance={20}>
  <Button appearance="outline" size="sm">distance 20</Button>
</Tooltip>

<Tooltip content="Tardo en irme" delay={600}>
  <Button appearance="outline" size="sm">delay 600</Button>
</Tooltip>`}
      >
        <Tooltip content="Pegado al boton" distance={2}>
          <Button appearance="outline" size="sm">
            distance 2
          </Button>
        </Tooltip>
        <Tooltip content="Separado" distance={20}>
          <Button appearance="outline" size="sm">
            distance 20
          </Button>
        </Tooltip>
        <Tooltip content="Tardo en irme" delay={600}>
          <Button appearance="outline" size="sm">
            delay 600
          </Button>
        </Tooltip>
      </Example>
    </Section>

    <Section title="Desactivado">
      <Example
        code={`<Tooltip content="No aparezco" disabled>
  <Button>Sin ayuda</Button>
</Tooltip>`}
      >
        <Tooltip content="No aparezco" disabled>
          <Button appearance="ghost">Sin ayuda</Button>
        </Tooltip>
      </Example>
    </Section>

    <Section title="Contenido enriquecido">
      <Example
        code={`<Tooltip
  content={
    <div>
      <strong>Atajo</strong>
      <div>Ctrl + S</div>
    </div>
  }
>
  <Button><Icon name="save" /></Button>
</Tooltip>`}
      >
        <Tooltip
          content={
            <span>
              <strong>Atajo:</strong> Ctrl + S
            </span>
          }
        >
          <Button shape="square" aria-label="Guardar">
            <Icon name="save" />
          </Button>
        </Tooltip>
      </Example>
    </Section>

    <Section title="Los estilos que faltan">
      <Prose>
        <p>Un punto de partida razonable, en Tailwind v4 sobre los tokens de la libreria:</p>
      </Prose>
      <div className="rounded-box overflow-hidden mb-4">
        <CodeBlock code={ESTILOS} language="css" />
      </div>
    </Section>

    <Section title="API">
      <PropsTable
        of="<Tooltip />"
        rows={[
          { name: 'content', type: 'ReactNode', required: true, description: 'Contenido del aviso.' },
          { name: 'children', type: 'ReactElement', required: true, description: 'Un unico elemento. Recibe la ref, los handlers y aria-describedby.' },
          { name: 'placement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right'", default: "'top'", description: 'Posicion de partida.' },
          { name: 'distance', type: 'number', default: '10', description: 'Separacion en px respecto al elemento anclado.' },
          { name: 'delay', type: 'number', default: '0', description: 'Retardo antes de ocultar, en ms.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'No muestra nada.' }
        ]}
      />

      <Note title="No sirve para contenido interactivo">
        <p>
          El aviso desaparece al salir el raton y no se puede enfocar, asi que no metas dentro
          botones ni enlaces. Para eso usa <code>Menu</code> en modo panel.
        </p>
      </Note>
    </Section>
  </Page>
)
