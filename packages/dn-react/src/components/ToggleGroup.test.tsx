import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ControlGroup } from './ControlGroup'
import { Button } from './Button'
import { Input } from './Input'
import { ToggleGroup } from './ToggleGroup'

const OPCIONES = [
  { value: 'izquierda', label: 'Izquierda' },
  { value: 'centro', label: 'Centro' },
  { value: 'derecha', label: 'Derecha' }
]

describe('ToggleGroup', () => {
  it('emite los inputs y las etiquetas como hermanos directos', () => {
    const { container } = render(<ToggleGroup label="Alineacion" options={OPCIONES} />)

    const grupo = container.firstElementChild!
    // `toggle-group.css` redondea con .btn:first-of-type y :last-of-type: si
    // hubiera un envoltorio por par, cada etiqueta seria primera y ultima de su
    // propio contenedor y los tres botones saldrian redondeados por separado.
    expect([...grupo.children].map((c) => c.tagName)).toEqual([
      'INPUT',
      'LABEL',
      'INPUT',
      'LABEL',
      'INPUT',
      'LABEL'
    ])
  })

  it('cada etiqueta sigue inmediatamente a su input, para input:checked + .btn', () => {
    const { container } = render(<ToggleGroup options={OPCIONES} defaultValue="centro" />)

    container.querySelectorAll('input').forEach((input) => {
      expect(input.nextElementSibling?.tagName).toBe('LABEL')
      expect(input.nextElementSibling).toHaveClass('btn')
    })
  })

  it('usa radios de verdad con un name compartido', () => {
    render(<ToggleGroup options={OPCIONES} name="alineacion" defaultValue="centro" />)

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    radios.forEach((radio) => expect(radio).toHaveAttribute('name', 'alineacion'))
    expect(screen.getByRole('radio', { name: 'Centro' })).toBeChecked()
  })

  it('avisa del valor elegido', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ToggleGroup options={OPCIONES} defaultValue="izquierda" onChange={onChange} />)

    await user.click(screen.getByText('Derecha'))

    expect(onChange).toHaveBeenCalledWith('derecha')
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()

    const Controlado = () => {
      const [valor, setValor] = useState('izquierda')
      return <ToggleGroup options={OPCIONES} value={valor} onChange={setValor} />
    }

    render(<Controlado />)
    await user.click(screen.getByText('Centro'))

    expect(screen.getByRole('radio', { name: 'Centro' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Izquierda' })).not.toBeChecked()
  })

  it('respeta las opciones deshabilitadas', () => {
    render(
      <ToggleGroup options={[...OPCIONES, { value: 'justificado', label: 'Justificado', disabled: true }]} />
    )

    expect(screen.getByRole('radio', { name: 'Justificado' })).toBeDisabled()
  })

  it('expone el grupo con su nombre accesible', () => {
    render(<ToggleGroup label="Alineacion" options={OPCIONES} />)
    expect(screen.getByRole('group', { name: 'Alineacion' })).toBeInTheDocument()
  })

  it('aplica el estilo de boton pedido', () => {
    render(<ToggleGroup options={OPCIONES} buttonProps={{ appearance: 'outline', size: 'sm' }} />)

    expect(screen.getByText('Centro')).toHaveClass('btn', 'btn-sm', 'btn-outline')
  })
})

describe('ControlGroup', () => {
  it('solapa el borde de los adornos para no dejar costura', () => {
    const { container } = render(
      <ControlGroup prepend={<Button>https://</Button>} append={<Button>Ir</Button>}>
        <Input aria-label="Dominio" />
      </ControlGroup>
    )

    // `control-group.css` quita el redondeo interior pero no solapa los bordes.
    expect(container.querySelector('.control-group-prepend')).toHaveClass('-me-px')
    expect(container.querySelector('.control-group-append')).toHaveClass('-ms-px')
  })

  it('omite los lados que no se usan', () => {
    const { container } = render(
      <ControlGroup append={<Button>Ir</Button>}>
        <Input aria-label="Termino" />
      </ControlGroup>
    )

    expect(container.querySelector('.control-group-prepend')).toBeNull()
    expect(container.querySelector('.control-group-append')).not.toBeNull()
  })
})
