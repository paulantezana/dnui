import { afterEach, describe, expect, it } from 'vitest'
import { createFocusTrap, getFocusable } from './focusTrap'

const mount = (html: string) => {
  document.body.innerHTML = html
  return document.getElementById('trap') as HTMLElement
}

const press = (key: string, shiftKey = false) =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }))

afterEach(() => {
  document.body.innerHTML = ''
})

describe('getFocusable', () => {
  it('lista los enfocables en orden de tabulacion', () => {
    const trap = mount(`
      <div id="trap">
        <a href="#uno">uno</a>
        <button>dos</button>
        <input />
        <div>no enfocable</div>
      </div>`)

    expect(getFocusable(trap).map((el) => el.tagName)).toEqual(['A', 'BUTTON', 'INPUT'])
  })

  it('excluye deshabilitados, tabindex -1 e inert', () => {
    const trap = mount(`
      <div id="trap">
        <button disabled>no</button>
        <input type="hidden" />
        <span tabindex="-1">no</span>
        <div inert><button>tampoco</button></div>
        <button>si</button>
      </div>`)

    const focusable = getFocusable(trap)
    expect(focusable).toHaveLength(1)
    expect(focusable[0].textContent).toBe('si')
  })
})

describe('createFocusTrap', () => {
  it('enfoca el primer elemento al activarse', () => {
    const trap = mount('<div id="trap"><button>uno</button><button>dos</button></div>')
    createFocusTrap(trap).activate()

    expect(document.activeElement?.textContent).toBe('uno')
  })

  it('respeta initialFocus', () => {
    const trap = mount('<div id="trap"><button>uno</button><button id="dos">dos</button></div>')
    createFocusTrap(trap, { initialFocus: document.getElementById('dos') }).activate()

    expect(document.activeElement?.textContent).toBe('dos')
  })

  it('Tab en el ultimo vuelve al primero', () => {
    const trap = mount('<div id="trap"><button>uno</button><button id="dos">dos</button></div>')
    createFocusTrap(trap).activate()

    document.getElementById('dos')!.focus()
    press('Tab')

    expect(document.activeElement?.textContent).toBe('uno')
  })

  it('Shift+Tab en el primero salta al ultimo', () => {
    const trap = mount('<div id="trap"><button>uno</button><button>dos</button></div>')
    createFocusTrap(trap).activate()

    press('Tab', true)

    expect(document.activeElement?.textContent).toBe('dos')
  })

  it('devuelve el foco al desactivarse', () => {
    document.body.innerHTML =
      '<button id="disparador">abrir</button><div id="trap"><button>dentro</button></div>'
    const disparador = document.getElementById('disparador') as HTMLElement
    disparador.focus()

    const trap = createFocusTrap(document.getElementById('trap') as HTMLElement)
    trap.activate()
    expect(document.activeElement?.textContent).toBe('dentro')

    trap.deactivate()
    expect(document.activeElement).toBe(disparador)
  })

  it('deja de interceptar Tab tras desactivarse', () => {
    const trap = mount('<div id="trap"><button>uno</button><button id="dos">dos</button></div>')
    const focusTrap = createFocusTrap(trap)
    focusTrap.activate()
    focusTrap.deactivate()

    document.getElementById('dos')!.focus()
    press('Tab')

    expect(document.activeElement?.textContent).toBe('dos')
  })
})
