import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DARK_CLASS, THEME_STORAGE_KEY, themeStore } from '../core/stores/themeStore'
import { ThemeToggle } from './Theme'

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
  )

  // `themeStore` es un singleton, como el `Theme` global de dn-ui: hay que
  // devolverlo a un punto conocido entre casos.
  themeStore.set('light')
  localStorage.clear()
  document.documentElement.className = ''
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ThemeToggle', () => {
  it('parte del tema claro cuando el sistema no pide oscuro', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement).not.toHaveClass(DARK_CLASS)
  })

  it('alterna la clase dark en el elemento raiz', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button'))

    expect(document.documentElement).toHaveClass(DARK_CLASS)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('guarda la eleccion', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button'))

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('describe la accion, no el estado, para lectores de pantalla', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Cambiar a tema oscuro' })).toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('button', { name: 'Cambiar a tema claro' })).toBeInTheDocument()
  })

  it('acepta contenido propio en funcion del tema aplicado', () => {
    render(<ThemeToggle>{(resolved) => <span>Tema: {resolved}</span>}</ThemeToggle>)

    expect(screen.getByText(/Tema: light/)).toBeInTheDocument()
  })

  it('admite las variantes de boton', () => {
    render(<ThemeToggle variant="primary" size="sm" />)

    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-primary', 'btn-sm')
  })
})
