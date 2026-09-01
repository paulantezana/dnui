import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Navigation, type NavigationItem } from './Navigation'

const BASE = 'https://x.dev'

const items: NavigationItem[] = [
  { label: 'Inicio', href: `${BASE}/` },
  {
    label: 'Componentes',
    children: [
      { label: 'Boton', href: `${BASE}/components/button` },
      {
        label: 'Datos',
        children: [{ label: 'Tabla', href: `${BASE}/components/table` }]
      }
    ]
  }
]

describe('Navigation', () => {
  // dn-ui pinta un `ul.navigation` sin envolverlo en `<nav>`; se conserva igual,
  // asi que el landmark lo pone la aplicacion anfitriona.
  it('pinta la lista raiz con la clase navigation', () => {
    render(<Navigation items={items} currentUrl={`${BASE}/`} label="Principal" />)

    const root = screen.getByRole('list', { name: 'Principal' })
    expect(root.tagName).toBe('UL')
    expect(root).toHaveClass('navigation')
  })

  it('marca el enlace activo con aria-current', () => {
    render(<Navigation items={items} currentUrl={`${BASE}/`} />)

    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Boton' })).not.toHaveAttribute('aria-current')
  })

  it('anade is-active al li del enlace activo, como dn-ui', () => {
    render(<Navigation items={items} currentUrl={`${BASE}/`} />)

    expect(screen.getByRole('link', { name: 'Inicio' }).parentElement).toHaveClass('is-active')
  })

  it('abre los ancestros del enlace activo', () => {
    render(<Navigation items={items} currentUrl={`${BASE}/components/table`} />)

    expect(screen.getByRole('link', { name: /Componentes/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: /Datos/ })).toHaveAttribute('aria-expanded', 'true')
  })

  it('deja cerrados los grupos que no contienen el enlace activo', () => {
    render(<Navigation items={items} currentUrl={`${BASE}/`} />)

    expect(screen.getByRole('link', { name: /Componentes/ })).toHaveAttribute('aria-expanded', 'false')
  })

  it('alterna un submenu al pulsarlo sin navegar', async () => {
    const user = userEvent.setup()
    render(<Navigation items={items} currentUrl={`${BASE}/`} />)

    const group = screen.getByRole('link', { name: /Componentes/ })
    await user.click(group)

    expect(group).toHaveAttribute('aria-expanded', 'true')
    expect(group.nextElementSibling).toHaveClass('is-show')

    await user.click(group)
    expect(group).toHaveAttribute('aria-expanded', 'false')
  })

  it('cambia el icono del toggle segun el estado', async () => {
    const user = userEvent.setup()
    render(
      <Navigation items={items} currentUrl={`${BASE}/`} iconClassDown="icon-down" iconClassUp="icon-up" />
    )

    const group = screen.getByRole('link', { name: /Componentes/ })
    expect(group.querySelector('.toggle')).toHaveClass('icon-down')

    await user.click(group)
    expect(group.querySelector('.toggle')).toHaveClass('icon-up')
  })

  it('los enlaces sin hijos no llevan aria-expanded', () => {
    render(<Navigation items={items} currentUrl={`${BASE}/`} />)

    expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-expanded')
  })
})
