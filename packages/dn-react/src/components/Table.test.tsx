import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow
} from './Table'

const Sample = (props: { wrapper?: boolean }) => (
  <Table {...props}>
    <TableHead>
      <TableRow>
        <TableHeaderCell sort="asc">Nombre</TableHeaderCell>
        <TableHeaderCell>Correo</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Ana</TableCell>
        <TableCell>ana@ejemplo.com</TableCell>
      </TableRow>
      <TableRow deleted>
        <TableCell>Luis</TableCell>
        <TableCell>luis@ejemplo.com</TableCell>
      </TableRow>
      <TableRow disabled>
        <TableCell>Sara</TableCell>
        <TableCell>sara@ejemplo.com</TableCell>
      </TableRow>
    </TableBody>
    <TableFoot>
      <TableRow>
        <TableCell colSpan={2}>3 registros</TableCell>
      </TableRow>
    </TableFoot>
  </Table>
)

describe('Table', () => {
  it('envuelve la tabla en table-wrapper por defecto', () => {
    const { container } = render(<Sample />)

    expect(container.firstChild).toHaveClass('table-wrapper')
    expect(screen.getByRole('table')).toHaveClass('table')
  })

  it('permite quitar el envoltorio', () => {
    const { container } = render(<Sample wrapper={false} />)

    expect(container.firstChild).toBe(screen.getByRole('table'))
  })

  it('marca las cabeceras con scope col', () => {
    render(<Sample />)

    expect(screen.getByRole('columnheader', { name: 'Correo' })).toHaveAttribute('scope', 'col')
  })

  it('traduce el orden a aria-sort', () => {
    render(<Sample />)

    expect(screen.getByRole('columnheader', { name: 'Nombre' })).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getByRole('columnheader', { name: 'Correo' })).not.toHaveAttribute('aria-sort')
  })

  it('aplica los modificadores de fila de table.css', () => {
    render(<Sample />)

    const borrada = screen.getByText('Luis').closest('tr')
    expect(borrada).toHaveClass('deleted')

    const deshabilitada = screen.getByText('Sara').closest('tr')
    expect(deshabilitada).toHaveClass('disabled')
    expect(deshabilitada).toHaveAttribute('aria-disabled', 'true')
  })

  it('pinta cabecera, cuerpo y pie', () => {
    render(<Sample />)

    expect(screen.getAllByRole('rowgroup')).toHaveLength(3)
    expect(screen.getByText('3 registros')).toBeInTheDocument()
  })
})
