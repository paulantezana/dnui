import { useEffect, useState } from 'react'

interface Entrada {
  id: string
  titulo: string
}

/**
 * Indice de la pagina actual. Lee las secciones del DOM en vez de recibirlas por
 * props, asi que ninguna pagina tiene que declarar su propio indice.
 */
export const Toc = ({ pathname }: { pathname: string }) => {
  const [entradas, setEntradas] = useState<Entrada[]>([])
  const [activa, setActiva] = useState<string>('')

  useEffect(() => {
    const secciones = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))

    // El indice se lee del DOM ya pintado, que es un sistema externo a React.
    // oxlint-disable-next-line react/set-state-in-effect
    setEntradas(
      secciones.map((seccion) => ({
        id: seccion.id,
        titulo: seccion.querySelector('h2')?.firstChild?.textContent?.trim() ?? seccion.id
      }))
    )
    setActiva(secciones[0]?.id ?? '')

    if (secciones.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibles = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visibles[0]) setActiva(visibles[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    secciones.forEach((seccion) => observer.observe(seccion))
    return () => observer.disconnect()
  }, [pathname])

  if (entradas.length < 2) return null

  return (
    <nav aria-label="En esta pagina" className="text-[13px]">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-base-content/40">
        En esta pagina
      </p>

      <ul className="space-y-0.5">
        {entradas.map((entrada) => {
          const esActiva = entrada.id === activa

          return (
            <li key={entrada.id}>
              <a
                href={`#${entrada.id}`}
                aria-current={esActiva ? 'location' : undefined}
                className={`block py-1 pl-3 -ml-px transition-colors ${
                  esActiva
                    ? 'text-primary font-medium'
                    : 'text-base-content/55 hover:text-base-content'
                }`}
                style={{
                  borderLeft: `2px solid ${esActiva ? 'var(--color-primary)' : 'var(--docs-line)'}`
                }}
              >
                {entrada.titulo}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
