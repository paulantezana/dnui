import { Badge, Button, Card, CardBody, ThemeToggle, useTheme } from '@dnui/react'
import { CodeBlock } from '../ui/CodeBlock'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const TOKENS = `@theme {
  --color-base-100: oklch(100% 0 0);        /* superficies: tarjetas, menus, modales */
  --color-base-200: oklch(98% 0 0);         /* fondo de pagina */
  --color-base-300: oklch(95% 0 0);         /* bordes */
  --color-base-content: oklch(21% 0.006 285.885);

  --color-primary: oklch(50% 0.134 242.749);
  --color-primary-content: oklch(95% 0.026 236.824);
  /* secondary, accent, neutral, info, success, warning, error ... */

  --radius-selector: 1rem;
  --radius-field: 0.5rem;
  --radius-box: 0.5rem;
  --size-selector: 0.21875rem;
  --size-field: 0.21875rem;
  --border: 1px;
  --depth: 1;

  --font-roboto: "Roboto", sans-serif;
}`

const OSCURO = `@custom-variant dark (&:where(.dark, .dark *));

.dark {
  color-scheme: dark;

  /* La escala se invierte: la superficie queda mas clara que el fondo */
  --color-base-100: oklch(26% 0 0);
  --color-base-200: oklch(20% 0 0);
  --color-base-300: oklch(14% 0 0);
  --color-base-content: oklch(97.807% 0.029 256.847);
  /* el resto de tokens, con los mismos nombres */
}`

const PERSONALIZAR = `/* styles.css de tu aplicacion */
@import "@dnui/react/styles.css";

/* Tus valores ganan porque van despues */
@theme {
  --color-primary: oklch(58% 0.19 27);
  --radius-field: 0.75rem;
}`

const USO_HOOK = `import { useTheme } from '@dnui/react'

const Cabecera = () => {
  const { preference, resolved, set, toggle } = useTheme()

  return (
    <>
      <span>Aplicado: {resolved}</span>
      <button onClick={toggle}>Alternar</button>
      <button onClick={() => set('system')}>Seguir al sistema</button>
    </>
  )
}`

const ESCALA = [
  { name: '--color-base-100', use: 'Fondo de tarjetas, menus y modales' },
  { name: '--color-base-200', use: 'Fondo de pagina' },
  { name: '--color-base-300', use: 'Bordes y separadores' },
  { name: '--color-base-content', use: 'Texto principal' },
  { name: '--color-primary', use: 'Accion principal' },
  { name: '--color-neutral', use: 'Estado activo de menus' },
  { name: '--color-info / success / warning / error', use: 'Estados' },
  { name: '--color-brand-50 … 900', use: 'Escala de marca, para acentos propios' }
]

const Muestra = ({ token, className }: { token: string; className: string }) => (
  <div className="flex items-center gap-2">
    <span className={`inline-block w-8 h-8 rounded-field border border-base-300 ${className}`} />
    <code className="text-[12px]">{token}</code>
  </div>
)

export const Tema = () => {
  const { preference, resolved, set } = useTheme()

  return (
    <Page
      title="Tema y tokens"
      description="Los colores, radios y tamanos salen de variables CSS con la misma firma que daisyUI, pero definidas en la propia libreria. daisyUI no es una dependencia."
    >
      <Section title="Alternar el tema">
        <Example
          description="El tema aplicado se guarda en localStorage y la variante oscura se activa con la clase dark en el elemento raiz."
          code={USO_HOOK}
        >
          <ThemeToggle appearance="outline">
            {(actual) => <>Tema: {actual}</>}
          </ThemeToggle>
          <Button appearance="ghost" onClick={() => set('light')}>Claro</Button>
          <Button appearance="ghost" onClick={() => set('dark')}>Oscuro</Button>
          <Button appearance="ghost" onClick={() => set('system')}>Sistema</Button>
          <div className="w-full flex gap-2 text-sm">
            <Badge appearance="soft">preferencia: {preference}</Badge>
            <Badge appearance="soft" variant="info">aplicado: {resolved}</Badge>
          </div>
        </Example>
      </Section>

      <Section title="Paleta">
        <Card>
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-2">
              <Muestra token="--color-base-100" className="bg-base-100" />
              <Muestra token="--color-base-200" className="bg-base-200" />
              <Muestra token="--color-base-300" className="bg-base-300" />
              <Muestra token="--color-primary" className="bg-primary" />
              <Muestra token="--color-neutral" className="bg-neutral" />
              <Muestra token="--color-info" className="bg-info" />
              <Muestra token="--color-success" className="bg-success" />
              <Muestra token="--color-warning" className="bg-warning" />
              <Muestra token="--color-error" className="bg-error" />
              <Muestra token="--color-brand-500" className="bg-brand-500" />
            </div>
          </CardBody>
        </Card>
      </Section>

      <Section title="Que significa cada token">
        <PropsTable
          rows={ESCALA.map((item) => ({
            name: item.name,
            type: 'color',
            description: item.use
          }))}
        />
      </Section>

      <Section title="Definicion">
        <Prose>
          <p>
            Los tokens se declaran en un bloque <code>@theme</code> de Tailwind v4. Como{' '}
            <code>--color-*</code> y <code>--radius-*</code> son espacios de nombres de Tailwind,
            generan utilidades reales: <code>bg-base-100</code>, <code>text-base-content</code>,{' '}
            <code>rounded-box</code>. Eso es lo que consume el CSS de los componentes.
          </p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-6">
          <CodeBlock code={TOKENS} language="css" />
        </div>

        <Prose>
          <p>La variante oscura redefine los mismos tokens bajo la clase <code>dark</code>.</p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-4">
          <CodeBlock code={OSCURO} language="css" />
        </div>
      </Section>

      <Section title="Cambiar la paleta">
        <Prose>
          <p>
            Si importas la fuente del CSS, puedes redefinir cualquier token despues del import. No
            hace falta tocar la libreria.
          </p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-4">
          <CodeBlock code={PERSONALIZAR} language="css" />
        </div>

        <Note title="Diferencia con dn-ui">
          <p>
            El <code>theme.ts</code> de dn-ui pone <code>theme-dark</code> en{' '}
            <code>sessionStorage</code>. Aqui se usa la clase <code>dark</code> y{' '}
            <code>localStorage</code>, que es lo que el CSS necesita de verdad y lo que ya hacia el
            demo.
          </p>
        </Note>
      </Section>

      <Section title="API">
        <PropsTable
          of="useTheme()"
          rows={[
            { name: 'preference', type: "'light' | 'dark' | 'system'", description: 'Lo que eligio la persona.' },
            { name: 'resolved', type: "'light' | 'dark'", description: 'Lo que se esta pintando de verdad.' },
            { name: 'set', type: "(preference) => void", description: 'Cambia la preferencia y la guarda.' },
            { name: 'toggle', type: '() => void', description: 'Alterna entre claro y oscuro.' }
          ]}
        />

        <PropsTable
          of="<ThemeToggle />"
          rows={[
            { name: 'children', type: "(resolved) => ReactNode", default: 'icono', description: 'Contenido propio, recibe el tema aplicado.' },
            { name: 'lightLabel', type: 'string', default: "'Cambiar a tema claro'", description: 'Etiqueta accesible cuando el tema es oscuro.' },
            { name: 'darkLabel', type: 'string', default: "'Cambiar a tema oscuro'", description: 'Etiqueta accesible cuando el tema es claro.' },
            { name: 'variant, size, appearance…', type: 'ButtonVariantProps', description: 'Mismas props de estilo que Button.' }
          ]}
        />
      </Section>
    </Page>
  )
}
