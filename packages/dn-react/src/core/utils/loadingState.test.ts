import { afterEach, describe, expect, it } from 'vitest'
import { loadingState } from './loadingState'

const mount = (html: string) => {
  document.body.innerHTML = html
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('loadingState', () => {
  it('deshabilita todos los elementos con la clase indicada', () => {
    mount('<button class="jsAction">a</button><button class="jsAction">b</button>')

    loadingState(true, 'jsAction')

    const buttons = document.querySelectorAll('.jsAction')
    buttons.forEach((b) => expect(b).toHaveAttribute('disabled'))
  })

  it('vuelve a habilitarlos', () => {
    mount('<button class="jsAction" disabled>a</button>')

    loadingState(false, 'jsAction')

    expect(document.querySelector('.jsAction')).not.toHaveAttribute('disabled')
  })

  it('marca el boton de envio con la clase loading', () => {
    mount('<button id="save" class="jsAction">guardar</button>')

    loadingState(true, 'jsAction', 'save')
    expect(document.getElementById('save')).toHaveClass('loading')

    loadingState(false, 'jsAction', 'save')
    expect(document.getElementById('save')).not.toHaveClass('loading')
  })

  it('solo afecta al subarbol cuando se pasa un root', () => {
    mount(
      '<div id="dentro"><button class="jsAction">a</button></div>' +
        '<div id="fuera"><button class="jsAction">b</button></div>'
    )

    loadingState(true, 'jsAction', null, document.getElementById('dentro')!)

    expect(document.querySelector('#dentro .jsAction')).toHaveAttribute('disabled')
    expect(document.querySelector('#fuera .jsAction')).not.toHaveAttribute('disabled')
  })
})
