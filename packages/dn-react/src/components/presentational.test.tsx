import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from './Alert'
import { Avatar } from './Avatar'
import { Badge, badgeClass } from './Badge'
import { Button, buttonClass } from './Button'
import { Divider } from './Divider'
import { Empty } from './Empty'
import { FormItem } from './Form'
import { Input, PasswordInput } from './Input'

describe('buttonClass', () => {
  it('compone las clases de daisyUI que usa button.css', () => {
    expect(buttonClass({ variant: 'primary', size: 'sm', appearance: 'outline' })).toBe(
      'btn btn-primary btn-sm btn-outline'
    )
  })

  it('solo emite btn sin modificadores', () => {
    expect(buttonClass()).toBe('btn')
  })

  it('admite forma, ancho completo y activo', () => {
    expect(buttonClass({ shape: 'circle', block: true, active: true })).toBe(
      'btn btn-circle btn-block btn-active'
    )
  })
})

describe('Button', () => {
  it('es type button por defecto, para no enviar formularios sin querer', () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('marca btn-disabled cuando esta deshabilitado', () => {
    render(<Button disabled>Guardar</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('btn-disabled')
  })

  it('conserva la clase que le pasen', () => {
    render(<Button className="mia">Guardar</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn', 'mia')
  })
})

describe('badgeClass', () => {
  it('compone variante, tamano y acabado', () => {
    expect(badgeClass({ variant: 'success', size: 'xs', appearance: 'soft' })).toBe(
      'badge badge-success badge-xs badge-soft'
    )
  })
})

describe('Badge', () => {
  it('renderiza un span con la clase badge', () => {
    render(<Badge variant="info">Nuevo</Badge>)

    const badge = screen.getByText('Nuevo')
    expect(badge.tagName).toBe('SPAN')
    expect(badge).toHaveClass('badge', 'badge-info')
  })
})

describe('Alert', () => {
  it('expone role alert y las clases de variante', () => {
    render(
      <Alert variant="warning" appearance="soft">
        Ojo
      </Alert>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('alert', 'alert-warning', 'alert-soft')
  })

  it('sin onClose, se oculta solo al cerrar', async () => {
    const user = userEvent.setup()
    render(<Alert closable>Ojo</Alert>)

    await user.click(screen.getByRole('button', { name: 'Cerrar' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('con onClose, manda el consumidor y el aviso sigue visible', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Alert closable onClose={onClose}>
        Ojo
      </Alert>
    )

    await user.click(screen.getByRole('button', { name: 'Cerrar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('no muestra el boton de cierre si no es cerrable', () => {
    render(<Alert>Ojo</Alert>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('Avatar', () => {
  it('pinta la imagen cuando hay src', () => {
    render(<Avatar src="/foto.png" alt="Ana" />)
    expect(screen.getByRole('img', { name: 'Ana' })).toHaveClass('avatar-img')
  })

  it('cae a las iniciales cuando no hay imagen', () => {
    render(<Avatar fallback="AR" />)
    expect(screen.getByText('AR')).toHaveClass('avatar-text')
  })
})

describe('Divider', () => {
  it('expone role separator y envuelve el texto', () => {
    render(<Divider>o bien</Divider>)

    expect(screen.getByRole('separator')).toHaveClass('divider')
    expect(screen.getByText('o bien')).toHaveClass('divider-innerText')
  })

  it('anade la clase de alineacion solo si no es centrado', () => {
    const { rerender } = render(<Divider>a</Divider>)
    expect(screen.getByRole('separator')).not.toHaveClass('text-left', 'text-right')

    rerender(<Divider align="left">a</Divider>)
    expect(screen.getByRole('separator')).toHaveClass('text-left')
  })
})

describe('Empty', () => {
  it('usa un texto por defecto', () => {
    render(<Empty />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })
})

describe('FormItem', () => {
  it('marca requerido y estado de error', () => {
    const { container } = render(
      <FormItem label="Correo" required status="danger" help="Obligatorio" htmlFor="correo">
        <Input id="correo" />
      </FormItem>
    )

    expect(container.firstChild).toHaveClass('form-item', 'required', 'has-danger')
    expect(screen.getByText('Obligatorio')).toHaveClass('form-help')
  })

  it('en la variante outlined la etiqueta va despues del control', () => {
    const { container } = render(
      <FormItem label="Correo" variant="outlined" htmlFor="correo">
        <Input id="correo" />
      </FormItem>
    )

    const children = Array.from(container.firstElementChild!.children)
    expect(children.at(-1)).toHaveClass('form-label')
  })

  it('en el resto de variantes la etiqueta va primero', () => {
    const { container } = render(
      <FormItem label="Correo" htmlFor="correo">
        <Input id="correo" />
      </FormItem>
    )

    expect(container.firstElementChild!.firstElementChild).toHaveClass('form-label')
  })
})

describe('Input', () => {
  it('aplica el tamano del control', () => {
    render(<Input size="sm" aria-label="q" />)
    expect(screen.getByLabelText('q')).toHaveClass('form-control', 'form-control-sm')
  })

  it('envuelve en control-wrapper solo cuando hay prefijo o sufijo', () => {
    const { rerender, container } = render(<Input aria-label="q" />)
    expect(container.querySelector('.control-wrapper')).toBeNull()

    rerender(<Input aria-label="q" prefix={<span>@</span>} />)
    expect(container.querySelector('.control-wrapper')).not.toBeNull()
    expect(screen.getByLabelText('q')).toHaveClass('control')
  })
})

describe('PasswordInput', () => {
  it('alterna entre password y text', async () => {
    const user = userEvent.setup()
    render(<PasswordInput aria-label="clave" />)

    const input = screen.getByLabelText('clave')
    expect(input).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Mostrar contrasena' }))
    expect(input).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Ocultar contrasena' }))
    expect(input).toHaveAttribute('type', 'password')
  })

  it('el boton refleja el estado con aria-pressed', async () => {
    const user = userEvent.setup()
    render(<PasswordInput aria-label="clave" />)

    const toggle = screen.getByRole('button', { name: 'Mostrar contrasena' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Ocultar contrasena' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })
})
