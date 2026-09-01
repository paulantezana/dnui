import { useState } from 'react'
import { Badge, Pagination, paginationSummary } from '@dnui/react'
import { CodeBlock } from '../ui/CodeBlock'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

const SERVIDOR = `const [consulta, setConsulta] = useState({ page: 1, limit: 20 })
const { data } = useQuery(['ventas', consulta], () => buscarVentas(consulta))

<Pagination
  result={data.result}      // { current, pages, limit, total }
  onChange={(page, limit) => setConsulta({ page, limit })}
/>`

export const PaginationPage = () => {
  const [pagina, setPagina] = useState(3)
  const [limite, setLimite] = useState(20)
  const total = 93

  const resumen = paginationSummary({
    current: pagina,
    pages: Math.max(1, Math.ceil(total / limite)),
    limit: limite,
    total
  })

  return (
    <Page
      title="Pagination"
      description="Primera, anterior, «Pagina X de Y», siguiente y ultima, con el selector de filas y el rango visible. Los cuatro botones llevan etiqueta accesible."
      importFrom={`import { Pagination } from '@dnui/react'`}
    >
      <Section title="Basico">
        <Prose>
          <p>
            El componente no guarda estado: recibe el bloque <code>result</code> que devuelve el
            backend y avisa con la pagina y el limite nuevos.
          </p>
        </Prose>
        <Example
          code={`const [pagina, setPagina] = useState(3)
const [limite, setLimite] = useState(20)

<Pagination
  result={{ current: pagina, pages: 5, limit: limite, total: 93 }}
  onChange={(nuevaPagina, nuevoLimite) => {
    setPagina(nuevaPagina)
    setLimite(nuevoLimite)
  }}
/>`}
          stack
        >
          <div className="w-full">
            <Pagination
              result={{ current: pagina, pages: resumen.pages, limit: limite, total }}
              onChange={(nuevaPagina, nuevoLimite) => {
                setPagina(nuevaPagina)
                setLimite(nuevoLimite)
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge appearance="soft">pagina: {resumen.page}</Badge>
            <Badge appearance="soft">limite: {resumen.limit}</Badge>
            <Badge appearance="soft">
              filas {resumen.startRow}–{resumen.endRow} de {resumen.total}
            </Badge>
          </div>
        </Example>
      </Section>

      <Section title="Cambiar el limite vuelve a la primera">
        <Prose>
          <p>
            Al elegir otro tamano de pagina, <code>onChange</code> se llama con{' '}
            <code>(1, nuevoLimite)</code>. Es lo que hace dn-ui, y evita quedarse en una pagina que
            ya no existe.
          </p>
        </Prose>
      </Section>

      <Section title="Tamanos de pagina">
        <Example
          description="Por defecto son los mismos ocho valores de dn-ui. Se pueden cambiar."
          code={`<Pagination
  result={{ current: 1, pages: 4, limit: 25, total: 93 }}
  limitOptions={[25, 50, 100]}
  onChange={(pagina, limite) => cargar(pagina, limite)}
/>`}
          stack
        >
          <div className="w-full">
            <Pagination
              result={{ current: 1, pages: 4, limit: 25, total }}
              limitOptions={[25, 50, 100]}
              onChange={() => {}}
            />
          </div>
        </Example>
      </Section>

      <Section title="Sin selector de filas">
        <Example
          code={`<Pagination
  result={{ current: 2, pages: 5, limit: 20, total: 93 }}
  hideLimit
  onChange={(pagina, limite) => cargar(pagina, limite)}
/>`}
          stack
        >
          <div className="w-full">
            <Pagination
              result={{ current: 2, pages: 5, limit: 20, total }}
              hideLimit
              onChange={() => {}}
            />
          </div>
        </Example>
      </Section>

      <Section title="Casos limite">
        <Example
          description="Con una sola pagina los cuatro botones quedan deshabilitados. Sin resultados el rango es «1 a 0 de 0», igual que en dn-ui."
          code={`{/* Una sola pagina: los cuatro botones quedan deshabilitados */}
<Pagination
  result={{ current: 1, pages: 1, limit: 20, total: 7 }}
  onChange={(pagina, limite) => cargar(pagina, limite)}
/>

{/* Sin resultados */}
<Pagination
  result={{ current: 1, pages: 1, limit: 20, total: 0 }}
  onChange={(pagina, limite) => cargar(pagina, limite)}
/>`}
          stack
        >
          <div className="w-full grid gap-4">
            <Pagination
              result={{ current: 1, pages: 1, limit: 20, total: 7 }}
              onChange={() => {}}
            />
            <Pagination
              result={{ current: 1, pages: 1, limit: 20, total: 0 }}
              onChange={() => {}}
            />
          </div>
        </Example>
      </Section>

      <Section title="Con datos del servidor">
        <Prose>
          <p>
            El bloque <code>result</code> tiene la misma forma que devuelve el backend de dn-ui, asi
            que se puede pasar tal cual.
          </p>
        </Prose>
        <div className="rounded-box overflow-hidden mb-4">
          <CodeBlock code={SERVIDOR} />
        </div>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Pagination />"
          rows={[
            { name: 'result', type: '{ current, pages, limit, total }', required: true, description: 'Los cuatro valores del backend. Aceptan numero o cadena.' },
            { name: 'onChange', type: '(page: number, limit: number) => void', required: true, description: 'Se llama con la pagina y el limite nuevos. Cambiar el limite manda page 1.' },
            { name: 'limitOptions', type: 'readonly number[]', default: '[10, 20, 50, 100, 200, 300, 500, 1000]', description: 'Tamanos de pagina del selector.' },
            { name: 'limitLabel', type: 'string', default: "'Filas por Pagina:'", description: 'Etiqueta del selector.' },
            { name: 'hideLimit', type: 'boolean', default: 'false', description: 'Oculta el selector de filas.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Todo lo demas va al div.' }
          ]}
        />

        <Note title="La aritmetica esta aparte">
          <p>
            El calculo del rango vive en <code>paginationSummary()</code>, una funcion pura del
            motor con sus propios tests. Puedes usarla sin pintar nada.
          </p>
        </Note>
      </Section>
    </Page>
  )
}
