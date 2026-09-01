import { Button, ControlGroup, Icon, Input, Select } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

export const ControlGroupPage = () => (
  <Page
    title="ControlGroup"
    description="Un control con botones o etiquetas pegados a los lados. El redondeo interior se quita solo."
    importFrom={`import { ControlGroup } from '@dnui/react'`}
  >
    <Section title="Con boton a la derecha">
      <Example
        code={`<ControlGroup append={<Button variant="primary">Buscar</Button>}>
  <Input placeholder="Termino" aria-label="Termino" />
</ControlGroup>`}
        stack
      >
        <div className="w-96">
          <ControlGroup append={<Button variant="primary">Buscar</Button>}>
            <Input placeholder="Termino" aria-label="Termino" />
          </ControlGroup>
        </div>
      </Example>
    </Section>

    <Section title="Con contenido a la izquierda">
      <Example
        code={`<ControlGroup prepend={<Button appearance="outline">https://</Button>}>
  <Input placeholder="ejemplo.com" aria-label="Dominio" />
</ControlGroup>`}
        stack
      >
        <div className="w-96">
          <ControlGroup prepend={<Button appearance="outline">https://</Button>}>
            <Input placeholder="ejemplo.com" aria-label="Dominio" />
          </ControlGroup>
        </div>
      </Example>
    </Section>

    <Section title="A los dos lados">
      <Example
        code={`<ControlGroup
  prepend={<Button appearance="outline">$</Button>}
  append={<Button appearance="outline">USD</Button>}
>
  <Input type="number" aria-label="Importe" />
</ControlGroup>`}
        stack
      >
        <div className="w-96">
          <ControlGroup
            prepend={<Button appearance="outline">$</Button>}
            append={<Button appearance="outline">USD</Button>}
          >
            <Input type="number" defaultValue={0} aria-label="Importe" />
          </ControlGroup>
        </div>
      </Example>
    </Section>

    <Section title="Varios botones">
      <Prose>
        <p>
          El primero de <code>prepend</code> y el ultimo de <code>append</code> se redondean; los de
          en medio quedan rectos.
        </p>
      </Prose>
      <Example
        code={`<ControlGroup
  append={
    <>
      <Button appearance="outline"><Icon name="copy" /></Button>
      <Button appearance="outline"><Icon name="cut" /></Button>
      <Button variant="primary"><Icon name="save" /></Button>
    </>
  }
>
  <Input aria-label="Contenido" />
</ControlGroup>`}
        stack
      >
        <div className="w-96">
          <ControlGroup
            append={
              <>
                <Button appearance="outline" aria-label="Copiar">
                  <Icon name="copy" />
                </Button>
                <Button appearance="outline" aria-label="Cortar">
                  <Icon name="cut" />
                </Button>
                <Button variant="primary" aria-label="Guardar">
                  <Icon name="save" />
                </Button>
              </>
            }
          >
            <Input defaultValue="Contenido" aria-label="Contenido" />
          </ControlGroup>
        </div>
      </Example>
    </Section>

    <Section title="Con un select">
      <Example
        code={`<ControlGroup
  prepend={
    <Select aria-label="Prefijo" defaultValue="+51" className="w-24">
      <option>+51</option>
      <option>+34</option>
      <option>+52</option>
    </Select>
  }
>
  <Input type="tel" placeholder="999 999 999" aria-label="Telefono" />
</ControlGroup>`}
        stack
      >
        <div className="w-96">
          <ControlGroup
            prepend={
              <Select aria-label="Prefijo" defaultValue="+51" className="w-24">
                <option>+51</option>
                <option>+34</option>
                <option>+52</option>
              </Select>
            }
          >
            <Input type="tel" placeholder="999 999 999" aria-label="Telefono" />
          </ControlGroup>
        </div>
      </Example>
    </Section>

    <Section title="API">
      <PropsTable
        of="<ControlGroup />"
        rows={[
          { name: 'prepend', type: 'ReactNode', description: 'Contenido pegado a la izquierda del control.' },
          { name: 'append', type: 'ReactNode', description: 'Contenido pegado a la derecha del control.' },
          { name: 'children', type: 'ReactNode', description: 'El control central. Se lleva el espacio que sobra.' },
          { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div.' }
        ]}
      />

      <Note title="ControlGroup o Join">
        <p>
          <code>ControlGroup</code> asume un control central que crece y adornos a los lados.{' '}
          <code>Join</code> pega elementos del mismo peso. Si estas agrupando botones equivalentes,
          usa <code>Join</code>.
        </p>
      </Note>
    </Section>
  </Page>
)
