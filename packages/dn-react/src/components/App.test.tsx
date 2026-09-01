import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { confirmStore } from '../core/stores/confirmStore'
import { messageStore } from '../core/stores/messageStore'
import { modalStack } from '../core/stores/modalStack'
import { themeStore } from '../core/stores/themeStore'
import { App, useApp } from './App'
import { Button } from './Button'

const Consumidor = () => {
  const { message, modal } = useApp()

  return (
    <>
      <Button onClick={() => message.success('Guardado')}>avisar</Button>
      <Button onClick={() => modal.confirm({ title: 'Borrar' })}>confirmar</Button>
    </>
  )
}

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
  )
  themeStore.set('light')
  localStorage.clear()
  document.documentElement.className = ''
})

afterEach(() => {
  messageStore.closeAll()
  confirmStore.dismissAll()
  modalStack.closeAll()
  document.querySelector('.message-scope')?.remove()
  document.querySelector('.modal-gScope')?.remove()
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('monta los contenedores de avisos y dialogos', () => {
    render(
      <App>
        <p>contenido</p>
      </App>
    )

    expect(document.querySelector('.message-scope')).not.toBeNull()
    expect(document.querySelector('.modal-gScope')).not.toBeNull()
  })

  it('envuelve en un div.dn-app por defecto', () => {
    const { container } = render(
      <App>
        <p>contenido</p>
      </App>
    )

    expect(container.firstElementChild).toHaveClass('dn-app')
  })

  it('con component false no anade ningun nodo', () => {
    const { container } = render(
      <App component={false}>
        <p>contenido</p>
      </App>
    )

    expect(container.firstElementChild?.tagName).toBe('P')
  })

  it('useApp da acceso a message sin montar nada mas', async () => {
    const user = userEvent.setup()
    render(
      <App>
        <Consumidor />
      </App>
    )

    await user.click(screen.getByRole('button', { name: 'avisar' }))

    expect(await screen.findByText('Guardado')).toBeInTheDocument()
  })

  it('useApp da acceso a modal sin montar nada mas', async () => {
    const user = userEvent.setup()
    render(
      <App>
        <Consumidor />
      </App>
    )

    await user.click(screen.getByRole('button', { name: 'confirmar' }))

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('Borrar')).toBeInTheDocument()
  })

  it('useApp falla en voz alta si falta el proveedor', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Consumidor />)).toThrow(/dentro de <App>/)

    error.mockRestore()
  })

  it('aplica el tema inicial que se le pase', () => {
    render(
      <App theme="dark">
        <p>contenido</p>
      </App>
    )

    expect(document.documentElement).toHaveClass('dark')
  })

  it('App.useApp es el mismo hook', () => {
    expect(App.useApp).toBe(useApp)
  })
})
