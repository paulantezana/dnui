import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { confirmStore } from '../core/stores/confirmStore'
import { modalStack } from '../core/stores/modalStack'
import { Modal, ModalBody, ModalHost, modal } from './Modal'

const Controlled = ({ maskClosable }: { maskClosable?: boolean } = {}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        abrir
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Editar" maskClosable={maskClosable}>
        <ModalBody>
          <button type="button">dentro</button>
        </ModalBody>
      </Modal>
    </>
  )
}

afterEach(() => {
  modalStack.closeAll()
  confirmStore.dismissAll()
  document.querySelector('.modal-gScope')?.remove()
  document.body.style.overflow = ''
})

describe('Modal', () => {
  it('no renderiza nada cerrado', () => {
    render(<Controlled />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('expone role dialog y aria-modal al abrirse', async () => {
    const user = userEvent.setup()
    render(<Controlled />)

    await user.click(screen.getByRole('button', { name: 'abrir' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Editar')
  })

  it('bloquea el scroll del body mientras esta abierto', async () => {
    const user = userEvent.setup()
    render(<Controlled />)

    await user.click(screen.getByRole('button', { name: 'abrir' }))
    expect(document.body.style.overflow).toBe('hidden')

    await user.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('auto')
  })

  it('lleva el foco dentro al abrirse', async () => {
    const user = userEvent.setup()
    render(<Controlled />)

    await user.click(screen.getByRole('button', { name: 'abrir' }))

    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
  })

  it('devuelve el foco al disparador al cerrarse', async () => {
    const user = userEvent.setup()
    render(<Controlled />)

    const trigger = screen.getByRole('button', { name: 'abrir' })
    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(document.activeElement).toBe(trigger)
  })

  it('cierra con Escape', async () => {
    const user = userEvent.setup()
    render(<Controlled />)

    await user.click(screen.getByRole('button', { name: 'abrir' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('un click dentro del dialogo no lo cierra', async () => {
    const user = userEvent.setup()
    render(<Controlled />)

    await user.click(screen.getByRole('button', { name: 'abrir' }))
    await user.click(screen.getByRole('button', { name: 'dentro' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('no cierra al pulsar el fondo si maskClosable es false', async () => {
    const user = userEvent.setup()
    render(<Controlled maskClosable={false} />)

    await user.click(screen.getByRole('button', { name: 'abrir' }))
    await user.click(document.querySelector('.modal-wrapper') as HTMLElement)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

describe('modal.confirm', () => {
  it('pinta titulo, contenido y los dos botones', async () => {
    render(<ModalHost />)
    modal.confirm({ title: 'Borrar', content: 'No se puede deshacer' })

    expect(await screen.findByText('Borrar')).toBeInTheDocument()
    expect(screen.getByText('No se puede deshacer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('info oculta el boton de cancelar', async () => {
    render(<ModalHost />)
    modal.info({ title: 'Aviso' })

    await screen.findByText('Aviso')
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })

  it('llama a onOk y cierra', async () => {
    const user = userEvent.setup()
    const onOk = vi.fn()
    render(<ModalHost />)
    modal.confirm({ title: 'Borrar', onOk })

    await user.click(await screen.findByRole('button', { name: 'OK' }))

    expect(onOk).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Borrar')).not.toBeInTheDocument()
  })

  it('llama a onCancel con el valor del input', async () => {
    const user = userEvent.setup()
    const onOk = vi.fn()
    render(<ModalHost />)
    modal.confirm({ title: 'Renombrar', input: true, inputValue: 'antiguo', onOk })

    const input = await screen.findByDisplayValue('antiguo')
    await user.clear(input)
    await user.type(input, 'nuevo')
    await user.click(screen.getByRole('button', { name: 'OK' }))

    expect(onOk).toHaveBeenCalledWith('nuevo')
  })

  it('usa role alertdialog', async () => {
    render(<ModalHost />)
    modal.warning({ title: 'Cuidado' })

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
  })
})
