import { useState } from 'react'
import { Button, Icon, Input, type IconName } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const NOMBRES: IconName[] = [
  'aggregation', 'arrows', 'asc', 'cancel', 'chart', 'color-picker', 'columns',
  'contracted', 'copy', 'cross', 'csv', 'cut', 'desc', 'down', 'excel',
  'expanded', 'eye', 'eye-slash', 'filter', 'first', 'grip', 'group', 'last',
  'left', 'linked', 'loading', 'maximize', 'menu', 'menu-alt', 'minimize',
  'minus', 'next', 'none', 'not-allowed', 'paste', 'pin', 'pivot', 'plus',
  'previous', 'right', 'save', 'settings', 'small-down', 'small-left',
  'small-right', 'small-up', 'tick', 'tree-closed', 'tree-indeterminate',
  'tree-open', 'unlinked', 'up'
]

export const IconPage = () => {
  const [query, setQuery] = useState('')
  const [copiado, setCopiado] = useState<IconName | null>(null)

  const visibles = NOMBRES.filter((name) => name.includes(query.trim().toLowerCase()))

  const copiar = async (name: IconName) => {
    try {
      await navigator.clipboard.writeText(`<Icon name="${name}" />`)
      setCopiado(name)
      setTimeout(() => setCopiado(null), 1400)
    } catch {
      // sin portapapeles, el nombre sigue visible bajo el icono
    }
  }

  return (
    <Page
      title="Icon"
      description="Los 52 iconos de icon.css. Se pintan con mascaras CSS, asi que heredan el color del texto y escalan con el tamano de fuente."
      importFrom={`import { Icon } from '@dnui/react'`}
    >
      <Section title="Uso">
        <Example
          description="Por defecto el icono es decorativo y se oculta a los lectores de pantalla. Si el icono es la unica informacion, pasa label."
          code={`<Icon name="save" />
<Icon name="filter" />

{/* Con significado propio */}
<Icon name="not-allowed" label="No permitido" />`}
        >
          <Icon name="save" />
          <Icon name="filter" />
          <Icon name="settings" />
          <Icon name="not-allowed" label="No permitido" />
        </Example>
      </Section>

      <Section title="Color y tamano">
        <Prose>
          <p>
            El icono usa <code>currentColor</code> y <code>1em</code>, asi que basta con cambiar el
            color y el tamano de fuente del contenedor.
          </p>
        </Prose>
        <Example
          code={`<span className="text-error text-2xl"><Icon name="cross" /></span>
<Button variant="primary"><Icon name="save" /> Guardar</Button>`}
        >
          <span className="text-base-content">
            <Icon name="tick" />
          </span>
          <span className="text-success text-xl">
            <Icon name="tick" />
          </span>
          <span className="text-error text-2xl">
            <Icon name="cross" />
          </span>
          <span className="text-primary text-3xl">
            <Icon name="pin" />
          </span>
          <Button variant="primary">
            <Icon name="save" />
            Guardar
          </Button>
        </Example>
      </Section>

      <Section title="Catalogo">
        <Prose>
          <p>Pulsa cualquiera para copiar su etiqueta.</p>
        </Prose>

        <div className="mb-4 max-w-xs">
          <Input
            size="sm"
            type="search"
            placeholder="Filtrar iconos"
            aria-label="Filtrar iconos"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2">
          {visibles.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => copiar(name)}
              className="flex flex-col items-center gap-2 rounded-box border border-base-300 bg-base-100 px-2 py-3 text-[11px] text-base-content/70 hover:border-neutral hover:text-base-content transition-colors"
            >
              <span className="text-xl text-base-content">
                <Icon name={name} />
              </span>
              <span className="truncate w-full text-center">
                {copiado === name ? 'copiado' : name}
              </span>
            </button>
          ))}
        </div>

        {visibles.length === 0 && (
          <p className="empty">Ningun icono coincide con «{query}».</p>
        )}
      </Section>

      <Section title="API">
        <PropsTable
          of="<Icon />"
          rows={[
            { name: 'name', type: 'IconName', required: true, description: 'Nombre del icono. El tipo enumera los 52 disponibles.' },
            { name: 'label', type: 'string', description: 'Texto para lectores de pantalla. Sin el, el icono se marca aria-hidden.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLSpanElement>', description: 'Todo lo demas va al span.' }
          ]}
        />

        <Note title="Los iconos de estado son otra cosa">
          <p>
            Modal y Message pintan un SVG distinto (<code>info</code>, <code>success</code>,{' '}
            <code>warning</code>, <code>danger</code>, <code>question</code>) que viene del objeto{' '}
            <code>Icon</code> del motor, no de <code>icon.css</code>. No se mezclan.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
