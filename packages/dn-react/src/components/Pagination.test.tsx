import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

const result = { current: 3, pages: 5, limit: 20, total: 93 }

describe('Pagination', () => {
  it('muestra la pagina actual y el rango de filas', () => {
    render(<Pagination result={result} onChange={vi.fn()} />)

    expect(screen.getByText('Pagina 3 de 5')).toBeInTheDocument()
    expect(screen.getByText('41 a 60 de 93')).toBeInTheDocument()
  })

  it('etiqueta los cuatro botones para lectores de pantalla', () => {
    render(<Pagination result={result} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Primera pagina' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pagina anterior' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pagina siguiente' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ultima pagina' })).toBeInTheDocument()
  })

  it('deshabilita ir atras en la primera pagina', () => {
    render(<Pagination result={{ ...result, current: 1 }} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Primera pagina' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Pagina anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Pagina siguiente' })).toBeEnabled()
  })

  it('deshabilita ir adelante en la ultima pagina', () => {
    render(<Pagination result={{ ...result, current: 5 }} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Pagina siguiente' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Ultima pagina' })).toBeDisabled()
  })

  it('avisa con la pagina destino y el limite actual', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination result={result} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Pagina siguiente' }))
    expect(onChange).toHaveBeenCalledWith(4, 20)

    await user.click(screen.getByRole('button', { name: 'Pagina anterior' }))
    expect(onChange).toHaveBeenCalledWith(2, 20)

    await user.click(screen.getByRole('button', { name: 'Primera pagina' }))
    expect(onChange).toHaveBeenCalledWith(1, 20)

    await user.click(screen.getByRole('button', { name: 'Ultima pagina' }))
    expect(onChange).toHaveBeenCalledWith(5, 20)
  })

  it('cambiar el limite vuelve a la primera pagina, como dn-ui', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination result={result} onChange={onChange} />)

    await user.selectOptions(screen.getByRole('combobox'), '50')

    expect(onChange).toHaveBeenCalledWith(1, 50)
  })

  it('ofrece los tamanos de pagina de dn-ui', () => {
    render(<Pagination result={result} onChange={vi.fn()} />)

    const options = screen.getAllByRole('option').map((option) => option.textContent)
    expect(options).toEqual(['10', '20', '50', '100', '200', '300', '500', '1000'])
  })

  it('permite ocultar el selector de filas', () => {
    render(<Pagination result={result} onChange={vi.fn()} hideLimit />)

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })
})
