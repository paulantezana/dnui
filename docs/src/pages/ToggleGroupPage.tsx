import { useState } from 'react'
import { Icon, ToggleGroup } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const ToggleGroupPage = () => {
  const [alineacion, setAlineacion] = useState('izquierda')
  const [periodo, setPeriodo] = useState('mes')

  return (
    <Page
      title="ToggleGroup"
      description="Botones excluyentes que por dentro son radios de verdad, asi que se envian con el formulario y se navegan con las flechas."
      importFrom={`import { ToggleGroup } from '@dnui/react'`}
    >
      <Section title="Basico">
        <Example
          code={`const [alineacion, setAlineacion] = useState('izquierda')

<ToggleGroup
  label="Alineacion"
  value={alineacion}
  onChange={setAlineacion}
  options={[
    { value: 'izquierda', label: 'Izquierda' },
    { value: 'centro', label: 'Centro' },
    { value: 'derecha', label: 'Derecha' }
  ]}
/>`}
          stack
        >
          <ToggleGroup
            label="Alineacion"
            value={alineacion}
            onChange={setAlineacion}
            options={[
              { value: 'izquierda', label: 'Izquierda' },
              { value: 'centro', label: 'Centro' },
              { value: 'derecha', label: 'Derecha' }
            ]}
          />
          <p className="text-sm text-base-content/70">Elegido: {alineacion}</p>
        </Example>
      </Section>

      <Section title="Estilo de los botones">
        <Prose>
          <p>
            <code>buttonProps</code> acepta las mismas props de estilo que <code>Button</code>.{' '}
            <code>toggle-group.css</code> define un estado activo especifico para{' '}
            <code>btn-outline</code>.
          </p>
        </Prose>
        <Example
          code={`<ToggleGroup
  label="Periodo compacto"
  defaultValue="mes"
  buttonProps={{ appearance: 'outline', size: 'sm' }}
  options={[
    { value: 'dia', label: 'Dia' },
    { value: 'semana', label: 'Semana' },
    { value: 'mes', label: 'Mes' }
  ]}
/>

<ToggleGroup
  label="Periodo grande"
  defaultValue="semana"
  buttonProps={{ appearance: 'outline', size: 'lg' }}
  options={[
    { value: 'dia', label: 'Dia' },
    { value: 'semana', label: 'Semana' },
    { value: 'mes', label: 'Mes' }
  ]}
/>`}
          stack
        >
          <ToggleGroup
            label="Periodo compacto"
            defaultValue="mes"
            buttonProps={{ appearance: 'outline', size: 'sm' }}
            options={[
              { value: 'dia', label: 'Dia' },
              { value: 'semana', label: 'Semana' },
              { value: 'mes', label: 'Mes' }
            ]}
          />
          <ToggleGroup
            label="Periodo grande"
            defaultValue="semana"
            buttonProps={{ appearance: 'outline', size: 'lg' }}
            options={[
              { value: 'dia', label: 'Dia' },
              { value: 'semana', label: 'Semana' },
              { value: 'mes', label: 'Mes' }
            ]}
          />
        </Example>
      </Section>

      <Section title="Con iconos">
        <Example
          code={`<ToggleGroup
  label="Vista"
  defaultValue="lista"
  buttonProps={{ appearance: 'outline', size: 'sm' }}
  options={[
    { value: 'lista', label: <><Icon name="menu" /> Lista</> },
    { value: 'rejilla', label: <><Icon name="columns" /> Rejilla</> },
    { value: 'tabla', label: <><Icon name="chart" /> Tabla</> }
  ]}
/>`}
          stack
        >
          <ToggleGroup
            label="Vista"
            defaultValue="lista"
            buttonProps={{ appearance: 'outline', size: 'sm' }}
            options={[
              {
                value: 'lista',
                label: (
                  <>
                    <Icon name="menu" /> Lista
                  </>
                )
              },
              {
                value: 'rejilla',
                label: (
                  <>
                    <Icon name="columns" /> Rejilla
                  </>
                )
              },
              {
                value: 'tabla',
                label: (
                  <>
                    <Icon name="chart" /> Tabla
                  </>
                )
              }
            ]}
          />
        </Example>
      </Section>

      <Section title="Opciones deshabilitadas">
        <Example
          code={`<ToggleGroup
  label="Rango"
  value={periodo}
  onChange={setPeriodo}
  buttonProps={{ appearance: 'outline', size: 'sm' }}
  options={[
    { value: 'mes', label: 'Mes' },
    { value: 'trimestre', label: 'Trimestre' },
    { value: 'ano', label: 'Ano', disabled: true }
  ]}
/>`}
          stack
        >
          <ToggleGroup
            label="Rango"
            value={periodo}
            onChange={setPeriodo}
            buttonProps={{ appearance: 'outline', size: 'sm' }}
            options={[
              { value: 'mes', label: 'Mes' },
              { value: 'trimestre', label: 'Trimestre' },
              { value: 'ano', label: 'Ano', disabled: true }
            ]}
          />
          <p className="text-sm text-base-content/70">Rango: {periodo}</p>
        </Example>
      </Section>

      <Section title="Sin controlar">
        <Prose>
          <p>
            Sin <code>value</code> el grupo se gestiona solo. <code>onChange</code> sigue avisando
            de cada cambio.
          </p>
        </Prose>
        <Example
          code={`<ToggleGroup
  label="Sin controlar"
  defaultValue="centro"
  buttonProps={{ appearance: 'outline', size: 'sm' }}
  options={[
    { value: 'izquierda', label: 'Izquierda' },
    { value: 'centro', label: 'Centro' },
    { value: 'derecha', label: 'Derecha' }
  ]}
/>`}
          stack
        >
          <ToggleGroup
            label="Sin controlar"
            defaultValue="centro"
            buttonProps={{ appearance: 'outline', size: 'sm' }}
            options={[
              { value: 'izquierda', label: 'Izquierda' },
              { value: 'centro', label: 'Centro' },
              { value: 'derecha', label: 'Derecha' }
            ]}
          />
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<ToggleGroup />"
          rows={[
            { name: 'options', type: 'ToggleGroupOption[]', required: true, description: 'Lista de opciones: { value, label, disabled? }.' },
            { name: 'value', type: 'string', description: 'Valor elegido. Si se pasa, el grupo queda controlado.' },
            { name: 'defaultValue', type: 'string', description: 'Valor inicial cuando no esta controlado.' },
            { name: 'onChange', type: '(value: string) => void', description: 'Se llama con el nuevo valor.' },
            { name: 'name', type: 'string', default: 'generado', description: 'Nombre compartido de los radios. Ponlo si vas a enviar el formulario.' },
            { name: 'label', type: 'string', description: 'Nombre accesible del grupo.' },
            { name: 'buttonProps', type: 'ButtonVariantProps', description: 'Estilo de los botones: variant, size, appearance…' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div con role="group".' }
          ]}
        />

        <Note title="Por que radios y no botones">
          <p>
            <code>toggle-group.css</code> pinta el estado activo con{' '}
            <code>input:checked + .btn</code>. Usar radios de verdad da gratis el recorrido con
            flechas, el envio del formulario y el anuncio correcto en un lector de pantalla.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
