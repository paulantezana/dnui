import { Badge, badgeClass, Icon } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const VARIANTES = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'] as const
const TAMANOS = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export const BadgePage = () => (
  <Page
    title="Badge"
    description="Etiqueta corta para estados, contadores y categorias. Mismas variantes y tamanos que Button."
    importFrom={`import { Badge, badgeClass } from '@dnui/react'`}
  >
    <Section title="Variantes">
      <Example
        code={`<Badge>por defecto</Badge>
<Badge variant="primary">primary</Badge>
<Badge variant="secondary">secondary</Badge>
<Badge variant="accent">accent</Badge>
<Badge variant="neutral">neutral</Badge>
<Badge variant="info">info</Badge>
<Badge variant="success">success</Badge>
<Badge variant="warning">warning</Badge>
<Badge variant="error">error</Badge>`}
      >
        <Badge>por defecto</Badge>
        {VARIANTES.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </Example>
    </Section>

    <Section title="Acabados">
      <Example
        description="soft baja la saturacion del fondo; outline y dash dejan solo el borde."
        code={`{/* soft, con las ocho variantes */}
<Badge variant="primary" appearance="soft">primary</Badge>
<Badge variant="secondary" appearance="soft">secondary</Badge>
<Badge variant="accent" appearance="soft">accent</Badge>
<Badge variant="neutral" appearance="soft">neutral</Badge>
<Badge variant="info" appearance="soft">info</Badge>
<Badge variant="success" appearance="soft">success</Badge>
<Badge variant="warning" appearance="soft">warning</Badge>
<Badge variant="error" appearance="soft">error</Badge>

{/* outline, con las ocho variantes */}
<Badge variant="primary" appearance="outline">primary</Badge>
<Badge variant="secondary" appearance="outline">secondary</Badge>
<Badge variant="accent" appearance="outline">accent</Badge>
<Badge variant="neutral" appearance="outline">neutral</Badge>
<Badge variant="info" appearance="outline">info</Badge>
<Badge variant="success" appearance="outline">success</Badge>
<Badge variant="warning" appearance="outline">warning</Badge>
<Badge variant="error" appearance="outline">error</Badge>

{/* Los otros dos acabados */}
<Badge appearance="dash">dash</Badge>
<Badge appearance="ghost">ghost</Badge>`}
        stack
      >
        <div className="flex flex-wrap gap-2">
          {VARIANTES.map((variant) => (
            <Badge key={variant} variant={variant} appearance="soft">
              {variant}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {VARIANTES.map((variant) => (
            <Badge key={variant} variant={variant} appearance="outline">
              {variant}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge appearance="dash">dash</Badge>
          <Badge appearance="ghost">ghost</Badge>
        </div>
      </Example>
    </Section>

    <Section title="Tamanos">
      <Example
        code={`<Badge size="xs" variant="primary">xs</Badge>
<Badge size="sm" variant="primary">sm</Badge>
<Badge size="md" variant="primary">md</Badge>
<Badge size="lg" variant="primary">lg</Badge>
<Badge size="xl" variant="primary">xl</Badge>`}
      >
        {TAMANOS.map((size) => (
          <Badge key={size} size={size} variant="primary">
            {size}
          </Badge>
        ))}
      </Example>
    </Section>

    <Section title="Con icono y en contexto">
      <Example
        code={`<Badge variant="success" appearance="soft">
  <Icon name="tick" /> Pagado
</Badge>
<Badge variant="error" appearance="soft">
  <Icon name="cross" /> Anulado
</Badge>
<Badge variant="info" appearance="soft">
  <Icon name="loading" /> Procesando
</Badge>

<h3 className="text-base font-medium flex items-center gap-2">
  Informe mensual
  <Badge size="sm" variant="warning" appearance="soft">Borrador</Badge>
</h3>`}
        stack
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" appearance="soft">
            <Icon name="tick" /> Pagado
          </Badge>
          <Badge variant="error" appearance="soft">
            <Icon name="cross" /> Anulado
          </Badge>
          <Badge variant="info" appearance="soft">
            <Icon name="loading" /> Procesando
          </Badge>
        </div>

        <h3 className="text-base font-medium flex items-center gap-2">
          Informe mensual
          <Badge size="sm" variant="warning" appearance="soft">
            Borrador
          </Badge>
        </h3>
      </Example>
    </Section>

    <Section title="El mismo estilo en otro elemento">
      <Prose>
        <p>
          Igual que con el boton, <code>badgeClass()</code> devuelve solo las clases.
        </p>
      </Prose>
      <Example
        code={`import { badgeClass } from '@dnui/react'

<a href="/etiqueta/react" className={badgeClass({ variant: 'info', appearance: 'soft' })}>
  react
</a>

<a href="/etiqueta/typescript" className={badgeClass({ appearance: 'outline' })}>
  typescript
</a>`}
      >
        <a href="#badge" className={badgeClass({ variant: 'info', appearance: 'soft' })}>
          react
        </a>
        <a href="#badge" className={badgeClass({ appearance: 'outline' })}>
          typescript
        </a>
      </Example>
    </Section>

    <Section title="API">
      <PropsTable
        of="<Badge />"
        rows={[
          { name: 'variant', type: "'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error'", description: 'Color.' },
          { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: 'Tamano.' },
          { name: 'appearance', type: "'outline' | 'dash' | 'soft' | 'ghost'", description: 'Acabado. A diferencia de Button, no hay link.' },
          { name: '…rest', type: 'HTMLAttributes<HTMLSpanElement>', description: 'Todo lo demas va al span.' }
        ]}
      />

      <PropsTable
        of="badgeClass(props)"
        rows={[
          { name: 'props', type: 'BadgeVariantProps', description: 'Las mismas props de estilo: variant, size y appearance. Devuelve la cadena de clases.' }
        ]}
      />

      <Note title="Tag y Badge son lo mismo">
        <p>
          El demo de dn-ui tiene una pagina «Tag» que en realidad usa la clase <code>badge</code>.
          Aqui hay un solo componente.
        </p>
      </Note>
    </Section>
  </Page>
)
