import { Button, buttonClass, Icon } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const VARIANTES = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'] as const
const TAMANOS = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const ACABADOS = ['outline', 'dash', 'soft', 'ghost', 'link'] as const

export const ButtonPage = () => (
  <Page
    title="Button"
    description="El boton de la libreria. Ocho variantes de color, cinco tamanos y cinco acabados, sobre las clases de button.css."
    importFrom={`import { Button, buttonClass } from '@dnui/react'`}
  >
    <Section title="Variantes">
      <Example
        code={`<Button>por defecto</Button>
<Button variant="primary">primary</Button>
<Button variant="secondary">secondary</Button>
<Button variant="accent">accent</Button>
<Button variant="neutral">neutral</Button>
<Button variant="info">info</Button>
<Button variant="success">success</Button>
<Button variant="warning">warning</Button>
<Button variant="error">error</Button>`}
      >
        <Button>por defecto</Button>
        {VARIANTES.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </Example>
    </Section>

    <Section title="Acabados">
      <Example
        description="Se combinan con cualquier variante de color. Arriba sin variante, abajo con primary."
        code={`{/* Sin variante */}
<Button appearance="outline">outline</Button>
<Button appearance="dash">dash</Button>
<Button appearance="soft">soft</Button>
<Button appearance="ghost">ghost</Button>
<Button appearance="link">link</Button>

{/* Con variante */}
<Button appearance="outline" variant="primary">outline</Button>
<Button appearance="dash" variant="primary">dash</Button>
<Button appearance="soft" variant="primary">soft</Button>
<Button appearance="ghost" variant="primary">ghost</Button>
<Button appearance="link" variant="primary">link</Button>`}
        stack
      >
        <div className="flex flex-wrap gap-3">
          {ACABADOS.map((appearance) => (
            <Button key={appearance} appearance={appearance}>
              {appearance}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {ACABADOS.map((appearance) => (
            <Button key={appearance} appearance={appearance} variant="primary">
              {appearance}
            </Button>
          ))}
        </div>
      </Example>
    </Section>

    <Section title="Tamanos">
      <Example
        code={`<Button size="xs" variant="primary">xs</Button>
<Button size="sm" variant="primary">sm</Button>
<Button size="md" variant="primary">md</Button>
<Button size="lg" variant="primary">lg</Button>
<Button size="xl" variant="primary">xl</Button>`}
      >
        {TAMANOS.map((size) => (
          <Button key={size} size={size} variant="primary">
            {size}
          </Button>
        ))}
      </Example>
    </Section>

    <Section title="Forma y ancho">
      <Example
        description="square y circle dan una caja de proporcion fija para botones de solo icono; wide ensancha y block ocupa toda la linea."
        code={`<Button shape="square" aria-label="Anadir">
  <Icon name="plus" />
</Button>
<Button shape="circle" aria-label="Cerrar">
  <Icon name="cross" />
</Button>
<Button wide>wide</Button>

<Button block variant="primary">block</Button>`}
        stack
      >
        <div className="flex flex-wrap gap-3">
          <Button shape="square" aria-label="Anadir">
            <Icon name="plus" />
          </Button>
          <Button shape="circle" aria-label="Cerrar">
            <Icon name="cross" />
          </Button>
          <Button wide>wide</Button>
        </div>
        <Button block variant="primary">
          block
        </Button>
      </Example>
    </Section>

    <Section title="Estados">
      <Example
        description="Al deshabilitar se anade tambien la clase btn-disabled, que es la que estiliza button.css."
        code={`<Button disabled>deshabilitado</Button>
<Button disabled variant="primary">deshabilitado</Button>
<Button active variant="primary">activo</Button>`}
      >
        <Button disabled>deshabilitado</Button>
        <Button disabled variant="primary">
          deshabilitado
        </Button>
        <Button active variant="primary">
          activo
        </Button>
      </Example>
    </Section>

    <Section title="Con icono">
      <Example
        code={`<Button variant="primary">
  <Icon name="save" />
  Guardar
</Button>

<Button appearance="outline">
  <Icon name="filter" />
  Filtrar
</Button>

<Button appearance="ghost" variant="error">
  <Icon name="cross" />
  Borrar
</Button>`}
      >
        <Button variant="primary">
          <Icon name="save" />
          Guardar
        </Button>
        <Button appearance="outline">
          <Icon name="filter" />
          Filtrar
        </Button>
        <Button appearance="ghost" variant="error">
          <Icon name="cross" />
          Borrar
        </Button>
      </Example>
    </Section>

    <Section title="El mismo estilo en otro elemento">
      <Prose>
        <p>
          <code>buttonClass()</code> devuelve solo las clases. Sirve para que un enlace o una
          etiqueta se vean como un boton sin duplicar la logica.
        </p>
      </Prose>
      <Example
        code={`import { buttonClass } from '@dnui/react'

<a href="/instalacion" className={buttonClass({ variant: 'primary' })}>
  Soy un enlace
</a>

<a href="/instalacion" className={buttonClass({ appearance: 'outline', size: 'sm' })}>
  Y yo tambien
</a>`}
      >
        <a href="#button" className={buttonClass({ variant: 'primary' })}>
          Soy un enlace
        </a>
        <a href="#button" className={buttonClass({ appearance: 'outline', size: 'sm' })}>
          Y yo tambien
        </a>
      </Example>

      <Note title="Por que no una prop as">
        <p>
          Un boton y un enlace no son intercambiables: cambian el teclado, el menu contextual y lo
          que anuncia un lector de pantalla. Devolver las clases deja esa decision en tus manos en
          vez de esconderla.
        </p>
      </Note>
    </Section>

    <Section title="API">
      <PropsTable
        of="<Button />"
        rows={[
          { name: 'variant', type: "'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error'", description: 'Color del boton.' },
          { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: 'Tamano.' },
          { name: 'appearance', type: "'outline' | 'dash' | 'soft' | 'ghost' | 'link'", description: 'Acabado.' },
          { name: 'shape', type: "'square' | 'circle'", description: 'Caja cuadrada o circular, para botones de solo icono.' },
          { name: 'block', type: 'boolean', default: 'false', description: 'Ocupa todo el ancho.' },
          { name: 'wide', type: 'boolean', default: 'false', description: 'Ancho minimo mayor.' },
          { name: 'active', type: 'boolean', default: 'false', description: 'Aspecto de pulsado.' },
          { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Por defecto no envia formularios.' },
          { name: '…rest', type: 'ButtonHTMLAttributes<HTMLButtonElement>', description: 'Todo lo demas va al elemento button: onClick, disabled, form, aria-*…' }
        ]}
      />

      <PropsTable
        of="buttonClass(props)"
        rows={[
          { name: 'props', type: 'ButtonVariantProps', description: 'Las mismas props de estilo que el componente: variant, size, appearance, shape, block, wide y active. Devuelve la cadena de clases.' }
        ]}
      />
    </Section>
  </Page>
)
