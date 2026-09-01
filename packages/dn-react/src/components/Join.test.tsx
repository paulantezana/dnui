import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { Input, Select } from './Input'
import { Join } from './Join'

describe('Join', () => {
  it('pone join-item en el propio control, no en un envoltorio', () => {
    const { container } = render(
      <Join>
        <Button>Uno</Button>
        <Button>Dos</Button>
      </Join>
    )

    const join = container.firstElementChild!
    // Los hijos directos son los botones: sin divs intermedios.
    expect([...join.children].map((c) => c.tagName)).toEqual(['BUTTON', 'BUTTON'])
    join.querySelectorAll('button').forEach((b) => expect(b).toHaveClass('btn', 'join-item'))
  })

  it('conserva las clases propias del hijo', () => {
    render(
      <Join>
        <Button variant="primary" className="mia">
          Uno
        </Button>
      </Join>
    )

    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-primary', 'mia', 'join-item')
  })

  it('une controles de distinto tipo', () => {
    const { container } = render(
      <Join>
        <Select aria-label="Prefijo">
          <option>+51</option>
        </Select>
        <Input aria-label="Telefono" />
        <Button variant="primary">Ir</Button>
      </Join>
    )

    const join = container.firstElementChild!
    expect([...join.children].map((c) => c.tagName)).toEqual(['SELECT', 'INPUT', 'BUTTON'])
    join.querySelectorAll('select, input, button').forEach((el) =>
      expect(el).toHaveClass('join-item')
    )
  })

  it('no duplica la clase si ya venia puesta', () => {
    render(
      <Join>
        <Button className="join-item">Uno</Button>
      </Join>
    )

    const clases = screen.getByRole('button').className.split(' ')
    expect(clases.filter((c) => c === 'join-item')).toHaveLength(1)
  })

  it('con autoItems false no toca a los hijos', () => {
    render(
      <Join autoItems={false}>
        <Button>Uno</Button>
      </Join>
    )

    expect(screen.getByRole('button')).not.toHaveClass('join-item')
  })

  it('aplica la direccion', () => {
    const { container, rerender } = render(
      <Join>
        <Button>Uno</Button>
      </Join>
    )
    expect(container.firstElementChild).toHaveClass('join', 'join-horizontal')

    rerender(
      <Join direction="vertical">
        <Button>Uno</Button>
      </Join>
    )
    expect(container.firstElementChild).toHaveClass('join', 'join-vertical')
  })

  it('ignora los hijos que no son elementos', () => {
    const { container } = render(
      <Join>
        {null}
        <Button>Uno</Button>
        {false}
      </Join>
    )

    expect(container.querySelectorAll('.join-item')).toHaveLength(1)
  })
})
