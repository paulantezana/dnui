import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { MessageHost, ModalHost, ThemeToggle } from '@dnui/react'
import { Toc } from '../ui/Toc'
import { Sidebar } from './Sidebar'
import { findLink, siblings } from './nav'

const VERSION = '0.0.1'

const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ArrowIcon = ({ back = false }: { back?: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={back ? { transform: 'rotate(180deg)' } : undefined}
  >
    <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { prev, next } = siblings(pathname)
  const actual = findLink(pathname)

  // Al cambiar de pagina se vuelve arriba. El cajon lo cierra el propio enlace.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // El titulo del documento sigue a la pagina.
  useEffect(() => {
    document.title = actual ? `${actual.label} — @dnui/react` : '@dnui/react'
  }, [actual])

  return (
    <div className="min-h-screen">
      <MessageHost />
      <ModalHost />

      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          borderBottom: '1px solid var(--docs-line)',
          background: 'color-mix(in oklab, var(--docs-page) 85%, transparent)'
        }}
      >
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg text-base-content/70 hover:bg-base-content/8 transition-colors"
            aria-label={drawerOpen ? 'Cerrar navegacion' : 'Abrir navegacion'}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((open) => !open)}
          >
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[13px] font-medium text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              dn
            </span>
            <span className="font-medium tracking-tight text-base-content">@dnui/react</span>
          </Link>

          <span
            className="hidden sm:inline-block text-[11px] px-1.5 py-0.5 rounded-md font-mono text-base-content/50"
            style={{ border: '1px solid var(--docs-line)' }}
          >
            v{VERSION}
          </span>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle appearance="ghost" size="sm" shape="square" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 flex gap-8 xl:gap-10">
        <aside
          className={[
            drawerOpen ? 'block' : 'hidden',
            'lg:block shrink-0',
            'fixed lg:sticky inset-x-0 top-14 z-30 lg:z-auto',
            'h-[calc(100vh-3.5rem)] w-full lg:w-56 xl:w-60',
            'overflow-y-auto py-7 px-4 lg:px-0 lg:pr-2'
          ].join(' ')}
          style={
            drawerOpen
              ? { background: 'var(--docs-page)', borderBottom: '1px solid var(--docs-line)' }
              : undefined
          }
        >
          <Sidebar onNavigate={() => setDrawerOpen(false)} />
        </aside>

        <main className="min-w-0 flex-1 py-12 max-w-3xl">
          {children}

          {(prev || next) && (
            <nav
              aria-label="Paginas"
              className="mt-16 pt-6 grid gap-3 sm:grid-cols-2"
              style={{ borderTop: '1px solid var(--docs-line)' }}
            >
              {prev ? (
                <Link
                  to={prev.path}
                  className="group rounded-xl px-4 py-3 no-underline docs-surface transition-colors hover:border-primary"
                  style={{ border: '1px solid var(--docs-line)' }}
                >
                  <span className="flex items-center gap-1.5 text-[11px] text-base-content/45 mb-0.5">
                    <ArrowIcon back /> Anterior
                  </span>
                  <span className="text-[15px] text-base-content group-hover:text-primary transition-colors">
                    {prev.label}
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {next && (
                <Link
                  to={next.path}
                  className="group rounded-xl px-4 py-3 no-underline text-right docs-surface transition-colors hover:border-primary sm:col-start-2"
                  style={{ border: '1px solid var(--docs-line)' }}
                >
                  <span className="flex items-center justify-end gap-1.5 text-[11px] text-base-content/45 mb-0.5">
                    Siguiente <ArrowIcon />
                  </span>
                  <span className="text-[15px] text-base-content group-hover:text-primary transition-colors">
                    {next.label}
                  </span>
                </Link>
              )}
            </nav>
          )}

          <footer className="mt-12 text-[12.5px] text-base-content/40">
            Los componentes de esta pagina son los reales: sirve tambien de banco de pruebas.
          </footer>
        </main>

        <aside className="hidden xl:block shrink-0 w-52 py-12">
          <div className="sticky top-20">
            <Toc pathname={pathname} />
          </div>
        </aside>
      </div>
    </div>
  )
}
