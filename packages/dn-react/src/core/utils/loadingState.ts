/**
 * Habilita o deshabilita en bloque los elementos marcados con `className`.
 * Portado de dn-ui `utils/loadingState.ts`. Se anade `root` para poder
 * acotarlo a un subarbol en lugar de barrer todo el documento.
 */
export const loadingState = (
  state: boolean,
  className: string,
  submitId: string | null = null,
  root: ParentNode = document
): void => {
  const actions = root.querySelectorAll<HTMLElement>(`.${className}`)
  const submitBtn = submitId ? document.getElementById(submitId) : null

  if (state) {
    if (submitBtn) {
      submitBtn.setAttribute('disabled', 'disabled')
      submitBtn.classList.add('loading')
    }
    actions.forEach((item) => item.setAttribute('disabled', 'disabled'))
    return
  }

  if (submitBtn) {
    submitBtn.removeAttribute('disabled')
    submitBtn.classList.remove('loading')
  }
  actions.forEach((item) => item.removeAttribute('disabled'))
}
