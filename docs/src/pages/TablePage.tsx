import { useMemo, useState } from 'react'
import {
  Badge,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
  formatNumber
} from '@dnui/react'
import { Example } from '../ui/Example'
import { Note, Page, Prose, Section } from '../ui/Page'
import { PropsTable } from '../ui/PropsTable'

interface Venta {
  id: number
  cliente: string
  estado: 'Emitido' | 'Pendiente' | 'Anulado'
  total: number
}

const VENTAS: Venta[] = [
  { id: 1, cliente: 'Ana Ruiz', estado: 'Emitido', total: 1250.5 },
  { id: 2, cliente: 'Luis Paz', estado: 'Pendiente', total: 340 },
  { id: 3, cliente: 'Sara Vera', estado: 'Anulado', total: 890.75 },
  { id: 4, cliente: 'Marco Diaz', estado: 'Emitido', total: 2100 },
  { id: 5, cliente: 'Elena Soto', estado: 'Emitido', total: 55.2 },
  { id: 6, cliente: 'Pablo Nieto', estado: 'Pendiente', total: 1799.99 },
  { id: 7, cliente: 'Rosa Lima', estado: 'Emitido', total: 430 }
]

const COLOR: Record<Venta['estado'], 'success' | 'warning' | 'error'> = {
  Emitido: 'success',
  Pendiente: 'warning',
  Anulado: 'error'
}

export const TablePage = () => {
  const [orden, setOrden] = useState<{ campo: keyof Venta; dir: 'asc' | 'desc' }>({
    campo: 'id',
    dir: 'asc'
  })
  const [pagina, setPagina] = useState(1)
  const [limite, setLimite] = useState(10)

  const ordenadas = useMemo(() => {
    const copia = [...VENTAS]
    copia.sort((a, b) => {
      const x = a[orden.campo]
      const y = b[orden.campo]
      const cmp = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))
      return orden.dir === 'asc' ? cmp : -cmp
    })
    return copia
  }, [orden])

  const visibles = ordenadas.slice((pagina - 1) * limite, pagina * limite)
  const suma = visibles.reduce((total, venta) => total + venta.total, 0)

  const alternar = (campo: keyof Venta) =>
    setOrden((prev) =>
      prev.campo === campo ? { campo, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { campo, dir: 'asc' }
    )

  return (
    <Page
      title="Table"
      description="Tabla estatica sobre las clases de table.css: cabecera y pie pegajosos, filas con estados y un envoltorio con scroll propio."
      importFrom={`import {
  Table, TableHead, TableBody, TableFoot, TableRow, TableCell, TableHeaderCell
} from '@dnui/react'`}
    >
      <Note variant="warning" title="Esto no es el data grid">
        <p>
          Es solo presentacion. La tabla con paginacion por servidor, filtros anidados, orden,
          seleccion y columnas configurables — las 1298 lineas de <code>table.ts</code> en dn-ui —
          es la segunda etapa y llegara como <code>DataGrid</code>, con su motor en{' '}
          <code>core/table</code>.
        </p>
      </Note>

      <Section title="Basica">
        <Example
          code={`const VENTAS = [
  { id: 1, cliente: 'Ana Ruiz', estado: 'Emitido', total: 1250.5 },
  { id: 2, cliente: 'Luis Paz', estado: 'Pendiente', total: 340 },
  { id: 3, cliente: 'Sara Vera', estado: 'Anulado', total: 890.75 }
]

<Table>
  <TableHead>
    <TableRow>
      <TableHeaderCell className="text-left">Cliente</TableHeaderCell>
      <TableHeaderCell className="text-left">Estado</TableHeaderCell>
      <TableHeaderCell className="text-right">Total</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {VENTAS.map((venta) => (
      <TableRow key={venta.id}>
        <TableCell>{venta.cliente}</TableCell>
        <TableCell>{venta.estado}</TableCell>
        <TableCell className="text-right">{formatNumber(venta.total)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
          stack
        >
          <div className="w-full">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="text-left">Cliente</TableHeaderCell>
                  <TableHeaderCell className="text-left">Estado</TableHeaderCell>
                  <TableHeaderCell className="text-right">Total</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {VENTAS.slice(0, 3).map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell>{venta.cliente}</TableCell>
                    <TableCell>{venta.estado}</TableCell>
                    <TableCell className="text-right">{formatNumber(venta.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Example>
      </Section>

      <Section title="Estados de fila">
        <Prose>
          <p>
            <code>disabled</code> atenua la fila y bloquea el puntero; <code>deleted</code> tacha el
            contenido. Son los dos modificadores que define <code>table.css</code>.
          </p>
        </Prose>
        <Example
          code={`<Table>
  <TableHead>
    <TableRow>
      <TableHeaderCell className="text-left">Cliente</TableHeaderCell>
      <TableHeaderCell className="text-left">Estado</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Normal</TableCell>
      <TableCell>Emitido</TableCell>
    </TableRow>
    <TableRow deleted>
      <TableCell>Tachada</TableCell>
      <TableCell>Anulado</TableCell>
    </TableRow>
    <TableRow disabled>
      <TableCell>Deshabilitada</TableCell>
      <TableCell>Bloqueado</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
          stack
        >
          <div className="w-full">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="text-left">Cliente</TableHeaderCell>
                  <TableHeaderCell className="text-left">Estado</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Normal</TableCell>
                  <TableCell>Emitido</TableCell>
                </TableRow>
                <TableRow deleted>
                  <TableCell>Tachada</TableCell>
                  <TableCell>Anulado</TableCell>
                </TableRow>
                <TableRow disabled>
                  <TableCell>Deshabilitada</TableCell>
                  <TableCell>Bloqueado</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Example>
      </Section>

      <Section title="Orden y pie">
        <Prose>
          <p>
            <code>TableHeaderCell</code> traduce <code>sort</code> a <code>aria-sort</code>, que es
            lo que anuncia un lector de pantalla. El orden lo aplicas tu.
          </p>
        </Prose>
        <Example
          description="Pulsa una cabecera para ordenar. El pie suma solo lo que se ve, igual que hace dn-ui."
          code={`const [orden, setOrden] = useState({ campo: 'id', dir: 'asc' })

const alternar = (campo) =>
  setOrden((prev) =>
    prev.campo === campo
      ? { campo, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { campo, dir: 'asc' }
  )

const visibles = ordenadas.slice((pagina - 1) * limite, pagina * limite)
const suma = visibles.reduce((total, venta) => total + venta.total, 0)

<Table>
  <TableHead>
    <TableRow>
      {['id', 'cliente', 'estado', 'total'].map((campo) => (
        <TableHeaderCell
          key={campo}
          sort={orden.campo === campo ? orden.dir : null}
          className={campo === 'total' ? 'text-right' : 'text-left'}
        >
          <button type="button" onClick={() => alternar(campo)}>
            {campo}
            {orden.campo === campo && (
              <span className={\`icon icon-\${orden.dir === 'asc' ? 'asc' : 'desc'}\`} />
            )}
          </button>
        </TableHeaderCell>
      ))}
    </TableRow>
  </TableHead>

  <TableBody>
    {visibles.map((venta) => (
      <TableRow key={venta.id} deleted={venta.estado === 'Anulado'}>
        <TableCell>{venta.id}</TableCell>
        <TableCell>{venta.cliente}</TableCell>
        <TableCell>
          <Badge size="sm" variant={COLOR[venta.estado]} appearance="soft">
            {venta.estado}
          </Badge>
        </TableCell>
        <TableCell className="text-right">{formatNumber(venta.total)}</TableCell>
      </TableRow>
    ))}
  </TableBody>

  <TableFoot>
    <TableRow>
      <TableCell colSpan={3}>Total de la pagina</TableCell>
      <TableCell className="text-right">{formatNumber(suma)}</TableCell>
    </TableRow>
  </TableFoot>
</Table>

<Pagination
  result={{ current: pagina, pages: Math.ceil(VENTAS.length / limite), limit: limite, total: VENTAS.length }}
  onChange={(nuevaPagina, nuevoLimite) => {
    setPagina(nuevaPagina)
    setLimite(nuevoLimite)
  }}
/>`}
          stack
        >
          <div className="w-full">
            <Table>
              <TableHead>
                <TableRow>
                  {(['id', 'cliente', 'estado', 'total'] as const).map((campo) => (
                    <TableHeaderCell
                      key={campo}
                      sort={orden.campo === campo ? orden.dir : null}
                      className={campo === 'total' ? 'text-right' : 'text-left'}
                    >
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-primary"
                        onClick={() => alternar(campo)}
                      >
                        {campo}
                        {orden.campo === campo && (
                          <span
                            className={`icon icon-${orden.dir === 'asc' ? 'asc' : 'desc'}`}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibles.map((venta) => (
                  <TableRow key={venta.id} deleted={venta.estado === 'Anulado'}>
                    <TableCell>{venta.id}</TableCell>
                    <TableCell>{venta.cliente}</TableCell>
                    <TableCell>
                      <Badge size="sm" variant={COLOR[venta.estado]} appearance="soft">
                        {venta.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(venta.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFoot>
                <TableRow>
                  <TableCell colSpan={3}>Total de la pagina</TableCell>
                  <TableCell className="text-right">{formatNumber(suma)}</TableCell>
                </TableRow>
              </TableFoot>
            </Table>

            <Pagination
              result={{
                current: pagina,
                pages: Math.max(1, Math.ceil(VENTAS.length / limite)),
                limit: limite,
                total: VENTAS.length
              }}
              onChange={(nuevaPagina, nuevoLimite) => {
                setPagina(nuevaPagina)
                setLimite(nuevoLimite)
              }}
            />
          </div>
        </Example>
      </Section>

      <Section title="Con altura fija">
        <Prose>
          <p>
            El envoltorio tiene scroll propio, y la cabecera y el pie se quedan pegados. Basta con
            darle una altura.
          </p>
        </Prose>
        <Example
          code={`<Table wrapperClassName="max-h-48">
  <TableHead>
    <TableRow>
      <TableHeaderCell className="text-left">Cliente</TableHeaderCell>
      <TableHeaderCell className="text-right">Total</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {VENTAS.map((venta) => (
      <TableRow key={venta.id}>
        <TableCell>{venta.cliente}</TableCell>
        <TableCell className="text-right">{formatNumber(venta.total)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
          stack
        >
          <div className="w-full">
            <Table wrapperClassName="max-h-48">
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="text-left">Cliente</TableHeaderCell>
                  <TableHeaderCell className="text-right">Total</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {VENTAS.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell>{venta.cliente}</TableCell>
                    <TableCell className="text-right">{formatNumber(venta.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Example>
      </Section>

      <Section title="Sin envoltorio">
        <Example
          description="Con wrapper={false} se pinta solo el elemento table, para meterlo en tu propio contenedor."
          code={`<Table wrapper={false}>
  <TableBody>
    <TableRow>
      <TableCell>Sin borde exterior</TableCell>
      <TableCell className="text-right">—</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
          stack
        >
          <div className="w-full">
            <Table wrapper={false}>
              <TableBody>
                <TableRow>
                  <TableCell>Sin borde exterior</TableCell>
                  <TableCell className="text-right">—</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Example>
      </Section>

      <Section title="API">
        <PropsTable
          of="<Table />"
          rows={[
            { name: 'wrapper', type: 'boolean', default: 'true', description: 'Envuelve la tabla en .table-wrapper, que le da borde y scroll propio.' },
            { name: 'wrapperClassName', type: 'string', description: 'Clases para el envoltorio. Ahi va la altura maxima.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLTableElement>', description: 'Todo lo demas va al table.' }
          ]}
        />

        <PropsTable
          of="<TableRow />"
          rows={[
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Atenua la fila, bloquea el puntero y marca aria-disabled.' },
            { name: 'deleted', type: 'boolean', default: 'false', description: 'Tacha el contenido.' },
            { name: '…rest', type: 'HTMLAttributes<HTMLTableRowElement>', description: 'Todo lo demas va al tr.' }
          ]}
        />

        <PropsTable
          of="<TableHeaderCell />"
          rows={[
            { name: 'sort', type: "'asc' | 'desc' | null", description: 'Se traduce a aria-sort. No ordena nada por si mismo.' },
            { name: 'scope', type: 'string', default: "'col'", description: 'Ambito de la cabecera.' },
            { name: '…rest', type: 'ThHTMLAttributes', description: 'Todo lo demas va al th.' }
          ]}
        />

        <PropsTable
          of="Piezas"
          rows={[
            { name: 'TableHead', type: 'thead', description: 'Cabecera. Sus celdas quedan pegadas arriba.' },
            { name: 'TableBody', type: 'tbody', description: 'Cuerpo.' },
            { name: 'TableFoot', type: 'tfoot', description: 'Pie. Queda pegado abajo y en negrita.' },
            { name: 'TableCell', type: 'td', description: 'Celda normal.' }
          ]}
        />
      </Section>
    </Page>
  )
}
