import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { menuStore } from '../core/stores/menuStore'
import { Button } from './Button'
import { Menu, MenuContent, MenuItem, MenuTrigger } from './Menu'

const Sample = ({ onSelect, autoClose }: { onSelect?: () => void; autoClose?: boolean }) => (
  <Menu autoClose={autoClose}>
    <MenuTrigger>
      <Button>Acciones</Button>
    </MenuTrigger>
    <MenuContent label="Acciones">
      <MenuItem onSelect={onSelect}>Editar</MenuItem>
      <MenuItem>Duplicar</MenuItem>
      <MenuItem disabled>Borrar</MenuItem>
    </MenuContent>
  </Menu>
)

afterEach(() => {
  menuStore.close()
  document.querySelector('.MenuScope')?.remove()
})

describe('Menu', () => {
  it('empieza cerrado y marca aria-expanded en el disparador', () => {
    render(<Sample />)

    const trigger = screen.getByRole('button', { name: 'Acciones' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('abre al pulsar el disparador', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('button', { name: 'Acciones' }))

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Acciones' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('vuelve a cerrarse al pulsar el mismo disparador', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    const trigger = screen.getByRole('button', { name: 'Acciones' })
    await user.click(trigger)
    await user.click(trigger)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('enfoca la primera opcion al abrir', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('button', { name: 'Acciones' }))

    expect(document.activeElement?.textContent).toBe('Editar')
  })

  it('navega con las flechas y da la vuelta al llegar al final', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('button', { name: 'Acciones' }))

    await user.keyboard('{ArrowDown}')
    expect(document.activeElement?.textContent).toBe('Duplicar')

    await user.keyboard('{ArrowDown}')
    expect(document.activeElement?.textContent).toBe('Editar')

    await user.keyboard('{ArrowUp}')
    expect(document.activeElement?.textContent).toBe('Duplicar')
  })

  it('salta a los extremos con Home y End', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('button', { name: 'Acciones' }))

    await user.keyboard('{End}')
    expect(document.activeElement?.textContent).toBe('Duplicar')

    await user.keyboard('{Home}')
    expect(document.activeElement?.textContent).toBe('Editar')
  })

  it('excluye del recorrido las opciones deshabilitadas', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('button', { name: 'Acciones' }))
    await user.keyboard('{End}')

    expect(document.activeElement?.textContent).not.toBe('Borrar')
  })

  it('activa la opcion con Enter y cierra', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Sample onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: 'Acciones' }))
    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('cierra con Escape', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('button', { name: 'Acciones' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('cierra al hacer click fuera', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Sample />
        <button type="button">fuera</button>
      </>
    )

    await user.click(screen.getByRole('button', { name: 'Acciones' }))
    await user.click(screen.getByRole('button', { name: 'fuera' }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('elegir una opcion siempre cierra el menu', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('button', { name: 'Acciones' }))
    await user.click(screen.getByText('Duplicar'))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('en modo panel con autoClose false, interactuar dentro no lo cierra', async () => {
    const user = userEvent.setup()
    render(
      <Menu autoClose={false}>
        <MenuTrigger>
          <Button>Filtro</Button>
        </MenuTrigger>
        <MenuContent panel>
          <label htmlFor="q">Buscar</label>
          <input id="q" className="form-control" />
        </MenuContent>
      </Menu>
    )

    await user.click(screen.getByRole('button', { name: 'Filtro' }))
    await user.click(screen.getByLabelText('Buscar'))

    expect(screen.getByLabelText('Buscar')).toBeInTheDocument()
  })

  it('en modo panel no expone role menu ni roba el foco', async () => {
    const user = userEvent.setup()
    render(
      <Menu>
        <MenuTrigger>
          <Button>Filtro</Button>
        </MenuTrigger>
        <MenuContent panel>
          <p>contenido libre</p>
        </MenuContent>
      </Menu>
    )

    await user.click(screen.getByRole('button', { name: 'Filtro' }))

    expect(screen.getByText('contenido libre')).toBeInTheDocument()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('solo mantiene un menu abierto en toda la pagina, como dn-ui', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Menu>
          <MenuTrigger>
            <Button>Primero</Button>
          </MenuTrigger>
          <MenuContent label="Primero">
            <MenuItem>uno</MenuItem>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger>
            <Button>Segundo</Button>
          </MenuTrigger>
          <MenuContent label="Segundo">
            <MenuItem>dos</MenuItem>
          </MenuContent>
        </Menu>
      </>
    )

    await user.click(screen.getByRole('button', { name: 'Primero' }))
    expect(screen.getByRole('menu', { name: 'Primero' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Segundo' }))
    expect(screen.queryByRole('menu', { name: 'Primero' })).not.toBeInTheDocument()
    expect(screen.getByRole('menu', { name: 'Segundo' })).toBeInTheDocument()
  })

  it('marca las opciones deshabilitadas y no las activa', async () => {
    const user = userEvent.setup()
    render(<Sample />)

    await user.click(screen.getByRole('button', { name: 'Acciones' }))

    const disabled = screen.getByText('Borrar')
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    expect(disabled).toHaveClass('disabled')
  })
})
