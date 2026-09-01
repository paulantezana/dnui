import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('no se muestra en reposo', () => {
    render(
      <Tooltip content="Guarda los cambios">
        <Button>Guardar</Button>
      </Tooltip>
    )

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('aparece al pasar el raton', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Guarda los cambios">
        <Button>Guardar</Button>
      </Tooltip>
    )

    await user.hover(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Guarda los cambios')
  })

  it('se oculta al salir el raton', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Guarda los cambios">
        <Button>Guardar</Button>
      </Tooltip>
    )

    const trigger = screen.getByRole('button', { name: 'Guardar' })
    await user.hover(trigger)
    await screen.findByRole('tooltip')

    await user.unhover(trigger)
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('aparece tambien al enfocar con el teclado', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Guarda los cambios">
        <Button>Guardar</Button>
      </Tooltip>
    )

    await user.tab()

    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
  })

  it('enlaza el aviso con aria-describedby', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Guarda los cambios">
        <Button>Guardar</Button>
      </Tooltip>
    )

    const trigger = screen.getByRole('button', { name: 'Guardar' })
    await user.hover(trigger)

    const tooltip = await screen.findByRole('tooltip')
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id)
  })

  it('se cierra con Escape', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Guarda los cambios">
        <Button>Guardar</Button>
      </Tooltip>
    )

    await user.hover(screen.getByRole('button', { name: 'Guardar' }))
    await screen.findByRole('tooltip')

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('no aparece cuando esta deshabilitado', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Guarda los cambios" disabled>
        <Button>Guardar</Button>
      </Tooltip>
    )

    await user.hover(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('conserva los handlers propios del elemento anclado', async () => {
    const user = userEvent.setup()
    let entered = false
    render(
      <Tooltip content="Guarda los cambios">
        <Button onMouseEnter={() => (entered = true)}>Guardar</Button>
      </Tooltip>
    )

    await user.hover(screen.getByRole('button', { name: 'Guardar' }))

    expect(entered).toBe(true)
  })
})
