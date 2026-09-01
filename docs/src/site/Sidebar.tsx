import { useMemo, useState } from 'react'
import { NavLink } from 'react-router'
import { NAV } from './nav'

const matches = (query: string) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return () => true

  return (label: string, keywords: string[] = []) =>
    label.toLowerCase().includes(needle) ||
    keywords.some((keyword) => keyword.toLowerCase().includes(needle))
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10.6 10.6L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export interface SidebarProps {
  /** Se llama al elegir un enlace, para cerrar el cajon en movil. */
  onNavigate?(): void
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const test = matches(query)
    return NAV.map((group) => ({
      ...group,
      links: group.links.filter((link) => test(link.label, link.keywords))
    })).filter((group) => group.links.length > 0)
  }, [query])

  return (
    <nav aria-label="Documentacion" className="text-[13.5px]">
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/35 pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar componente"
          aria-label="Buscar componente"
          className="w-full h-9 pl-9 pr-3 text-[13px] rounded-lg docs-surface text-base-content placeholder:text-base-content/35 transition-colors"
          style={{ border: '1px solid var(--docs-line)' }}
        />
      </div>

      {groups.length === 0 && (
        <p className="px-2 py-4 text-base-content/45">Nada coincide con «{query}».</p>
      )}

      {groups.map((group) => (
        <div key={group.label} className="mb-6">
          <p className="px-3 mb-1.5 text-[11px] font-medium uppercase tracking-wider text-base-content/40">
            {group.label}
          </p>

          <ul>
            {group.links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      'relative block px-3 py-[5px] rounded-lg transition-colors no-underline',
                      isActive
                        ? 'text-primary font-medium'
                        : 'text-base-content/60 hover:text-base-content hover:bg-base-content/5'
                    ].join(' ')
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { background: 'color-mix(in oklab, var(--color-primary) 10%, transparent)' }
                      : undefined
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
