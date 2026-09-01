import type { ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'

/** `Tema y tokens` -> `tema-y-tokens`, para el ancla de cada seccion. */
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export interface PageProps {
  title: string
  description?: ReactNode
  /** Sentencia de importacion que se muestra bajo el titulo. */
  importFrom?: string
  children: ReactNode
}

export const Page = ({ title, description, importFrom, children }: PageProps) => (
  <article>
    <header className="mb-10">
      <h1 className="text-[2.1rem] leading-tight font-medium tracking-tight mb-3">{title}</h1>

      {description && (
        <p className="text-[17px] leading-relaxed text-base-content/65 max-w-2xl">{description}</p>
      )}

      {importFrom && (
        <div
          className="mt-6 rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--docs-line)' }}
        >
          <CodeBlock code={importFrom} filename="importacion" />
        </div>
      )}
    </header>
    {children}
  </article>
)

const AnchorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6.5 9.5a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.6.6M9.5 6.5a2.5 2.5 0 0 0-3.5 0l-2 2a2.5 2.5 0 0 0 3.5 3.5l.6-.6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)

export const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  const id = slugify(title)

  return (
    <section id={id} className="mb-14 scroll-mt-20">
      <h2
        className="group text-[1.35rem] font-medium tracking-tight mb-5 pb-2.5 flex items-center gap-2"
        style={{ borderBottom: '1px solid var(--docs-line)' }}
      >
        {title}
        <a
          href={`#${id}`}
          aria-label={`Enlace a ${title}`}
          className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-base-content/30 hover:text-primary transition-opacity"
        >
          <AnchorIcon />
        </a>
      </h2>
      {children}
    </section>
  )
}

export const Prose = ({ children }: { children: ReactNode }) => (
  <div
    className={[
      'text-[15px] leading-[1.75] text-base-content/75 max-w-2xl mb-6',
      '[&_p]:mb-3 [&_p:last-child]:mb-0',
      '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5',
      '[&_strong]:text-base-content [&_strong]:font-medium',
      '[&_code]:docs-code',
      '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary'
    ].join(' ')}
  >
    {children}
  </div>
)

const NOTE_STYLES = {
  info: {
    border: 'var(--color-info)',
    tint: 'color-mix(in oklab, var(--color-info) 9%, transparent)',
    icon: 'M8 7.2v4.4M8 4.6h.01'
  },
  warning: {
    border: 'var(--color-warning)',
    tint: 'color-mix(in oklab, var(--color-warning) 11%, transparent)',
    icon: 'M8 5.4v3.6M8 11.4h.01'
  }
} as const

/** Aviso destacado para diferencias respecto a dn-ui y trampas conocidas. */
export const Note = ({
  variant = 'info',
  title,
  children
}: {
  variant?: 'info' | 'warning'
  title?: string
  children: ReactNode
}) => {
  const style = NOTE_STYLES[variant]

  return (
    <div
      className="mb-6 max-w-2xl rounded-r-xl pl-4 pr-4 py-3.5 flex gap-3"
      style={{ borderLeft: `3px solid ${style.border}`, background: style.tint }}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="shrink-0 mt-0.5"
        style={{ color: style.border }}
      >
        <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.3" />
        <path d={style.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <div className="min-w-0">
        {title && <p className="font-medium text-[14.5px] mb-1">{title}</p>}
        <div className="text-sm leading-relaxed text-base-content/75 [&_code]:docs-code [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </div>
  )
}
