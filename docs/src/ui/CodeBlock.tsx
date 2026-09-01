import { useState, type ReactNode } from 'react'
import { highlight, TOKEN_COLORS } from './highlight'

export interface CodeBlockProps {
  code: string
  /** Se muestra en la barra superior. */
  language?: string
  copyable?: boolean
  /** Etiqueta a la izquierda, tipo nombre de archivo. */
  filename?: ReactNode
  /** Sin barra superior: para fragmentos cortos embebidos. */
  bare?: boolean
}

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M10.5 3.5v-1a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h1"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
)

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8.5l3.2 3.2L13 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Bloque de codigo con resaltado propio y boton de copiar. */
export const CodeBlock = ({
  code,
  language = 'tsx',
  copyable = true,
  filename,
  bare = false
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Sin permiso de portapapeles: el codigo sigue seleccionable.
    }
  }

  return (
    <div className="overflow-hidden" style={{ background: '#263238' }}>
      {!bare && (
        <div
          className="flex items-center gap-2 px-3 h-9 text-[11px]"
          style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}
        >
          <span className="text-white/35 font-mono tracking-wide">{filename ?? language}</span>

          {copyable && (
            <button
              type="button"
              onClick={copy}
              aria-label="Copiar codigo"
              className="ml-auto inline-flex items-center gap-1.5 rounded-[0.3rem] px-2 py-1 text-white/45 hover:text-white hover:bg-white/8 transition-colors"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          )}
        </div>
      )}

      <pre
        className="overflow-x-auto px-4 py-3.5 m-0 text-[12.5px] leading-[1.7]"
        style={{ color: TOKEN_COLORS.plain }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  )
}
