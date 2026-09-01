import { useState, type ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'

export interface ExampleProps {
  title?: string
  description?: ReactNode
  /**
   * Fuente del ejemplo. Debe reflejar exactamente lo que se ve arriba: si la
   * vista previa recorre una lista, el codigo tambien la recorre.
   */
  code?: string
  /** Deja el codigo abierto de entrada. */
  openByDefault?: boolean
  /** Apila la vista previa en columna en vez de en fila. */
  stack?: boolean
  /** Quita el relleno de la vista previa, para ejemplos que ocupan todo el ancho. */
  flush?: boolean
  children: ReactNode
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .18s ease' }}
  >
    <path
      d="M4 6.5L8 10.5L12 6.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Una demo viva mas su fuente. La vista previa monta el componente real, asi que
 * estas paginas tambien sirven de banco de pruebas.
 */
export const Example = ({
  title,
  description,
  code,
  openByDefault = false,
  stack = false,
  flush = false,
  children
}: ExampleProps) => {
  const [open, setOpen] = useState(openByDefault)

  return (
    <section className="mb-8">
      {title && <h3 className="text-[15px] font-medium mb-1">{title}</h3>}
      {description && (
        <p className="text-sm text-base-content/65 mb-3 max-w-2xl leading-relaxed">{description}</p>
      )}

      <div
        className="rounded-xl overflow-hidden docs-surface"
        style={{ border: '1px solid var(--docs-line)' }}
      >
        <div
          className={[
            flush ? 'p-0' : 'p-6',
            stack ? 'flex flex-col gap-3' : 'flex flex-wrap items-start gap-3'
          ].join(' ')}
        >
          {children}
        </div>

        {code && (
          <>
            <div
              className="flex justify-end px-2 py-1.5 docs-sunken"
              style={{ borderTop: '1px solid var(--docs-line)' }}
            >
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                className="inline-flex items-center gap-1.5 rounded-[0.3rem] px-2.5 py-1 text-xs text-base-content/60 hover:text-base-content hover:bg-base-content/6 transition-colors"
              >
                <ChevronIcon open={open} />
                {open ? 'Ocultar codigo' : 'Ver codigo'}
              </button>
            </div>

            {open && <CodeBlock code={code} />}
          </>
        )}
      </div>
    </section>
  )
}
