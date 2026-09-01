import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { themeStore, type ThemePreference } from '../core/stores/themeStore'
import { cx } from '../core/utils/cx'
import { MessageHost, message as messageApi } from './Message'
import { ModalHost, modal as modalApi } from './Modal'

export interface AppApi {
  message: typeof messageApi
  modal: typeof modalApi
}

const AppContext = createContext<AppApi | null>(null)

export interface AppProps {
  children: ReactNode
  /**
   * Envuelve el contenido en un `div.dn-app`. Ponlo a `false` si no quieres un
   * nodo extra, por ejemplo cuando el proveedor va dentro de un layout que ya
   * controla el arbol.
   */
  component?: 'div' | false
  className?: string
  /**
   * Tema inicial. Si no se pasa, se respeta lo que hubiera guardado y, en su
   * defecto, la preferencia del sistema.
   */
  theme?: ThemePreference
}

/**
 * Proveedor global, al estilo del `App` de Ant Design.
 *
 * Monta los contenedores de avisos y dialogos una sola vez y expone
 * `message` y `modal` por contexto, asi que no hay que acordarse de poner
 * `<MessageHost />` ni `<ModalHost />` a mano. Tambien arranca el tema.
 *
 * Las versiones estaticas de `message` y `modal` siguen funcionando desde fuera
 * de React; lo que anade el contexto es que `useApp()` falla en voz alta si
 * falta el proveedor, en vez de dejar que los avisos no aparezcan sin motivo
 * aparente.
 */
export const App = ({ children, component = 'div', className, theme }: AppProps) => {
  const value = useMemo<AppApi>(() => ({ message: messageApi, modal: modalApi }), [])

  useEffect(() => {
    if (theme) themeStore.set(theme)
    return themeStore.init()
  }, [theme])

  const contenido = (
    <AppContext.Provider value={value}>
      {children}
      <MessageHost />
      <ModalHost />
    </AppContext.Provider>
  )

  if (component === false) return contenido

  return <div className={cx('dn-app', className)}>{contenido}</div>
}

/** Acceso a `message` y `modal` desde dentro de `<App>`. */
export const useApp = (): AppApi => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error(
      'useApp() debe usarse dentro de <App>. Envuelve tu aplicacion en <App> de @dnui/react.'
    )
  }

  return context
}

App.useApp = useApp
