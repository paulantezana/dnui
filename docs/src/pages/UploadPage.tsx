import { useEffect, useState } from 'react'
import { Button, FormItem, Upload } from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

/** Libera la url temporal al cambiar de archivo o al desmontar. */
const useObjectUrl = () => {
  const [url, setUrl] = useState<string>()

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url)
  }, [url])

  return [url, (file: File | null) => setUrl(file ? URL.createObjectURL(file) : undefined)] as const
}

export const UploadPage = () => {
  const [cuadrada, setCuadrada] = useObjectUrl()
  const [circular, setCircular] = useObjectUrl()

  return (
    <Page
      title="Upload"
      description="Subida de una imagen con vista previa. Sin imagen muestra el area punteada; con imagen, la foto y una capa al pasar el raton."
      importFrom={`import { Upload } from '@dnui/react'`}
    >
      <Section title="Basico">
        <Prose>
          <p>
            El componente no sube nada: te entrega el <code>File</code> y tu decides. La vista previa
            la controlas con <code>value</code>.
          </p>
        </Prose>
        <Example
          code={`const [imagen, setImagen] = useState<string>()

<Upload
  value={imagen}
  onFileChange={(file) => setImagen(file ? URL.createObjectURL(file) : undefined)}
/>`}
          stack
        >
          <div className="w-64">
            <Upload value={cuadrada} onFileChange={setCuadrada} />
          </div>
          {cuadrada && (
            <Button size="sm" appearance="ghost" onClick={() => setCuadrada(null)}>
              Quitar
            </Button>
          )}
        </Example>
      </Section>

      <Section title="Circular">
        <Example
          description="Para fotos de perfil."
          code={`const [foto, setFoto] = useState<string>()

<Upload
  circle
  value={foto}
  onFileChange={(file) => setFoto(file ? URL.createObjectURL(file) : undefined)}
/>`}
          stack
        >
          <div className="w-32">
            <Upload circle value={circular} onFileChange={setCircular} />
          </div>
        </Example>
      </Section>

      <Section title="Textos propios">
        <Example
          code={`<Upload
  label="Arrastra el logotipo"
  overlayLabel="Reemplazar"
  accept="image/png,image/svg+xml"
/>`}
          stack
        >
          <div className="w-64">
            <Upload
              label="Arrastra el logotipo"
              overlayLabel="Reemplazar"
              accept="image/png,image/svg+xml"
            />
          </div>
        </Example>
      </Section>

      <Section title="Dentro de un campo">
        <Example
          code={`<FormItem label="Foto de perfil" help="PNG o JPG, maximo 2 MB">
  <Upload circle />
</FormItem>`}
          stack
        >
          <div className="w-40">
            <FormItem label="Foto de perfil" help="PNG o JPG, maximo 2 MB">
              <Upload circle />
            </FormItem>
          </div>
        </Example>
      </Section>

      <Section title="Subir de verdad">
        <Prose>
          <p>
            El patron habitual: guardas una url temporal para la vista previa y mandas el archivo a
            tu servidor. Acuerdate de liberar la url al desmontar.
          </p>
        </Prose>
        <Example
          openByDefault
          code={`const subir = async (file: File | null) => {
  if (!file) return

  setPrevia(URL.createObjectURL(file))

  const cuerpo = new FormData()
  cuerpo.append('archivo', file)

  const respuesta = await fetch('/api/avatar', { method: 'POST', body: cuerpo })
  if (!respuesta.ok) message.danger('No se pudo subir la imagen')
}

useEffect(() => () => {
  if (previa) URL.revokeObjectURL(previa)
}, [previa])

<Upload circle value={previa} onFileChange={subir} />`}
        >
          <p className="text-sm text-base-content/70">
            Solo el codigo: no hay ningun servidor detras de esta pagina.
          </p>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Upload />"
          rows={[
            { name: 'value', type: 'string', description: 'Url de la imagen actual. Si hay, se muestra la vista previa en lugar del area vacia.' },
            { name: 'onFileChange', type: '(file: File | null, event) => void', description: 'Se llama al elegir un archivo.' },
            { name: 'circle', type: 'boolean', default: 'false', description: 'Recorte circular.' },
            { name: 'label', type: 'ReactNode', default: "'Subir imagen'", description: 'Texto del area vacia.' },
            { name: 'overlayLabel', type: 'ReactNode', default: "'Cambiar'", description: 'Texto de la capa sobre la imagen.' },
            { name: 'alt', type: 'string', default: "''", description: 'Texto alternativo de la vista previa.' },
            { name: 'accept', type: 'string', default: "'image/*'", description: 'Tipos aceptados.' },
            { name: '…rest', type: 'InputHTMLAttributes sin type ni onChange', description: 'Todo lo demas va al input de archivo, que esta oculto.' }
          ]}
        />

        <Note title="Solo imagenes">
          <p>
            El markup de <code>upload.css</code> esta pensado para una imagen con vista previa. Para
            archivos genericos o subida multiple hace falta otro componente.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
