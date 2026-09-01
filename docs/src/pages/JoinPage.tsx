import { useState } from 'react'
import { Button, Icon, Input, Join, Select } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const JoinPage = () => {
  const [vista, setVista] = useState('lista')

  return (
    <Page
      title="Join"
      description="Pega varios controles en un solo bloque: solo se redondean los extremos y los bordes interiores se solapan. Vale para cualquier mezcla de botones, inputs y selects."
      importFrom={`import { Join } from '@dnui/react'`}
    >
      <Section title="Como funciona">
        <Prose>
          <p>
            <code>join.css</code> reparte el redondeo con cuatro variables y espera la clase{' '}
            <code>join-item</code> <strong>en el propio control</strong>, no en un envoltorio — igual
            que daisyUI. <code>Join</code> se la pone sola a cada hijo, asi que basta con meterlos
            dentro.
          </p>
        </Prose>

        <Example
          code={`<Join>
  <Button appearance="outline">Uno</Button>
  <Button appearance="outline">Dos</Button>
  <Button appearance="outline">Tres</Button>
</Join>`}
        >
          <Join>
            <Button appearance="outline">Uno</Button>
            <Button appearance="outline">Dos</Button>
            <Button appearance="outline">Tres</Button>
          </Join>
        </Example>
      </Section>

      <Section title="Cualquier mezcla de controles">
        <Prose>
          <p>
            Todos los componentes de la libreria pasan su <code>className</code> al elemento final,
            asi que un select, un input y un boton se unen sin ajustes.
          </p>
        </Prose>

        <Example
          code={`<Join>
  <Input placeholder="Buscar" aria-label="Buscar" />
  <Button variant="primary">Buscar</Button>
</Join>

<Join>
  <Select aria-label="Prefijo" defaultValue="+51" className="w-24">
    <option>+51</option>
    <option>+34</option>
    <option>+52</option>
  </Select>
  <Input type="tel" placeholder="999 999 999" aria-label="Telefono" />
  <Button variant="primary" aria-label="Llamar">
    <Icon name="tick" />
  </Button>
</Join>

<Join>
  <Input type="number" defaultValue={0} aria-label="Importe" className="w-28" />
  <Button appearance="outline">USD</Button>
</Join>`}
          stack
        >
          <Join>
            <Input placeholder="Buscar" aria-label="Buscar" />
            <Button variant="primary">Buscar</Button>
          </Join>

          <Join>
            <Select aria-label="Prefijo" defaultValue="+51" className="w-24">
              <option>+51</option>
              <option>+34</option>
              <option>+52</option>
            </Select>
            <Input type="tel" placeholder="999 999 999" aria-label="Telefono" />
            <Button variant="primary" aria-label="Llamar">
              <Icon name="tick" />
            </Button>
          </Join>

          <Join>
            <Input type="number" defaultValue={0} aria-label="Importe" className="w-28" />
            <Button appearance="outline">USD</Button>
          </Join>
        </Example>
      </Section>

      <Section title="Vertical">
        <Example
          code={`<Join direction="vertical">
  <Button appearance="outline">Arriba</Button>
  <Button appearance="outline">Medio</Button>
  <Button appearance="outline">Abajo</Button>
</Join>`}
        >
          <Join direction="vertical">
            <Button appearance="outline">Arriba</Button>
            <Button appearance="outline">Medio</Button>
            <Button appearance="outline">Abajo</Button>
          </Join>
        </Example>
      </Section>

      <Section title="Como selector de vista">
        <Example
          description="Un uso frecuente: botones excluyentes que cambian una vista."
          code={`const [vista, setVista] = useState('lista')

<Join>
  {['lista', 'rejilla', 'tabla'].map((valor) => (
    <Button
      key={valor}
      appearance="outline"
      active={vista === valor}
      aria-pressed={vista === valor}
      onClick={() => setVista(valor)}
    >
      {valor}
    </Button>
  ))}
</Join>`}
          stack
        >
          <Join>
            {['lista', 'rejilla', 'tabla'].map((valor) => (
              <Button
                key={valor}
                appearance="outline"
                active={vista === valor}
                aria-pressed={vista === valor}
                onClick={() => setVista(valor)}
              >
                {valor}
              </Button>
            ))}
          </Join>
          <p className="text-sm text-base-content/70">Vista: {vista}</p>
        </Example>

        <Note title="Join o ToggleGroup">
          <p>
            Para una eleccion excluyente con semantica de formulario usa{' '}
            <code>ToggleGroup</code>: emite radios de verdad, se navega con las flechas y se envia
            con el formulario. <code>Join</code> es solo maquetacion.
          </p>
        </Note>
      </Section>

      <Section title="Poner la clase a mano">
        <Prose>
          <p>
            Con <code>autoItems={'{false}'}</code> el componente no toca a los hijos y la clase la
            pones tu. Hace falta cuando el control real va dentro de otro elemento: ahi{' '}
            <code>join-item</code> tiene que ir en el control, no en el envoltorio.
          </p>
        </Prose>

        <Example
          code={`<Join autoItems={false}>
  <Button className="join-item">Uno</Button>

  <Tooltip content="Va dentro de otro elemento">
    <Button className="join-item">Dos</Button>
  </Tooltip>
</Join>`}
        >
          <Join autoItems={false}>
            <Button appearance="outline" className="join-item">
              Uno
            </Button>
            <Button appearance="outline" className="join-item">
              Dos
            </Button>
          </Join>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Join />"
          rows={[
            { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Eje en el que se pegan los controles.' },
            { name: 'autoItems', type: 'boolean', default: 'true', description: 'Anade join-item a cada hijo. Es idempotente: si el hijo ya la trae, no se duplica.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div.' }
          ]}
        />

        <PropsTable
          of="JOIN_ITEM"
          rows={[
            { name: 'JOIN_ITEM', type: "'join-item'", description: 'La constante con el nombre de la clase, por si la compones tu.' }
          ]}
        />
      </Section>
    </Page>
  )
}
