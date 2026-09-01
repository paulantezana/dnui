const ESCAPE: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' }

const escapeHtml = (value: string): string => value.replace(/[&<>]/g, (char) => ESCAPE[char])

/**
 * Colores sobre el fondo oscuro fijo de `.code-viewer`. No dependen del tema
 * porque el bloque de codigo siempre es oscuro.
 */
export const TOKEN_COLORS = {
  comment: '#5f7e97',
  string: '#c3e88d',
  keyword: '#c792ea',
  number: '#f78c6c',
  tag: '#ffcb6b',
  attribute: '#82aaff',
  plain: '#d6deeb'
} as const

const KEYWORDS =
  'import|from|export|default|const|let|var|function|return|if|else|new|await|async|type|interface|extends|as|of|in|typeof|null|undefined|true|false'

/**
 * Resaltado minimo para los ejemplos: comentarios, cadenas, palabras clave,
 * numeros, etiquetas de componente y nombres de prop. Sin dependencias.
 *
 * Es a proposito conservador: si un fragmento no encaja en ninguna regla se
 * queda como texto plano, que siempre es legible.
 */
const TOKEN = new RegExp(
  [
    '(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)', // 1 comentario
    "('(?:[^'\\\\\\n]|\\\\.)*'|\"(?:[^\"\\\\\\n]|\\\\.)*\"|`(?:[^`\\\\]|\\\\.)*`)", // 2 cadena
    `\\b(${KEYWORDS})\\b`, // 3 palabra clave
    '\\b(\\d+(?:\\.\\d+)?)\\b', // 4 numero
    '(&lt;\\/?[A-Z][\\w.]*|&lt;\\/?[a-z][\\w-]*)', // 5 etiqueta
    '([a-zA-Z][\\w-]*)(?==)' // 6 nombre de prop
  ].join('|'),
  'g'
)

const wrap = (color: string, text: string) => `<span style="color:${color}">${text}</span>`

export const highlight = (source: string): string =>
  escapeHtml(source).replace(
    TOKEN,
    (match, comment, string, keyword, number, tag, attribute) => {
      if (comment) return wrap(TOKEN_COLORS.comment, comment)
      if (string) return wrap(TOKEN_COLORS.string, string)
      if (keyword) return wrap(TOKEN_COLORS.keyword, keyword)
      if (number) return wrap(TOKEN_COLORS.number, number)
      if (tag) return wrap(TOKEN_COLORS.tag, tag)
      if (attribute) return wrap(TOKEN_COLORS.attribute, attribute)
      return match
    }
  )
