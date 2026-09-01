import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react'
import { cx } from '../core/utils/cx'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /**
   * Envuelve la tabla en `.table-wrapper`, que le da borde y scroll propio.
   * Ponlo a `false` si vas a colocar la tabla dentro de tu propio contenedor.
   */
  wrapper?: boolean
  wrapperClassName?: string
}

/**
 * Tabla estatica sobre las clases de `table.css`.
 *
 * Es solo presentacion: el data grid de dn-ui (paginacion por servidor,
 * filtros, orden, seleccion, columnas) llega en la etapa 2 como `DataGrid`, con
 * su motor en `core/table`.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { wrapper = true, wrapperClassName, className, ...rest },
  ref
) {
  const table = <table ref={ref} className={cx('table', className)} {...rest} />

  if (!wrapper) return table

  return <div className={cx('table-wrapper', wrapperClassName)}>{table}</div>
})

export const TableHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHead(props, ref) {
    return <thead ref={ref} {...props} />
  }
)

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody(props, ref) {
    return <tbody ref={ref} {...props} />
  }
)

/** `table.css` deja el pie pegado abajo con `position: sticky`. */
export const TableFoot = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableFoot(props, ref) {
    return <tfoot ref={ref} {...props} />
  }
)

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Atenua la fila y bloquea su interaccion. */
  disabled?: boolean
  /** Tacha el contenido de la fila. */
  deleted?: boolean
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { disabled, deleted, className, ...rest },
  ref
) {
  return (
    <tr
      ref={ref}
      aria-disabled={disabled || undefined}
      className={cx(disabled && 'disabled', deleted && 'deleted', className)}
      {...rest}
    />
  )
})

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  function TableCell(props, ref) {
    return <td ref={ref} {...props} />
  }
)

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Orden aplicado, para `aria-sort`. */
  sort?: 'asc' | 'desc' | null
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell({ sort, scope = 'col', ...rest }, ref) {
    const ariaSort = sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined
    return <th ref={ref} scope={scope} aria-sort={ariaSort} {...rest} />
  }
)
