import { useId, type HTMLAttributes } from 'react'
import {
  DEFAULT_LIMIT_OPTIONS,
  paginationSummary,
  type PaginationResult
} from '../core/paging/pagination'
import { cx } from '../core/utils/cx'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  result: PaginationResult
  onChange(page: number, limit: number): void
  limitOptions?: readonly number[]
  limitLabel?: string
  /** Oculta el selector de filas por pagina. */
  hideLimit?: boolean
}

/**
 * Paginador de dn-ui: primera / anterior / "Pagina X de Y" / siguiente / ultima,
 * mas el selector de filas y el rango visible. La aritmetica vive en
 * `core/paging/pagination.ts` y esta probada aparte.
 */
export const Pagination = ({
  result,
  onChange,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  limitLabel = 'Filas por Pagina:',
  hideLimit = false,
  className,
  ...rest
}: PaginationProps) => {
  const { page, pages, limit, total, startRow, endRow, isFirst, isLast } = paginationSummary(result)
  const limitId = useId()

  return (
    <div
      className={cx('flex gap-2 flex-wrap items-center justify-end mt-1', className)}
      {...rest}
    >
      {!hideLimit && (
        <div className="flex gap-2 items-center">
          <label htmlFor={limitId} style={{ whiteSpace: 'nowrap' }}>
            {limitLabel}
          </label>
          <select
            id={limitId}
            className="form-control form-control-sm"
            value={limit}
            onChange={(event) => onChange(1, Number(event.target.value))}
          >
            {limitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        {startRow} a {endRow} de {total}
      </div>

      <div className="flex gap-2 items-center">
        <button
          type="button"
          aria-label="Primera pagina"
          className="btn btn-sm btn-square"
          disabled={isFirst}
          onClick={() => onChange(1, limit)}
        >
          <span className="icon icon-first" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Pagina anterior"
          className="btn btn-sm btn-square"
          disabled={isFirst}
          onClick={() => onChange(page - 1, limit)}
        >
          <span className="icon icon-previous" aria-hidden="true" />
        </button>

        <span aria-live="polite">
          Pagina {page} de {pages}
        </span>

        <button
          type="button"
          aria-label="Pagina siguiente"
          className="btn btn-sm btn-square"
          disabled={isLast}
          onClick={() => onChange(page + 1, limit)}
        >
          <span className="icon icon-next" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Ultima pagina"
          className="btn btn-sm btn-square"
          disabled={isLast}
          onClick={() => onChange(pages, limit)}
        >
          <span className="icon icon-last" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
