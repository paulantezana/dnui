import type { ReactNode } from 'react'

export interface PropRow {
  name: string
  type: string
  /** Valor por defecto. Se muestra un guion si no hay. */
  default?: string
  required?: boolean
  description: ReactNode
}

export interface PropsTableProps {
  /** Nombre del componente o de la interfaz que se documenta. */
  of?: string
  rows: PropRow[]
}

/**
 * Tabla de props. No usa el `Table` de la libreria a proposito: aqui hace falta
 * una disposicion que se apila en movil, y mezclarla con el componente real
 * confundiria lo documentado con la herramienta que lo documenta.
 */
export const PropsTable = ({ of: name, rows }: PropsTableProps) => (
  <div className="mb-8">
    {name && (
      <h3 className="text-[15px] font-medium mb-3 font-mono text-base-content/90">{name}</h3>
    )}

    <div
      className="rounded-xl overflow-hidden docs-surface"
      style={{ border: '1px solid var(--docs-line)' }}
    >
      {rows.map((row, index) => (
        <div
          key={row.name}
          className="grid gap-x-4 gap-y-1 px-4 py-3.5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
          style={index > 0 ? { borderTop: '1px solid var(--docs-line)' } : undefined}
        >
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <code className="font-mono text-[13px] font-medium text-primary break-words">
                {row.name}
              </code>
              {row.required && (
                <span className="text-[10px] uppercase tracking-wide text-error/90">requerida</span>
              )}
            </div>

            <p className="font-mono text-[11.5px] leading-relaxed text-base-content/50 mt-1 break-words">
              {row.type}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[14px] leading-relaxed text-base-content/75 [&_code]:docs-code">
              {row.description}
            </p>

            {row.default && (
              <p className="text-[12px] text-base-content/45 mt-1.5">
                Por defecto <code className="docs-code">{row.default}</code>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)
