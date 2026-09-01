import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { Collapse } from './Collapse'

const panel = () => screen.getByText('contenido').parentElement as HTMLElement

describe('Collapse', () => {
  it('arranca cerrado y sin la clase de expansion', () => {
    render(
      <Collapse trigger={<Button>Ver mas</Button>}>
        <p>contenido</p>
      </Collapse>
    )

    expect(panel()).toHaveClass('collapse')
    expect(panel()).not.toHaveClass('collapse-expanded')
  })

  it('marca aria-expanded y aria-controls en el disparador', () => {
    render(
      <Collapse trigger={<Button>Ver mas</Button>}>
        <p>contenido</p>
      </Collapse>
    )

    const trigger = screen.getByRole('button', { name: 'Ver mas' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', panel().id)
  })

  it('alterna al pulsar', async () => {
    const user = userEvent.setup()
    render(
      <Collapse trigger={<Button>Ver mas</Button>}>
        <p>contenido</p>
      </Collapse>
    )

    const trigger = screen.getByRole('button', { name: 'Ver mas' })

    await user.click(trigger)
    expect(panel()).toHaveClass('collapse-expanded')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.click(trigger)
    expect(panel()).not.toHaveClass('collapse-expanded')
  })

  it('respeta defaultOpen', () => {
    render(
      <Collapse trigger={<Button>Ver mas</Button>} defaultOpen>
        <p>contenido</p>
      </Collapse>
    )

    expect(panel()).toHaveClass('collapse-expanded')
  })

  it('avisa del cambio con onOpenChange', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Collapse trigger={<Button>Ver mas</Button>} onOpenChange={onOpenChange}>
        <p>contenido</p>
      </Collapse>
    )

    await user.click(screen.getByRole('button', { name: 'Ver mas' }))

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('funciona controlado desde fuera', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Collapse trigger={<Button>Ver mas</Button>} open={false} onOpenChange={onOpenChange}>
        <p>contenido</p>
      </Collapse>
    )

    await user.click(screen.getByRole('button', { name: 'Ver mas' }))

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(panel()).not.toHaveClass('collapse-expanded')
  })

  it('conserva el onClick propio del disparador', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Collapse trigger={<Button onClick={onClick}>Ver mas</Button>}>
        <p>contenido</p>
      </Collapse>
    )

    await user.click(screen.getByRole('button', { name: 'Ver mas' }))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(panel()).toHaveClass('collapse-expanded')
  })
})
