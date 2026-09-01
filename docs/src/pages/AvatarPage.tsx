import { Avatar, Badge } from '@dnui/react'
import { Example } from '../ui/Example'
import { Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const PERSONAS = [
  { nombre: 'Ana Ruiz', iniciales: 'AR' },
  { nombre: 'Luis Paz', iniciales: 'LP' },
  { nombre: 'Sara Vera', iniciales: 'SV' }
]

export const AvatarPage = () => (
  <Page
    title="Avatar"
    description="Imagen de una persona o entidad, con las iniciales como respaldo cuando no hay foto."
    importFrom={`import { Avatar } from '@dnui/react'`}
  >
    <Section title="Con imagen y sin ella">
      <Example
        description="Si hay src se pinta la imagen; si no, las iniciales sobre el fondo de .avatar-text."
        code={`<Avatar src="/ana.jpg" alt="Ana Ruiz" />
<Avatar fallback="AR" />
<Avatar fallback="LP" />
<Avatar fallback="SV" />`}
      >
        <Avatar src="https://placehold.co/64/1a6baf/FFF?text=AR" alt="Ana Ruiz" />
        {PERSONAS.map((persona) => (
          <Avatar key={persona.nombre} fallback={persona.iniciales} />
        ))}
      </Example>
    </Section>

    <Section title="Tamano">
      <Prose>
        <p>
          El tamano base es <code>2rem</code>. Se cambia con clases de utilidad; el contenido se
          ajusta solo.
        </p>
      </Prose>
      <Example
        code={`<Avatar fallback="AR" className="w-6 h-6 text-xs" />
<Avatar fallback="AR" />
<Avatar fallback="AR" className="w-12 h-12" />
<Avatar fallback="AR" className="w-16 h-16 text-xl" />`}
      >
        <Avatar fallback="AR" className="w-6 h-6 text-xs" />
        <Avatar fallback="AR" />
        <Avatar fallback="AR" className="w-12 h-12" />
        <Avatar fallback="AR" className="w-16 h-16 text-xl" />
      </Example>
    </Section>

    <Section title="Forma">
      <Example
        description="El recorte sale de --radius-box. Con rounded-full queda circular."
        code={`<Avatar fallback="AR" className="rounded-full" />`}
      >
        <Avatar fallback="AR" className="w-12 h-12 rounded-full" />
        <Avatar
          src="https://placehold.co/96/185d9a/FFF?text=LP"
          alt="Luis Paz"
          className="w-12 h-12 rounded-full"
        />
        <Avatar fallback="SV" className="w-12 h-12 rounded-none" />
      </Example>
    </Section>

    <Section title="En grupo">
      <Example
        description="Solapados con margen negativo y un borde del color del fondo."
        code={`<div className="flex">
  {personas.map((p) => (
    <Avatar
      key={p.nombre}
      fallback={p.iniciales}
      className="w-9 h-9 rounded-full ring-2 ring-base-100 -ml-2 first:ml-0"
    />
  ))}
</div>`}
        stack
      >
        <div className="flex">
          {PERSONAS.map((persona) => (
            <Avatar
              key={persona.nombre}
              fallback={persona.iniciales}
              className="w-9 h-9 rounded-full ring-2 ring-base-100 -ml-2 first:ml-0"
            />
          ))}
          <span className="w-9 h-9 -ml-2 rounded-full ring-2 ring-base-100 bg-base-300 text-base-content flex items-center justify-center text-xs">
            +7
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Avatar fallback="AR" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-medium">Ana Ruiz</p>
            <p className="text-xs text-base-content/60">
              Administradora <Badge size="xs" variant="success" appearance="soft">activa</Badge>
            </p>
          </div>
        </div>
      </Example>
    </Section>

    <Section title="Contenido propio">
      <Example
        description="Cualquier hijo sustituye tanto a la imagen como a las iniciales."
        code={`<Avatar>
  <span className="avatar-text">
    <Icon name="group" />
  </span>
</Avatar>`}
      >
        <Avatar className="w-10 h-10 rounded-full">
          <span className="avatar-text">
            <span className="icon icon-group" aria-hidden="true" />
          </span>
        </Avatar>
      </Example>
    </Section>

    <Section title="API">
      <PropsTable
        of="<Avatar />"
        rows={[
          { name: 'src', type: 'string', description: 'Url de la imagen. Si se pasa, manda sobre fallback.' },
          { name: 'alt', type: 'string', default: "''", description: 'Texto alternativo. Dejalo vacio si el avatar es decorativo y el nombre ya esta al lado.' },
          { name: 'fallback', type: 'string', description: 'Iniciales que se muestran cuando no hay imagen.' },
          { name: 'children', type: 'ReactNode', description: 'Contenido propio, sustituye al respaldo.' },
          { name: '…rest', type: 'HTMLAttributes<HTMLSpanElement>', description: 'Todo lo demas va al span exterior.' }
        ]}
      />
    </Section>
  </Page>
)
