import Menu from './menu';
import { Modal } from './modal';

import {
  FILTER_RELATIVE_DATE_PERIOD,
  FILTER_RELATIVE_DATE_PERIODS,
  FILTER_RELATIVE_DATE_FILTER_TYPE,
  FILTER_RELATIVE_DATE_TYPE,
  FILTER_SCALAR_FILTER_TYPE,
  FILTER_TEXT_FILTER_TYPE,
  type FilterModel,
  type ColumnFilterNode,
  type JoinFilterNode,
  type DnInputType
} from './filterModel';

import DnFilter from './filter';

import UniqueId from '../utils/unique-id';
import { LoadingState } from '../utils/loadingState';
import { FormatNumber } from '../utils/formatNumber';
import { Freeze } from './freeze';
import type { VirtualPosition } from './menuType';
import { FilterColumn } from './filterColumn';
import dayjs from 'dayjs';
import Pagination, { type PaginationResult } from './pagination';

// Define interfaces for TypeScript
interface TableColumn {
  id?: number;
  field: string;
  title?: string;
  visible?: boolean | number | string;
  position_index?: number;
  type?: DnInputType;
  summaryOperator?: string;
  style?: string;
  tooltip?: string;
  filterable?: boolean;
  sortable?: boolean;
  filterValues?: (params: any) => Promise<string[]>;
  customRender?: (item: any, table: Table) => string;
}

interface TableAction {
  id?: string | number;
  position: string;
  title: string;
  icon: string;
  event_name: string;
  event_name_prefix?: string;
  screen_id_controller?: string;
}

interface TableSorter {
  field: string;
  order: 'asc' | 'desc';
}

interface TableOptions {
  paramKeys?: string[];
  actions?: TableAction[];
  entity: string;
  elementId: string;
  selectable?: boolean;
  resizable?: boolean;
  columns: TableColumn[];
  filters?: FilterModel;
  tableHeadTopHtml?: string;
  filterEnabled?: boolean;
  selectableRadio?: boolean;
  toolbar?: string;
  sorter?: TableSorter;
  data: (params: TableDataParams) => Promise<TableResult>;
  rowRender?: (item: any, table: Table, paramValues: string) => string;
  onSelectChange?: (table: Table) => void;
  updated?: (table: Table) => void;
}

interface TableDataParams {
  filter: FilterModel;
  sorter: TableSorter;
  limit: number;
  page: number;
}

interface TableResult {
  data: any[];
  current: number | string;
  pages: number | string;
  limit: number | string;
  total: number | string;
}

interface SummaryField extends TableColumn {
  values: number[];
}

class Table {
  private options: TableOptions;
  private columnSorters: TableSorter;
  private selectRows: string[];
  private rowKey: string;
  private result: TableResult;
  private filter: DnFilter | null;
  private limit: number;
  private page: number;
  private summaryFields: SummaryField[];
  private pagination: Pagination | null;

  constructor(options: TableOptions) {
    // -------------------------------------------------------------------------------
    // Init vars ---------------------------------------------------------------------
    this.options = options;
    this.columnSorters = {} as TableSorter;
    this.selectRows = [];
    this.rowKey = 'id';
    this.result = { data: [], current: 0, pages: 0, limit: 0, total: 0 };
    this.filter = null;
    this.limit = 20;
    this.page = 1;
    this.summaryFields = [];
    this.pagination = null;

    // Init var in options
    this.options.paramKeys ??= ['id'];
    this.options.actions ??= [];
    this.options.entity ??= UniqueId().toString();
    this.options.elementId ??= '';
    this.options.selectable ??= true;
    this.options.resizable ??= true;
    this.options.columns ??= [];
    this.options.filters ??= {} as FilterModel;
    this.options.tableHeadTopHtml ??= '';
    this.options.filterEnabled ??= true;
    this.options.selectableRadio ??= true;
    this.options.toolbar ??= '';
    this.options.sorter ??= {} as TableSorter;

    // Default Sorter
    if (!!this.options.sorter.field) {
      this.columnSorters = this.options.sorter;
    } else if (this.rowKey.length > 0) {
      this.columnSorters = {
        field: this.rowKey,
        order: 'desc',
      };
    }

    // Summary cols
    this._setDefaultValues();

    // Init
    this._renderTemplate();
    this.getData();
  }

  //  ========================================================================================
  //  U T I L S
  private _setDefaultValues(): void {
    // Set columns default properties
    this.options.columns = this.options.columns.map(item => ({
      ...item,
      id: item.id ?? UniqueId(),
      title: item.title ?? '',
      type: item.type ?? 'text',
      visible: [undefined, null, true, 1, '1'].includes(item.visible)
    })).sort((a, b) => (a.position_index || 0) - (b.position_index || 0));

    // Init summary fields
    this.summaryFields = this.options.columns
      .filter(item => item.type === 'number' && !!item.summaryOperator)
      .map(item => ({ ...item, values: [] } as SummaryField));
  }

  private _getTableActionParamValues(row: any): string {
    // Get values
    let items: [string, any][] = Object.entries(row).filter(([key, _]) => this.options.paramKeys!.includes(key));

    // Order
    items.sort((a, b) => {
      let positionA = this.options.paramKeys!.indexOf(a[0]);
      let positionB = this.options.paramKeys!.indexOf(b[0]);
      return positionA - positionB;
    });

    // Set only values and is string in ""
    items = items.map(([_, val]) => (typeof val === 'string') ? `'${val}'` : val);

    // Return value in string
    return items.join('_');
  }

  private _getTableActions(): TableAction[] {
    return this.options.actions!.filter(item => item.position === 'TABLE');
  }

  private _getVisibleColumns(): TableColumn[] {
    return this.options.columns.filter(item => [true, 1, '1'].includes(item.visible as any));
  }

  private _getColumnByField(field: string): TableColumn | undefined {
    return this.options.columns.find(item => item.field === field);
  }

  //  ========================================================================================
  //  T A B L E     Z O N E
  //  ========================================================================================
  public getData(): void {
    Freeze.freeze({ selector: `#${this.options.elementId}` });
    LoadingState(true, 'jsAction');
    this.options.data({
      filter: this.filter?.getFilterModel() ?? {} as FilterModel,
      sorter: this.columnSorters,
      limit: this.limit,
      page: this.page,
    })
      .then((result) => {
        this.result = result;
        this.selectRows = [];

        this._renderTableBody();
        this._renderFilterDescriptions();
      })
      .catch((err) => {
        console.error('Table fetch error ', err);
      })
      .finally(() => {
        Freeze.unFreeze(`#${this.options.elementId}`);
        LoadingState(false, 'jsAction');
      });
  }

  private _renderTemplate(): void {
    let tableEle = document.getElementById(this.options.elementId!);
    if (!tableEle) return;

    // Render table base
    tableEle.innerHTML = `<div id="${this.options.entity}DataTable" class="datagrid">
                                    <div class="flex justify-between mb-2 datagrid-toolbar" id="${this.options.entity}DataTableToolbar">
                                      <div class="flex flex-wrap gap-2" id="${this.options.entity}FilterDescription"></div>
                                      <div class="flex gap-2">${this.options.toolbar}
                                        <div class="btn btn-sm btn-circle jsAction" data-modaltrigger="${this.options.entity}ModalFilter" id="${this.options.entity}ModalFilterToggle"><span class="icon icon-filter"></span></div>
                                        <div class="modal-wrapper" data-modal="${this.options.entity}ModalFilter" data-maskclose="false">
                                          <div class="modal" style="max-width: 90vw;">
                                            <div class="modal-close" data-modalclose="${this.options.entity}ModalFilter" id="${this.options.entity}ModalFilterClose"><span class="icon icon-cross"></span></div>
                                            <div class="modal-header">Filtro</div>
                                            <div class="modal-body">
                                              <div id="${this.options.entity}FilterWrapper"></div>
                                              <button class="btn rounded-full w-full btn-primary mt-3" id="${this.options.entity}FilterAply"><span class="icon icon-filter"></span>Aplicar filtro</button>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="btn btn-sm btn-circle jsAction" data-menutrigger="${this.options.entity}DataTableFilter"><span class="icon icon-columns"></span></div>
                                        <div class="menu-overlay" data-menu="${this.options.entity}DataTableFilter" data-menuautoclose="false">
                                          <div class="menu-content datagrid-filter">
                                            <div class="form-item inner">
                                              <label for="headerCompany" class="form-label">Buscar columna</label>
                                              <input type="search" class="form-control form-control-sm" id="${this.options.entity}SearchCols"/>
                                            </div>
                                            <ul class="list datagrid-filter-list" id="${this.options.entity}ListCols">
                                              ${this.options.columns.map(col => `<li><input type="checkbox" class="js${this.options.entity}ToggleCols" data-key="${col.id}" ${col.visible === true ? 'checked' : ''}><span class="ml-2">${col.title}</span></li>`).join('')}
                                            </ul>
                                            <div class="datagrid-filter-footer">
                                              <button class="btn rounded-full" id="${this.options.entity}HideAllCols">Ocultar todo</button>
                                              <button class="btn rounded-full ml-3" id="${this.options.entity}ShowAllCols">Mostrar todo</button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="table-wrapper datagrid-table">
                                      <table class="table" id="${this.options.entity}Table">
                                        <thead id="${this.options.entity}TableHead"></thead>
                                        <tbody id="${this.options.entity}TableBody">${this._buildEmptyRow()}</tbody>
                                        <tfoot id="${this.options.entity}TableFoot"></tfoot>
                                      </table>
                                    </div>
                                    <div class="datagrid-pagination" id="${this.options.entity}Pagination"></div>
                                </div>`;

    // Render filter
    if (this.options.filterEnabled) {
      this.filter = new DnFilter({
        fields: this.options.columns.filter(item => [undefined, true].includes(item.filterable)).map(item => ({
          caption: item.title!,
          field: item.field,
          filterType: item.type!,
        })),
        filterModel: this.options.filters,
        elementId: `${this.options.entity}FilterWrapper`
      });
    }

    // Table Head
    this._renderTableHead();

    // Menu List
    Menu.listen();

    // Toolbar listener
    const filterToggle = document.getElementById(`${this.options.entity}ModalFilterToggle`);
    if (filterToggle) {
      filterToggle.addEventListener('click', (e) => {
        e.preventDefault();
        Modal.open(`${this.options.entity}ModalFilter`);
      });
    }

    const filterClose = document.getElementById(`${this.options.entity}ModalFilterClose`);
    if (filterClose) {
      filterClose.addEventListener('click', (e) => {
        e.preventDefault();
        Modal.close(`${this.options.entity}ModalFilter`);
      });
    }

    const filterAply = document.getElementById(`${this.options.entity}FilterAply`);
    if (filterAply) {
      filterAply.addEventListener('click', e => {
        e.preventDefault();
        this.getData();
        Modal.close(`${this.options.entity}ModalFilter`);
      });
    }

    // ===================================================================================================
    // S H O W   A N D   H I D E   C O L U M N S
    // ===================================================================================================
    const searchCols = document.getElementById(`${this.options.entity}SearchCols`) as HTMLInputElement;
    if (searchCols) {
      searchCols.addEventListener('input', () => {
        this._reRenderColumnFilter(false, searchCols.value);
      });
    }

    const toggleCols = document.querySelectorAll(`.js${this.options.entity}ToggleCols`);
    toggleCols.forEach((checkbox: Element) => {
      if (checkbox instanceof HTMLInputElement) {
        checkbox.addEventListener('change', () => {
          this.options.columns = this.options.columns.map(item => ({
            ...item,
            visible: (item.id === checkbox.dataset.key ? checkbox.checked : item.visible)
          }));
          this._reRenderColumnFilter(true);
        });
      }
    });

    // hide all
    const hideAllCols = document.getElementById(`${this.options.entity}HideAllCols`);
    if (hideAllCols) {
      hideAllCols.addEventListener('click', () => {
        this.options.columns = this.options.columns.map(item => ({ ...item, visible: false }));
        this._reRenderColumnFilter(true);
      });
    }

    // show all
    const showAllCols = document.getElementById(`${this.options.entity}ShowAllCols`);
    if (showAllCols) {
      showAllCols.addEventListener('click', () => {
        this.options.columns = this.options.columns.map(item => ({ ...item, visible: true }));
        this._reRenderColumnFilter(true);
      });
    }
  }

  private _renderTableHead(): void {
    const hasColumnFilter = (field: string, filter?: FilterModel): boolean => {
      if (!filter) return false;

      if (filter.filterType === 'join') {
        return filter.conditions.some((item) => hasColumnFilter(field, item));
      }

      return filter.field === field && (filter.filter1?.toString() || '').length > 0;
    }

    let entityTableHead = document.getElementById(`${this.options.entity}TableHead`);
    if (!entityTableHead) return;

    // Head Table
    let tableHeadHtml = '';
    this._getVisibleColumns().forEach(item => {
      const hasFilter = hasColumnFilter(item.field, this.filter?.getFilterModel());
      const hasSorter = this.columnSorters?.field === item.field ? this.columnSorters : null;
      const colFilter = this.getTableColumnFilterValue(item.field) as ColumnFilterNode | undefined;

      const sorterIcon = hasSorter
        ? (hasSorter.order === 'desc' ? '<span class="icon icon-desc"></span>' : '<span class="icon icon-asc"></span>')
        : '';
      const filterIcon = hasFilter ? '<span class="icon icon-filter"></span>' : '';

      tableHeadHtml += `<th ${item.style != undefined ? `style="${item.style}"` : ''} title="${item.tooltip || item.title}">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center" style="white-space: nowrap">${item.title}${sorterIcon}${filterIcon}</div>
                                    <div class="btn btn-square btn-text btn-sm jsTableColMenu${this.options.entity}" data-field="${item.field}"><span class="icon icon-menu-alt"></span></div>
                                </div>
                                ${item.filterable ? `<input type="${(item.type === 'datetime-local' || item.type === 'date') ? item.type : 'search'}" value="${colFilter?.filter1 ?? ''}" data-filter-key="${colFilter?.key}" class="jsFilterValue${this.options.entity} form-control form-control-sm not-print" data-field="${item.field}"/>` : ''}
                            </th>`;
    });

    entityTableHead.innerHTML = `${this.options.tableHeadTopHtml}
                                    <tr>
                                        ${this.options.selectable ? (this.options.selectableRadio ? '<th class="not-print"></th>' : `<th class="not-print"><input type="checkbox" id="${this.options.entity}TableSelectHead"></th>`) : ''}
                                        ${tableHeadHtml}
                                    </tr>`;

    // Filter listeners
    let filterValue = document.querySelectorAll(`.jsFilterValue${this.options.entity}`);
    filterValue.forEach((item: Element) => {
      if (item instanceof HTMLInputElement) {
        const inputType = item.getAttribute('type');
        const filterKey = item.getAttribute('data-filter-key');

        // Change listener -- EXPERIMENTAL
        if (inputType === 'date' || inputType === 'datetime-local') {
          item.addEventListener('change', e => {
            const target = e.target as HTMLInputElement;
            this.setTableColumnFilter(inputType, filterKey, target.dataset.field!, target.value);
          });
        }

        // Key Up Listener
        // item.addEventListener('keyup', e => {
        //   if (e.key === 'Enter') {
        //     const target = e.target as HTMLInputElement;
        //     this.setTableColumnFilter(inputType, filterKey, target.dataset.field!, target.value);
        //   }
        // });

        item.addEventListener('search', e => {
          const target = e.target as HTMLInputElement;
          this.setTableColumnFilter(inputType, filterKey, target.dataset.field!, target.value);
        });
      }
    });

    // Sort listeners jsTableColMenu
    let colMenu = document.querySelectorAll(`.jsTableColMenu${this.options.entity}`);
    colMenu.forEach((item: Element) => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        if (item instanceof HTMLElement) {
          let field = item.dataset.field!;
          this._renderTableHeadMenu(item, field);
        }
      });
    });

    // Selected lsitener
    if (this.options.selectable) {
      const selectHead = document.getElementById(`${this.options.entity}TableSelectHead`) as HTMLInputElement;
      if (selectHead) {
        selectHead.addEventListener('change', () => {
          if (selectHead.checked) {
            if (this.result.data) {
              this.selectRows = this.result.data.map(item => item[this.rowKey]);
            }
          } else {
            this.selectRows = [];
          }
          this._reRenderSelectRowChecked();
        });
      }
    }

    if(this.options.resizable) {
      this._setResizeListener();
    }
  }

  private _renderTableHeadMenu(trigger: HTMLElement, field: string): void {
    interface MenuOption {
      key: string;
      title: string;
      icon: string;
    }

    const menu: MenuOption[] = [
      { key: 'asc', title: 'Ordenar Ascendente', icon: 'icon-asc' },
      { key: 'desc', title: 'Ordenar Descendente', icon: 'icon-desc' },
      { key: 'none', title: 'Limpiar Orden', icon: 'icon-none' },
      // { key: 'pin-left', title: 'Fijar a la izquierda', icon: 'icon-pin' },
      // { key: 'pin-right', title: 'Fijar a la derecha', icon: 'icon-pin' },
      { key: 'hide', title: 'Ocultar columna', icon: 'icon-eye-slash' },
      { key: 'columns', title: 'Elegir Columnas', icon: 'icon-columns' },
    ];

    const column = this._getColumnByField(field);
    if (!column) return;

    const hasSorter = this.columnSorters?.field === field ? this.columnSorters : null;

    const columnMenu = menu.filter(item => {
      if (['asc', 'desc', 'none'].includes(item.key)) {
        if (!column.sortable) {
          return false;
        }
        if (item.key === 'none' && !hasSorter) {
          return false;
        }
        if (item.key === 'asc' && hasSorter?.order === 'asc') {
          return false;
        }
        if (item.key === 'desc' && hasSorter?.order === 'desc') {
          return false;
        }
        return true;
      }

      return true;
    });

    let menuHtml = '';
    columnMenu.forEach((item) => {
      menuHtml += `<li class="menu-item jsAction" data-key="${item.key}">
                                    <span class="icon ${item.icon} mr-2"></span>${item.title}
                                </li>`;
    });

    menuHtml = `<ul class="menu" id="${this.options.entity}TableHeadMenu" style="right: 0; min-width: auto; border: 0">${menuHtml}</ul>`;

    const headMenuWrapper = document.createElement('div') as HTMLElement;
    headMenuWrapper.classList.add('menu-content');
    headMenuWrapper.insertAdjacentHTML('beforeend', menuHtml);
    new FilterColumn(headMenuWrapper, {
      field,
      inputType: column.type!,
      filterValues: column?.filterValues ?? (() => Promise.resolve([])),
      filterModel: this.filter?.getFilterModel() as FilterModel,
      onChange: (apply: boolean, newFilterModel: FilterModel) => {
        if (apply) {
          this.filter?.setFilterModel(newFilterModel);
          this._renderTableHead();
          this.getData();
        }
        Menu.closeLastMenu();
      }
    });

    this.renderMenuPortal('col' + field, trigger, headMenuWrapper, true, false);

    const handleTableHeadMenuClick = (key: string): void => {
      switch (key) {
        case 'asc':
          this.columnSorters = { field, order: 'asc' };
          this._renderTableHead();
          this.getData();
          break;
        case 'desc':
          this.columnSorters = { field, order: 'desc' };
          this._renderTableHead();
          this.getData();
          break;
        case 'none':
          this.columnSorters = { field: this.rowKey, order: 'desc' };
          this._renderTableHead();
          this.getData();
          break;
        case 'hide':
          this.options.columns = this.options.columns.map(item => item.field === field ? ({ ...item, visible: false }) : item);
          this._reRenderColumnFilter(true);
          break;
        case 'columns':
          Menu.open(`${this.options.entity}DataTableFilter`);
          break;
        default:
          break;
      }
    };

    const tableHeadMenu = document.getElementById(`${this.options.entity}TableHeadMenu`);
    if (tableHeadMenu) {
      [...tableHeadMenu.children].forEach(item => {
        if (item instanceof HTMLElement) {
          item.addEventListener('click', () => {
            const key = item.dataset.key!;
            handleTableHeadMenuClick(key);
            Menu.closeLastMenu();
          });
        }
      });
    }
  }

  private _renderTableBody(): void {
    this._setDefaultValues();

    let tableBodyHtml = '';
    if (this.result.data.length === 0) {
      tableBodyHtml += this._buildEmptyRow();
    } else {
      this.result.data.forEach(item => {
        // Prepare to render
        const paramValues = this._getTableActionParamValues(item);
        if (this.options.rowRender && typeof this.options.rowRender === "function") {
          tableBodyHtml += this.options.rowRender(item, this, paramValues);
        } else {
          tableBodyHtml += `<tr class="${item.state == 0 ? 'canceled' : ''}" key="${item.id}" data-params="${paramValues}">
                                            ${this._buildSelectColumn(item)}
                                            ${this._buildDataRow(item)}
                                        </tr>`;
        }

        // Prepate to summary
        this.summaryFields = this.summaryFields.map(summary => {
          const newValue = parseFloat(item[summary.field] || 0);
          return ({ ...summary, values: [...summary.values, newValue] });
        });
      });
    }

    let entityTableBody = document.getElementById(`${this.options.entity}TableBody`);
    if (!entityTableBody) return;

    entityTableBody.innerHTML = tableBodyHtml;

    // Render summary
    this._renderSummary();

    // Render pagination
    this._initializePagination();

    // Dispatch event
    if (this.options.updated && typeof this.options.updated === "function") {
      this.options.updated(this);
    }

    // If not found data
    if (this.result.data.length === 0) {
      return;
    }

    // Select listeners
    if (this.options.selectable) {
      const tableRowSelect = document.querySelectorAll(`[id^="${this.options.entity}TableRowSelect"]`);
      [...tableRowSelect].forEach((item: Element) => {
        if (item instanceof HTMLInputElement) {
          item.addEventListener('change', () => {
            const selectId = item.dataset.id!;
            if (item.checked) {
              if (this.selectRows.indexOf(selectId) === -1) {
                if (this.options.selectableRadio) {
                  this.selectRows = [selectId];
                } else {
                  this.selectRows.push(selectId);
                }
              }
            } else {
              this.selectRows = this.options.selectableRadio ? [] : this.selectRows.filter(i => i != selectId);
            }
            this._reRenderSelectRowChecked();
          });
        }
      });
    }

    // Menu Listeners
    if (this._getTableActions().length > 0) {
      const tableRowMenus = document.querySelectorAll(`[id^="${this.options.entity}TableMenu"]`);
      [...tableRowMenus].forEach((element: Element) => {
        element.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();

          if (element instanceof HTMLElement) {
            const id = element.getAttribute('key')!;
            const params = (element.dataset.params ?? '').split('_');

            this._renderActionMenu(id, element, true, params);
          }
        });
      });

      const tableRow = document.querySelectorAll(`#${this.options.entity}Table tbody tr`);
      [...tableRow].forEach((tr: Element) => {
        tr.addEventListener('contextmenu', (e: Event) => {
          e.preventDefault();

          const mouseEvent = e as MouseEvent;

          if (tr instanceof HTMLElement) {
            const id = tr.getAttribute('key')!;
            const params = (tr.dataset.params ?? '').split('_');
            this._renderActionMenu(id, { x: mouseEvent.clientX, y: mouseEvent.clientY }, false, params);
          }
        });
      });
    }
  }

  private _setResizeListener(): void {
    const entityName = this.options.entity!;
    const table = document.getElementById(`${entityName}Table`);
    if (!table) return;

    let row = table.getElementsByTagName('tr')[0];
    let cols = row ? row.children : undefined;
    if (!cols) return;

    let tableHeight = table.offsetHeight;

    for (let i = 0; i < cols.length; i++) {
      let div = createDiv(tableHeight);
      cols[i].appendChild(div);
      // (cols[i] as HTMLElement).style.position = 'relative';
      setListeners(div);
    }

    function createDiv(_height: number): HTMLDivElement {
      let div = document.createElement('div');
      div.style.top = '0';
      div.style.right = '0';
      div.style.width = '5px';
      div.style.position = 'absolute';
      div.style.cursor = 'col-resize';
      div.style.userSelect = 'none';
      // div.style.height = height + 'px';
      div.style.height = '100%';
      return div;
    }

    function setListeners(div: HTMLDivElement): void {
      let pageX: number,
        curCol: HTMLElement | null,
        curColWidth: number,
        tableWidth: number;

      div.addEventListener('mousedown', function (e) {
        if (!table) return;

        tableWidth = table.offsetWidth;
        curCol = e.target as HTMLElement;
        curCol = curCol.parentElement as HTMLElement;
        pageX = e.pageX;

        let padding = paddingDiff(curCol);

        curColWidth = curCol.offsetWidth - padding;
      });

      div.addEventListener('mouseover', function (e) {
        (e.target as HTMLElement).style.borderRight = '2px solid var(--primary)';
      });

      div.addEventListener('mouseout', function (e) {
        (e.target as HTMLElement).style.borderRight = '';
      });

      document.addEventListener('mousemove', function (e) {
        if (curCol && table) {
          let diffX = e.pageX - pageX;
          curCol.style.width = (curColWidth + diffX) + 'px';
          table.style.width = tableWidth + diffX + "px";
        }
      });

      document.addEventListener('mouseup', function () {
        curCol = null;
        pageX = 0;
        curColWidth = 0;
      });
    }

    function paddingDiff(col: HTMLElement): number {
      if (getStyleVal(col, 'box-sizing') == 'border-box') {
        return 0;
      }

      let padLeft = getStyleVal(col, 'padding-left');
      let padRight = getStyleVal(col, 'padding-right');
      return (parseInt(padLeft) + parseInt(padRight));
    }

    function getStyleVal(elm: HTMLElement, css: string): string {
      return window.getComputedStyle(elm, null).getPropertyValue(css);
    }
  }

  private _renderSummary(): void {
    // Validate
    if (this.summaryFields.length === 0) {
      return;
    }

    // Init
    const calcValues = (values: number[] = [], ope = 'sum'): number => {
      if (values.length === 0) {
        return 0;
      }

      let total = 0;

      if (ope === 'sum' || ope === 'avg') {
        total = values.reduce((a, b) => a + b, 0);
      } else if (ope === 'max') {
        total = values.reduce((a, b) => a < b ? b : a, values[0]);
      } else if (ope === 'min') {
        total = values.reduce((a, b) => a > b ? b : a, values[0]);
      }

      if (ope === 'avg') {
        total = total / values.length;
      }

      return total;
    };

    const summaryHtml = this._getVisibleColumns().map(col => {
      const colData = this.summaryFields.find(summary => summary.field === col.field);
      return colData ? `<td>${FormatNumber(calcValues(colData.values, colData.summaryOperator ?? 'sum'))}</td>` : '<td></td>';
    }).join('');

    let entityTableFoot = document.getElementById(`${this.options.entity}TableFoot`);
    if (entityTableFoot) {
      entityTableFoot.innerHTML = `<tr>${this.options.selectable ? '<td></td>' : ''}${summaryHtml}</tr>`;
    }
  }

  private _initializePagination(): void {
    if (!this.pagination) {
      this.pagination = new Pagination({
        elementId: `${this.options.entity}Pagination`,
        entity: this.options.entity,
        result: this.result as PaginationResult,
        onChange: (page: number, limit: number) => {
          this.page = page;
          this.limit = limit;
          this.getData();
        }
      });
    } else {
      this.pagination.updateResult(this.result as PaginationResult);
    }
  }

  //  ========================================================================================
  //  T A B L E     Z O N E    B U I L D S
  _buildEmptyRow() {
    return `<tr>
                    <td colspan="${this.options.columns.length + (this.options.selectable ? 1 : 0)}">
                        <div class="empty">
                            <div>No hay datos que mostrar</div>
                        </div>
                    </td>
                </tr>`;
  }

  _buildMenuButton(col: TableColumn, item: any) {
    const paramValues = this._getTableActionParamValues(item);
    return `<td style="padding: 0"><div class="flex items-center justify-between jsAction"><span>${this._buildCustomRow(col, item)}</span><button type="button" class="btn btn-square btn-text btn-sm jsAction" id="${this.options.entity}TableMenu_${item.id}" key="${item.id}" data-params="${paramValues}" title="Mostrar más opciones"><i class="icon icon-menu-alt"></i></button></div></td>`;
  }

  _buildCustomRow(col: TableColumn, item: any) {
    if (col.customRender && typeof col.customRender === "function") {
      return col.customRender(item, this);
    } else {
      return item[col.field];
    }
  }

  _buildDataRow(item: any) {
    return this._getVisibleColumns().map((col, colIndex) => (colIndex === 0 && this._getTableActions().length > 0) ? this._buildMenuButton(col, item) : `<td>${this._buildCustomRow(col, item)}</td>`).join('')
  }

  //  ========================================================================================
  //  P O R T A L
  _renderActionMenu(id: string, positionOrElement: HTMLElement | VirtualPosition, toggle: boolean, params: any[] = []) {
    let actionHtml = '';
    this._getTableActions().forEach((act, idx) => {
      const eventName = (((act.event_name_prefix as string)?.length ?? 0) > 1 ? act.event_name_prefix : this.options.entity) + act.event_name;
      actionHtml += `<li class="menu-item jsAction" key="${act.id || idx}" onclick="${eventName}('${this.options.entity}','${act.screen_id_controller}', [${params.join(',')}])">
                                    <i class="${act.icon} mr-2"></i>${act.title}
                                </li>`;
    });

    actionHtml = `<ul class="menu shadow" style="right: 0; min-width: auto">${actionHtml}</ul>`;
    this.renderMenuPortal(id, positionOrElement, actionHtml, toggle);
  }

  renderMenuPortal(key: string, positionOrElement: HTMLElement | VirtualPosition, content: HTMLElement | string = "", toggle = true, autoClose = true) {
    Menu.portal(positionOrElement, content, { key, toggle, autoClose });
  }

  //  ========================================================================================
  //  C H E C K B O X      S E L E C T E D
  _buildSelectColumn(item: any) {
    if (this.options.selectable) {
      return `<td><input type="checkbox" class="jsAction" id="${this.options.entity}TableRowSelect${item[this.rowKey]}" data-id="${item[this.rowKey]}"></td>`;
    } else {
      return '';
    }
  }

  _reRenderSelectRowChecked() {
    ([...document.querySelectorAll(`[id^="${this.options.entity}TableRowSelect"]`)] as HTMLInputElement[]).forEach(row => {
      row.checked = false;
    });

    this.selectRows.forEach(row => {
      const rowSelect = document.getElementById(`${this.options.entity}TableRowSelect${row}`);
      if (rowSelect) {
        (rowSelect as HTMLInputElement).checked = true;
      }
    });

    if (this.options.onSelectChange && typeof this.options.onSelectChange === "function") {
      this.options.onSelectChange(this);
    }
  }

  //  ========================================================================================
  //  C U S T O M      F I L T E R
  setFilterModel(filterModel: FilterModel) {
    this.filter?.setFilterModel(filterModel);
    this.page = 1;
    this.getData();

    this._renderFilterDescriptions();
  }

  setTableColumnFilter(inputType: string | null, filterKey: string | null, fieldName: string, fieldValue: string) {
    const key = parseInt(filterKey || '', 10);
    const isRemovable = filterKey && !isNaN(key) && fieldValue.trim() === '';

    if (isRemovable) {
      this.filter?.removeFilter(key);
    } else {
      const isDateInput = inputType === 'date' || inputType === 'datetime-local';

      if (isDateInput) {
        const format = inputType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm';
        const isValid = dayjs(fieldValue, format, true).isValid();

        if (isValid) {
          this.filter?.setRootFilter(fieldName, fieldValue);
        }
      } else {
        this.filter?.setRootFilter(fieldName, fieldValue);
      }
    }

    this.page = 1;
    this._renderTableHead();
    this._renderFilterDescriptions();
    this.getData();
  }

  getTableColumnFilterValue(fieldName: string): ColumnFilterNode | undefined {
    const conditions = (this.filter?.getFilterModel() as JoinFilterNode)?.conditions;
    if (!conditions) return undefined;

    return conditions.find(
      item => item.filterType !== 'join' && item.field === fieldName
    ) as ColumnFilterNode | undefined;
  }

  _renderFilterDescriptions() {
    const formatValue = (type: string, value: string | number | null | undefined): string => {
      if (!['datetime-local', 'date'].includes(type)) {
        return value?.toString() ?? '';
      }
      if ((value?.toString() || '').length === 0) {
        return '';
      }

      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];

      const [date, _time] = value?.toString().split(" ") ?? [];
      const [year, month, day] = date?.toString().split("-") ?? [];
      const monthName = months[parseInt(month, 10) - 1];

      let result = `${parseInt(day, 10)} de ${monthName} de ${year}`;

      // if (time) {
      //   const [hourPart, minutePart] = time.split(":");
      //   result += ` a las ${hourPart}:${minutePart}`;
      // }

      return result;
    }

    const translateConditionToSql = (filter: ColumnFilterNode): string => {
      const operators = { ...FILTER_TEXT_FILTER_TYPE, ...FILTER_SCALAR_FILTER_TYPE, ...FILTER_RELATIVE_DATE_FILTER_TYPE };
      const colfield = this.options.columns.find(item => item.field === filter.field);

      let operationSql = '';
      if (filter.type === 'relativeDate') {
        const periods = { ...FILTER_RELATIVE_DATE_PERIODS, ...FILTER_RELATIVE_DATE_PERIOD };
        const intervalLabel = filter?.relativeInterval ? FILTER_RELATIVE_DATE_TYPE[filter.relativeInterval] : '';
        const periodLabel = filter.relativePeriod ? periods[filter.relativePeriod] : '';

        operationSql = `${colfield?.title} <strong>${intervalLabel} ${filter.relativeInterval !== 'this' ? filter.relativeDuration : ''} ${periodLabel}</strong>`;
        operationSql += ' desde ' + formatValue(filter.filterType, filter.filter1) + ' <strong>hasta</strong> ' + formatValue(filter.filterType, filter.filter2);
      } else {
        operationSql = `${colfield?.title} <strong>${operators[filter.type]}</strong> ${formatValue(filter.filterType, filter.filter1)}`;
        operationSql += filter.type === 'inRange' ? (' <strong>y</strong> ' + formatValue(filter.filterType, filter.filter2)) : '';
      }

      return `<span class="tag jsFilterDescriptionTag${this.options.entity}">
                  <span>${operationSql}</span>
                  <span class="btn btn-xs btn-circle ml-2 jsFilterDescriptionRemove${this.options.entity}" title="Quitar filtro" data-key="${filter.key}">X</span>
              </span>`;
    }

    const translateFilterToSqlCondition = (filters: FilterModel): string => {
      if (!filters.filterType) {
        return '';
      }

      if (filters.filterType === 'join') {
        const conditions = filters.conditions.map(condition => translateFilterToSqlCondition(condition)).filter(Boolean);
        if (conditions.length === 0) {
          return '';
        }

        const operator = (filters.type?.toLocaleUpperCase() === 'AND') ? ' Y ' : ' O ';
        return `(${conditions.join(operator)})`;
      }

      return translateConditionToSql(filters);
    }

    // Generate
    const filterModel = this.filter?.getFilterModel();
    if (!filterModel) {
      return;
    }

    const sqlCondition = translateFilterToSqlCondition(filterModel);
    const result = sqlCondition.replace(/^\(|\)$/g, '');

    // Render
    const filterDescription = document.getElementById(`${this.options.entity}FilterDescription`);
    if (filterDescription) {
      filterDescription.innerHTML = result;
    }

    // Filter description remove
    let jsFilterDescriptionRemove = document.querySelectorAll(`.jsFilterDescriptionRemove${this.options.entity}`);
    jsFilterDescriptionRemove.forEach(item => {
      const filterKey = item.getAttribute('data-key');

      item.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        this.filter?.removeFilter(parseInt(filterKey!));
        this.getData();

        this._renderTableHead();
      });
    });

    // Show modal
    let jsFilterDescriptionTag = document.querySelectorAll(`.jsFilterDescriptionTag${this.options.entity}`);
    jsFilterDescriptionTag.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        Modal.open(`${this.options.entity}ModalFilter`);
      });
    });
  }

  //  ========================================================================================
  //  S H O W     A N D     H I D E     C O L U M N S
  _reRenderColumnFilter(hasChange: boolean, search = '') {
    const listCols = document.getElementById(`${this.options.entity}ListCols`);
    if (!listCols) {
      return;
    }

    for (const item of listCols.children) {

      // Get elements
      const checkbox = item.querySelector('input') as HTMLInputElement;
      const colItem = this.options?.columns?.find(item => item.id === checkbox?.dataset.key);
      if (!colItem) {
        continue;
      }

      // cheked elments
      checkbox.checked = colItem.visible === true;

      // Hide and show columns
      if (search.length > 0) {
        item.classList.toggle('hidden', !colItem.title?.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
      } else {
        item.classList.remove('hidden');
      }
    }

    if (hasChange) {
      this._renderTableHead();
      this._renderTableBody();
    }
  }
}

export default Table;
