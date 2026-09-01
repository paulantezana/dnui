import { useState } from 'react'
import {
  Button,
  Form,
  FormHelp,
  FormItem,
  FormLabel,
  Icon,
  Input,
  PasswordInput,
  Select,
  Textarea
} from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const TAMANOS = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export const FormPage = () => {
  const [correo, setCorreo] = useState('')
  const [enviado, setEnviado] = useState(false)

  const correoValido = correo.includes('@')
  const estado = enviado && !correoValido ? 'danger' : undefined

  return (
    <Page
      title="Form"
      description="El campo y sus controles: etiqueta, ayuda, estados de validacion y las tres variantes de etiqueta que trae form.css."
      importFrom={`import {
  Form, FormItem, FormLabel, FormHelp,
  Input, PasswordInput, Textarea, Select
} from '@dnui/react'`}
    >
      <Section title="Un campo">
        <Prose>
          <p>
            <code>FormItem</code> compone la etiqueta, el control y la ayuda en el orden correcto, y
            se encarga de las clases de estado. Pasa <code>htmlFor</code> con el mismo{' '}
            <code>id</code> del control para enlazarlos.
          </p>
        </Prose>
        <Example
          code={`<FormItem label="Correo" htmlFor="correo" help="Te enviaremos la confirmacion">
  <Input id="correo" type="email" placeholder="ana@ejemplo.com" />
</FormItem>`}
          stack
        >
          <div className="w-80">
            <FormItem label="Correo" htmlFor="ej-correo" help="Te enviaremos la confirmacion">
              <Input id="ej-correo" type="email" placeholder="ana@ejemplo.com" />
            </FormItem>
          </div>
        </Example>
      </Section>

      <Section title="Obligatorio y estados">
        <Example
          description="required pinta el asterisco en la etiqueta. status tine el borde, la etiqueta y la ayuda."
          code={`<FormItem label="Correo" required htmlFor="a">
  <Input id="a" />
</FormItem>

<FormItem label="Correo" status="danger" help="No es un correo valido" htmlFor="b">
  <Input id="b" defaultValue="ana@" aria-invalid />
</FormItem>

<FormItem label="Correo" status="success" help="Disponible" htmlFor="c">
  <Input id="c" defaultValue="ana@ejemplo.com" />
</FormItem>`}
          stack
        >
          <div className="w-80 grid gap-1">
            <FormItem label="Obligatorio" required htmlFor="ej-req">
              <Input id="ej-req" />
            </FormItem>
            <FormItem label="Con error" status="danger" help="No es un correo valido" htmlFor="ej-err">
              <Input id="ej-err" defaultValue="ana@" aria-invalid />
            </FormItem>
            <FormItem label="Correcto" status="success" help="Disponible" htmlFor="ej-ok">
              <Input id="ej-ok" defaultValue="ana@ejemplo.com" />
            </FormItem>
          </div>
        </Example>
      </Section>

      <Section title="Variantes de etiqueta">
        <Prose>
          <p>
            <code>inner</code> mete la etiqueta dentro del control. <code>outlined</code> la flota
            sobre el borde y sube al escribir — para eso la etiqueta tiene que ir{' '}
            <em>despues</em> del control en el DOM, y de eso se encarga <code>FormItem</code>.
          </p>
        </Prose>
        <Example
          code={`<FormItem label="Buscar" variant="inner" htmlFor="a">
  <Input id="a" size="sm" />
</FormItem>

{/* La etiqueta flota: necesita placeholder=" " */}
<FormItem label="Nombre" variant="outlined" htmlFor="b">
  <Input id="b" placeholder=" " />
</FormItem>`}
          stack
        >
          <div className="w-80 grid gap-3">
            <FormItem label="Buscar" variant="inner" htmlFor="ej-inner">
              <Input id="ej-inner" size="sm" />
            </FormItem>
            <FormItem label="Nombre" variant="outlined" htmlFor="ej-outlined">
              <Input id="ej-outlined" placeholder=" " />
            </FormItem>
          </div>
        </Example>

        <Note title="outlined necesita un placeholder">
          <p>
            La etiqueta sube con el selector <code>:not(:placeholder-shown)</code>. Sin un{' '}
            <code>placeholder</code> — aunque sea un espacio — el navegador nunca considera el campo
            «con placeholder visible» y la etiqueta no se mueve.
          </p>
        </Note>
      </Section>

      <Section title="Tamanos">
        <Example
          code={`<Input size="xs" placeholder="xs" aria-label="xs" />
<Input size="sm" placeholder="sm" aria-label="sm" />
<Input size="md" placeholder="md" aria-label="md" />
<Input size="lg" placeholder="lg" aria-label="lg" />
<Input size="xl" placeholder="xl" aria-label="xl" />`}
          stack
        >
          <div className="w-80 grid gap-2">
            {TAMANOS.map((size) => (
              <Input key={size} size={size} placeholder={size} aria-label={size} />
            ))}
          </div>
        </Example>
      </Section>

      <Section title="Prefijo y sufijo">
        <Prose>
          <p>
            Se colocan sobre el control y el hueco se reserva solo. Si pasas alguno, el input recibe
            ademas la clase <code>control</code>, que es la que activa ese relleno.
          </p>
        </Prose>
        <Example
          code={`<Input prefix={<Icon name="filter" />} placeholder="Buscar" />
<Input suffix={<span>kg</span>} type="number" />
<Input prefix={<span>$</span>} suffix={<span>USD</span>} />`}
          stack
        >
          <div className="w-80 grid gap-2">
            <Input prefix={<Icon name="filter" />} placeholder="Buscar" aria-label="Buscar" />
            <Input suffix={<span className="text-xs">kg</span>} type="number" aria-label="Peso" />
            <Input
              prefix={<span className="text-xs">$</span>}
              suffix={<span className="text-xs">USD</span>}
              aria-label="Importe"
            />
          </div>
        </Example>
      </Section>

      <Section title="Contrasena">
        <Prose>
          <p>
            Es la unica logica que dn-ui tiene en <code>form.ts</code>: alternar entre{' '}
            <code>password</code> y <code>text</code>. Alli se hacia mutando el DOM desde un
            hermano; aqui es estado, y el boton lleva <code>aria-pressed</code> y{' '}
            <code>aria-controls</code>.
          </p>
        </Prose>
        <Example
          code={`<FormItem label="Contrasena" htmlFor="clave">
  <PasswordInput id="clave" />
</FormItem>`}
          stack
        >
          <div className="w-80">
            <FormItem label="Contrasena" htmlFor="ej-clave">
              <PasswordInput id="ej-clave" defaultValue="secreto" />
            </FormItem>
          </div>
        </Example>
      </Section>

      <Section title="Textarea y select">
        <Example
          code={`<FormItem label="Notas" htmlFor="notas">
  <Textarea id="notas" rows={3} />
</FormItem>

<FormItem label="Pais" htmlFor="pais">
  <Select id="pais" defaultValue="pe">
    <option value="pe">Peru</option>
    <option value="es">Espana</option>
  </Select>
</FormItem>`}
          stack
        >
          <div className="w-80 grid gap-1">
            <FormItem label="Notas" htmlFor="ej-notas">
              <Textarea id="ej-notas" rows={3} placeholder="Escribe aqui" />
            </FormItem>
            <FormItem label="Pais" htmlFor="ej-pais">
              <Select id="ej-pais" defaultValue="pe">
                <option value="pe">Peru</option>
                <option value="es">Espana</option>
                <option value="mx">Mexico</option>
              </Select>
            </FormItem>
          </div>
        </Example>

        <Note title="Textarea usa controlSize">
          <p>
            <code>size</code> ya existe como atributo nativo de <code>textarea</code> con otro
            significado, asi que el tamano visual se pasa como <code>controlSize</code>.
          </p>
        </Note>
      </Section>

      <Section title="Un formulario entero">
        <Example
          description="Validacion propia: el componente no valida nada, solo refleja el estado que le pases."
          code={`const [correo, setCorreo] = useState('')
const [enviado, setEnviado] = useState(false)
const valido = correo.includes('@')

<Form onSubmit={(e) => { e.preventDefault(); setEnviado(true) }}>
  <FormItem
    label="Correo"
    required
    htmlFor="correo"
    status={enviado && !valido ? 'danger' : undefined}
    help={enviado && !valido ? 'Falta la arroba' : 'Usaremos este correo para avisarte'}
  >
    <Input
      id="correo"
      value={correo}
      aria-invalid={enviado && !valido}
      onChange={(e) => setCorreo(e.target.value)}
    />
  </FormItem>

  <Button type="submit" variant="primary">Enviar</Button>
</Form>`}
          stack
        >
          <Form
            className="w-80"
            onSubmit={(event) => {
              event.preventDefault()
              setEnviado(true)
            }}
          >
            <FormItem
              label="Correo"
              required
              htmlFor="ej-form-correo"
              status={estado}
              help={estado ? 'Falta la arroba' : 'Usaremos este correo para avisarte'}
            >
              <Input
                id="ej-form-correo"
                value={correo}
                aria-invalid={estado === 'danger'}
                aria-describedby="ej-form-correo-help"
                onChange={(event) => setCorreo(event.target.value)}
              />
            </FormItem>

            <Button type="submit" variant="primary">
              Enviar
            </Button>
          </Form>
        </Example>
      </Section>

      <Section title="Sin FormItem">
        <Prose>
          <p>
            Las piezas tambien se exportan sueltas, por si necesitas otra disposicion.
          </p>
        </Prose>
        <Example
          code={`<FormLabel htmlFor="x">Etiqueta suelta</FormLabel>
<Input id="x" />
<FormHelp>Ayuda suelta</FormHelp>`}
          stack
        >
          <div className="w-80">
            <FormLabel htmlFor="ej-suelto">Etiqueta suelta</FormLabel>
            <Input id="ej-suelto" />
            <FormHelp>Ayuda suelta</FormHelp>
          </div>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<FormItem />"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Etiqueta del campo.' },
            { name: 'htmlFor', type: 'string', description: 'Id del control. Enlaza la etiqueta y genera el id de la ayuda.' },
            { name: 'help', type: 'ReactNode', description: 'Texto de ayuda bajo el control.' },
            { name: 'required', type: 'boolean', default: 'false', description: 'Pinta el asterisco en la etiqueta.' },
            { name: 'status', type: "'danger' | 'success'", description: 'Tine borde, etiqueta y ayuda.' },
            { name: 'variant', type: "'default' | 'inner' | 'outlined'", default: "'default'", description: 'Colocacion de la etiqueta. Con outlined la etiqueta se pinta despues del control.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Anade la clase disabled al contenedor.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div.' }
          ]}
        />

        <PropsTable
          of="<Input />"
          rows={[
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: 'Alto del control.' },
            { name: 'prefix', type: 'ReactNode', description: 'Contenido sobre el borde izquierdo.' },
            { name: 'suffix', type: 'ReactNode', description: 'Contenido sobre el borde derecho.' },
            { name: '…rest', type: 'InputHTMLAttributes', description: 'Todo lo demas va al input.' }
          ]}
        />

        <PropsTable
          of="<PasswordInput />"
          rows={[
            { name: 'showLabel', type: 'string', default: "'Mostrar contrasena'", description: 'Etiqueta accesible del boton cuando el texto esta oculto.' },
            { name: 'hideLabel', type: 'string', default: "'Ocultar contrasena'", description: 'Etiqueta accesible cuando el texto es visible.' },
            { name: '…rest', type: 'InputProps sin type ni suffix', description: 'El resto de props de Input.' }
          ]}
        />

        <PropsTable
          of="Otros"
          rows={[
            { name: 'Textarea', type: '{ controlSize?: Size }', description: 'El tamano visual se llama controlSize para no chocar con el atributo nativo.' },
            { name: 'Select', type: '{ size?: Size }', description: 'Select con las clases del control.' },
            { name: 'Form', type: '{ horizontal?: boolean }', description: 'Envoltorio con la clase form. La variante horizontal esta comentada en form.css.' },
            { name: 'ControlWrapper', type: '{ prefix?, suffix? }', description: 'La pieza que usa Input por dentro, expuesta por si la necesitas.' }
          ]}
        />
      </Section>
    </Page>
  )
}
