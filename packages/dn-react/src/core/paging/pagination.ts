/** Forma exacta del bloque que devuelve el backend en dn-ui. */
export interface PaginationResult {
  current: number | string
  pages: number | string
  limit: number | string
  total: number | string
}

export interface PaginationSummary {
  page: number
  pages: number
  limit: number
  total: number
  /** Indice 1-based de la primera fila de la pagina actual. */
  startRow: number
  /** Indice 1-based de la ultima fila de la pagina actual. */
  endRow: number
  isFirst: boolean
  isLast: boolean
}

/** Mismos tamanos de pagina que dn-ui `pagination.ts`. */
export const DEFAULT_LIMIT_OPTIONS = [10, 20, 50, 100, 200, 300, 500, 1000] as const

const toInt = (value: number | string, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

/**
 * Deriva todo lo que necesita pintar el paginador. Reproduce la aritmetica de
 * dn-ui `pagination.ts:render()`, incluido el caso sin resultados, que alli
 * produce "1 a 0 de 0".
 */
export const paginationSummary = (result: PaginationResult): PaginationSummary => {
  const page = toInt(result.current, 1)
  const pages = toInt(result.pages, 1)
  const limit = toInt(result.limit, 0)
  const total = toInt(result.total, 0)

  return {
    page,
    pages,
    limit,
    total,
    startRow: (page - 1) * limit + 1,
    endRow: Math.min(page * limit, total),
    isFirst: page === 1,
    isLast: page === pages
  }
}
