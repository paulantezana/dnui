import UniqueId from '../utils/unique-id';

interface PaginationResult {
  current: number | string;
  pages: number | string;
  limit: number | string;
  total: number | string;
}

interface PaginationOptions {
  elementId: string;
  entity?: string;
  result: PaginationResult;
  onChange?: (page: number, limit: number) => void;
  limitOptions?: number[];
}

class Pagination {
  private options: PaginationOptions;

  constructor(options: PaginationOptions) {
    this.options = {
      ...options,
      entity: options.entity ?? UniqueId().toString(),
      limitOptions: options.limitOptions ?? [10, 20, 50, 100, 200, 300, 500, 1000]
    };

    this.render();
  }

  public render(): void {
    const result = this.options.result;

    let page = parseInt(result.current as string);
    let pages = parseInt(result.pages as string);
    let limit = parseInt(result.limit as string);
    let totalRows = parseInt(result.total as string);
    let startRow = (page - 1) * limit + 1;
    let endRow = Math.min(page * limit, totalRows);

    let pagina = parseInt(result.current as string);
    let totalPage = parseInt(result.pages as string);
    let lastPage = totalPage;

    let paginationHtml = '';

    paginationHtml = `
        <button
          aria-label="Primera página"
          class="btn btn-sm btn-square"
          id="${this.options.entity}FirstPage"
          ${page === 1 ? 'disabled' : ''}
        >
          <span class="icon icon-first"></span>
        </button>
        <button
          aria-label="Página anterior"
          class="btn btn-sm btn-square"
          id="${this.options.entity}PreviousPage"
          ${page === 1 ? 'disabled' : ''}
        >
          <span class="icon icon-previous"></span>
        </button>
        <span>Página ${page} de ${pages}</span>
        <button
          aria-label="Página siguiente"
          class="btn btn-sm btn-square"
          id="${this.options.entity}NextPage"
          ${page === pages ? 'disabled' : ''}
        >
          <span class="icon icon-next"></span>
        </button>
        <button
          aria-label="Última página"
          class="btn btn-sm btn-square"
          id="${this.options.entity}LastPage"
          ${page === pages ? 'disabled' : ''}
        >
          <span class="icon icon-last"></span>
        </button>`;

    let selectHtml = this.options.limitOptions!.map(value =>
      `<option value="${value}" ${value == result.limit ? 'selected' : ''}>${value}</option>`
    ).join('');

    let tableFooter = `<div class="flex gap-2 flex-wrap items-center justify-end mt-1">
              <div class="flex gap-2 items-center">
                <label htmlFor="${this.options.entity}Limit" style="white-space: nowrap;">Filas por Página:</label>
                <select class="form-control sm" id="${this.options.entity}Limit">${selectHtml}</select>
              </div>
              <div>${startRow} a ${endRow} de ${totalRows}</div>
              <div class="flex gap-2 items-center">${paginationHtml}</div>
            </div>`;

    let entityPagination = document.getElementById(this.options.elementId);
    if (entityPagination) {
      entityPagination.innerHTML = tableFooter;
    }

    this.attachEventListeners(pagina, totalPage, lastPage);
  }

  private attachEventListeners(pagina: number, totalPage: number, lastPage: number): void {
    const currentLimit = parseInt(this.options.result.limit as string);

    // Limit Event
    let entityLimit = document.getElementById(`${this.options.entity}Limit`) as HTMLSelectElement;
    if (entityLimit) {
      entityLimit.addEventListener('change', () => {
        const newLimit = parseInt(entityLimit.value);
        if (this.options.onChange) {
          this.options.onChange(1, newLimit);
        }
      });
    }

    // Pagination listeners
    if (totalPage > 1) {
      let previousPageEle = document.getElementById(`${this.options.entity}PreviousPage`);
      if (previousPageEle) {
        previousPageEle.addEventListener('click', e => {
          e.preventDefault();
          const newPage = pagina - 1;
          if (this.options.onChange) {
            this.options.onChange(newPage, currentLimit);
          }
        });
      }

      let firstPageEle = document.getElementById(`${this.options.entity}FirstPage`);
      if (firstPageEle) {
        firstPageEle.addEventListener('click', e => {
          e.preventDefault();
          if (this.options.onChange) {
            this.options.onChange(1, currentLimit);
          }
        });
      }

      let lastPageEle = document.getElementById(`${this.options.entity}LastPage`);
      if (lastPageEle) {
        lastPageEle.addEventListener('click', e => {
          e.preventDefault();
          if (this.options.onChange) {
            this.options.onChange(lastPage, currentLimit);
          }
        });
      }

      let nextPageEle = document.getElementById(`${this.options.entity}NextPage`);
      if (nextPageEle) {
        nextPageEle.addEventListener('click', e => {
          e.preventDefault();
          const newPage = pagina + 1;
          if (this.options.onChange) {
            this.options.onChange(newPage, currentLimit);
          }
        });
      }
    }
  }

  public updateResult(result: PaginationResult): void {
    this.options.result = result;
    this.render();
  }
}

export default Pagination;
export type { PaginationOptions, PaginationResult };
