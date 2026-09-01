import { useState } from 'react'
import { Checkbox, FormItem, Radio, Switch } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const TogglePage = () => {
  const [notificar, setNotificar] = useState(true)
  const [envio, setEnvio] = useState('estandar')
  const [permisos, setPermisos] = useState<string[]>(['leer'])

  const alternarPermiso = (permiso: string) =>
    setPermisos((prev) =>
      prev.includes(permiso) ? prev.filter((p) => p !== permiso) : [...prev, permiso]
    )

  return (
    <Page
      title="Toggle"
      description="Casilla, radio e interruptor. toggle.css estiliza directamente los inputs nativos, asi que se comportan como tales: teclado, formularios y validacion incluidos."
      importFrom={`import { Checkbox, Radio, Switch } from '@dnui/react'`}
    >
      <Section title="Los tres">
        <Example
          code={`<label><Checkbox /> Acepto los terminos</label>
<label><Radio name="envio" /> Envio estandar</label>
<label><Switch /> Recibir avisos</label>`}
          stack
        >
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked /> Casilla
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Radio name="ej-radio" defaultChecked /> Radio
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch defaultChecked /> Interruptor
          </label>
        </Example>
      </Section>

      <Section title="Estados">
        <Example
          code={`<Checkbox disabled />
<Checkbox disabled defaultChecked />`}
          stack
        >
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox /> sin marcar
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked /> marcada
            </label>
            <label className="flex items-center gap-2 text-sm opacity-60">
              <Checkbox disabled /> deshabilitada
            </label>
            <label className="flex items-center gap-2 text-sm opacity-60">
              <Checkbox disabled defaultChecked /> deshabilitada y marcada
            </label>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch /> apagado
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch defaultChecked /> encendido
            </label>
            <label className="flex items-center gap-2 text-sm opacity-60">
              <Switch disabled defaultChecked /> deshabilitado
            </label>
          </div>
        </Example>
      </Section>

      <Section title="Indeterminada">
        <Prose>
          <p>
            El estado intermedio no es un atributo HTML, solo existe como propiedad del elemento.
            Se aplica con una ref o con el callback de ref.
          </p>
        </Prose>
        <Example
          code={`<Checkbox
  ref={(el) => { if (el) el.indeterminate = true }}
  aria-checked="mixed"
/>`}
          stack
        >
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              ref={(el) => {
                if (el) el.indeterminate = true
              }}
              aria-checked="mixed"
            />
            Seleccionar todo (parcial)
          </label>
        </Example>
      </Section>

      <Section title="Controlados">
        <Example
          description="Son inputs normales: value, checked y onChange funcionan como esperas."
          code={`const [notificar, setNotificar] = useState(true)

<Switch
  checked={notificar}
  onChange={(e) => setNotificar(e.target.checked)}
/>`}
          stack
        >
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={notificar} onChange={(event) => setNotificar(event.target.checked)} />
            Recibir avisos por correo
          </label>
          <p className="text-sm text-base-content/70">
            Estado: {notificar ? 'activado' : 'desactivado'}
          </p>
        </Example>
      </Section>

      <Section title="Grupo de radios">
        <Prose>
          <p>
            El <code>name</code> compartido es lo que los hace excluyentes. Envuelvelos en un{' '}
            <code>fieldset</code> con <code>legend</code> para que el grupo tenga nombre.
          </p>
        </Prose>
        <Example
          code={`<fieldset>
  <legend>Tipo de envio</legend>
  {opciones.map((opcion) => (
    <label key={opcion.valor}>
      <Radio
        name="envio"
        value={opcion.valor}
        checked={envio === opcion.valor}
        onChange={() => setEnvio(opcion.valor)}
      />
      {opcion.etiqueta}
    </label>
  ))}
</fieldset>`}
          stack
        >
          <fieldset className="border border-base-300 rounded-box p-4">
            <legend className="px-2 text-sm font-medium">Tipo de envio</legend>
            <div className="grid gap-2">
              {[
                { valor: 'estandar', etiqueta: 'Estandar (3-5 dias)' },
                { valor: 'express', etiqueta: 'Express (24 h)' },
                { valor: 'recoger', etiqueta: 'Recoger en tienda' }
              ].map((opcion) => (
                <label key={opcion.valor} className="flex items-center gap-2 text-sm">
                  <Radio
                    name="ej-envio"
                    value={opcion.valor}
                    checked={envio === opcion.valor}
                    onChange={() => setEnvio(opcion.valor)}
                  />
                  {opcion.etiqueta}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="text-sm text-base-content/70">Elegido: {envio}</p>
        </Example>
      </Section>

      <Section title="Grupo de casillas">
        <Example
          code={`const [permisos, setPermisos] = useState(['leer'])

const alternar = (permiso) =>
  setPermisos((prev) =>
    prev.includes(permiso) ? prev.filter((p) => p !== permiso) : [...prev, permiso]
  )

<fieldset>
  <legend>Permisos</legend>

  {['leer', 'escribir', 'borrar'].map((permiso) => (
    <label key={permiso} className="flex items-center gap-2 text-sm">
      <Checkbox
        checked={permisos.includes(permiso)}
        onChange={() => alternar(permiso)}
      />
      {permiso}
    </label>
  ))}
</fieldset>`}
          stack
        >
          <fieldset className="border border-base-300 rounded-box p-4">
            <legend className="px-2 text-sm font-medium">Permisos</legend>
            <div className="grid gap-2">
              {['leer', 'escribir', 'borrar'].map((permiso) => (
                <label key={permiso} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={permisos.includes(permiso)}
                    onChange={() => alternarPermiso(permiso)}
                  />
                  {permiso}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="text-sm text-base-content/70">
            Concedidos: {permisos.join(', ') || 'ninguno'}
          </p>
        </Example>
      </Section>

      <Section title="Dentro de un campo">
        <Example
          code={`<FormItem help="Podras cambiarlo mas adelante">
  <label>
    <Checkbox /> Acepto los terminos
  </label>
</FormItem>`}
          stack
        >
          <div className="w-80">
            <FormItem help="Podras cambiarlo mas adelante">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox /> Acepto los terminos
              </label>
            </FormItem>
          </div>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Checkbox /> · <Radio /> · <Switch />"
          rows={[
            { name: '…rest', type: 'InputHTMLAttributes sin type', description: 'Son inputs nativos. Acepta checked, defaultChecked, disabled, name, value, onChange y todo lo demas.' }
          ]}
        />

        <Note title="Que anade cada uno">
          <p>
            <code>Checkbox</code> pone <code>type="checkbox"</code>. <code>Radio</code> pone{' '}
            <code>type="radio"</code>. <code>Switch</code> pone <code>type="checkbox"</code>, la
            clase <code>switch</code> y <code>role="switch"</code>. Nada mas: el estilo lo hace el
            CSS sobre el input nativo.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
