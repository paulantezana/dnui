import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'

export interface CodeViewerProps extends HTMLAttributes<HTMLPreElement> {
  code?: string
  language?: string
}

/** Bloque de codigo con el fondo oscuro de `code-viewer.css`. */
export const CodeViewer = forwardRef<HTMLPreElement, CodeViewerProps>(function CodeViewer(
  { code, language, className, children, ...rest },
  ref
) {
  return (
    <pre ref={ref} className={cx('code-viewer', language && `language-${language}`, className)} {...rest}>
      <code>{code ?? children}</code>
    </pre>
  )
})
