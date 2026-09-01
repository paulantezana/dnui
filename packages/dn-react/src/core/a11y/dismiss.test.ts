import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDismiss } from './dismiss'

const mount = () => {
  document.body.innerHTML =
    '<button id="trigger">abrir</button><div id="overlay"><button id="dentro">ok</button></div><div id="fuera">fuera</div>'
  return {
    trigger: document.getElementById('trigger') as HTMLElement,
    overlay: document.getElementById('overlay') as HTMLElement,
    dentro: document.getElementById('dentro') as HTMLElement,
    fuera: document.getElementById('fuera') as HTMLElement
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('createDismiss', () => {
  it('cierra al hacer click fuera', () => {
    const { overlay, fuera } = mount()
    const onDismiss = vi.fn()
    const cleanup = createDismiss({ onDismiss, contains: [overlay] })

    fuera.click()

    expect(onDismiss).toHaveBeenCalledWith('outside', expect.any(Event))
    cleanup()
  })

  it('no cierra al hacer click dentro del overlay ni del trigger', () => {
    const { overlay, trigger, dentro } = mount()
    const onDismiss = vi.fn()
    const cleanup = createDismiss({ onDismiss, contains: [overlay, trigger] })

    dentro.click()
    trigger.click()

    expect(onDismiss).not.toHaveBeenCalled()
    cleanup()
  })

  it('cierra con Escape', () => {
    const { overlay } = mount()
    const onDismiss = vi.fn()
    const cleanup = createDismiss({ onDismiss, contains: [overlay] })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(onDismiss).toHaveBeenCalledWith('escape', expect.any(Event))
    cleanup()
  })

  it('ignora otras teclas', () => {
    const { overlay } = mount()
    const onDismiss = vi.fn()
    const cleanup = createDismiss({ onDismiss, contains: [overlay] })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(onDismiss).not.toHaveBeenCalled()
    cleanup()
  })

  it('acepta contains como funcion, para refs que cambian', () => {
    const { overlay, dentro, fuera } = mount()
    const onDismiss = vi.fn()
    const cleanup = createDismiss({ onDismiss, contains: () => [overlay] })

    dentro.click()
    expect(onDismiss).not.toHaveBeenCalled()

    fuera.click()
    expect(onDismiss).toHaveBeenCalledTimes(1)
    cleanup()
  })

  it('permite desactivar escape o outside por separado', () => {
    const { overlay, fuera } = mount()
    const onDismiss = vi.fn()
    const cleanup = createDismiss({ onDismiss, contains: [overlay], escape: false })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onDismiss).not.toHaveBeenCalled()

    fuera.click()
    expect(onDismiss).toHaveBeenCalledTimes(1)
    cleanup()
  })

  it('el cleanup quita los listeners', () => {
    const { overlay, fuera } = mount()
    const onDismiss = vi.fn()
    createDismiss({ onDismiss, contains: [overlay] })()

    fuera.click()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(onDismiss).not.toHaveBeenCalled()
  })
})
