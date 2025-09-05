import Menu from './menu';
import { Modal } from './modal';
import PdFilter, { FILTER_RELATIVE_DATE_PERIOD, FILTER_RELATIVE_DATE_PERIODS, FILTER_RELATIVE_DATE_TILTER_TYPE, FILTER_RELATIVE_DATE_TYPE, FILTER_SCALAR_FILTER_TYPE, FILTER_TEXT_FILTER_TYPE } from './filter'
import { UniqueId, LoadingState, FormatNumber } from '../utils/conmon';
import { Freeze } from './freeze';

class Table {
  constructor(options) {
    // -------------------------------------------------------------------------------
    // Init vars ---------------------------------------------------------------------
    this.options = options;
    this.columnSorters = {};
    this.selectRows = [];
    this.rowKey = 'id';
    this.result = {};
    this.filter = null;
    this.limit = 20;
    this.page = 1;
    this.summaryFields = [];

    // Init var in options
    this.options.paramKeys ??= ['id'];
    this.options.actions ??= [];
    this.options.entity ??= UniqueId();
    this.options.elementId ??= '';
    this.options.selectable ??= true;
    this.options.columns ??= [];
    this.options.filters ??= {};
    this.options.tableHeadTopHtml ??= '';
    this.options.filterEnabled ??= true;
    this.options.selectableRadio ??= true;
    this.options.toolbar ??= '';
    this.options.sorter ??= {};

    // Default Sorter
    if (!!this.options.sorter.field) {
      this.columnSorters = this.options.sorter;
    } else if (this.rowKey.length > 0) {
      this.columnSorters = {
        field: this.rowKey,
        order: 'desc',
      }
    }

    // Summary cols
    this._setDefaultValues();

    // Init
    this._renderTemplate();
    this.getData();
  }

  //  ========================================================================================
  //  U T I L S
  _setDefaultValues() {
    // Set columns default properties
    this.options.columns = this.options.columns.map(item => ({
      ...item,
      id: item.id ?? UniqueId(),
      title: item.title ?? '',
      visible: [undefined, null, true, 1, '1'].includes(item.visible)
    })).sort((a, b) => a.position_index - b.position_index);

    // Init summary fields
    this.summaryFields = this.options.columns.filter(item => item.type === 'number' && !!item.summaryOperator).map(item => ({ ...item, values: [] }));
  }

  _getTableActionParamValues(row) {
    // Get values
    let items = Object.entries(row).filter(([key, value]) => this.options.paramKeys.includes(key));

    // Order
    items.sort((a, b) => {
      let positionA = this.options.paramKeys.indexOf(a[0]);
      let positionB = this.options.paramKeys.indexOf(b[0]);
      return positionA - positionB;
    })

    // Set only values and is string in ""
    items = items.map(([key, val]) => (typeof val === 'string') ? `'${val}'` : val);

    // Return value in string
    return items.join('_');
  }

  _getTableActions() {
    return this.options.actions.filter(item => item.position === 'TABLE');
  }

  _getVisibleColumns() {
    return this.options.columns.filter(item => [true, 1, '1'].includes(item.visible));
  }

  _getColumnByField(field) {
    return this.options.columns.find(item => item.field === field);
  }

  //  ========================================================================================
  //  T A B L E     Z O N E
  //  ========================================================================================
  getData() {
    Freeze.freeze({ selector: `#${this.options.elementId}` });
    LoadingState(true, 'jsAction');
    this.options.data({
      filter: this.filter?.getFilterModel() ?? {},
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
      .finally((e) => {
        Freeze.unFreeze(`#${this.options.elementId}`);
        LoadingState(false, 'jsAction');
      });
  }

  _renderTemplate() {
    let tableEle = document.getElementById(this.options.elementId);

    // Render table base
    tableEle.innerHTML = `<div id="${this.options.entity}DataTable" class="data-table">
                                    <div class="flex justify-between mb-2" id="${this.options.entity}DataTableToolbar">
                                        <div class="flex wrap gap" id="${this.options.entity}FilterDescription"></div>
                                        <div class="flex gap">${this.options.toolbar}
                                            <div class="btn sm circle jsAction" data-modaltrigger="${this.options.entity}ModalFilter" id="${this.options.entity}ModalFilterToggle"><span class="icon icon-filter"></span></div>
                                            <div class="modal-wrapper" data-modal="${this.options.entity}ModalFilter" data-maskclose="false">
                                                <div class="modal" style="max-width: 90vw;">
                                                    <div class="modal-close" data-modalclose="${this.options.entity}ModalFilter" id="${this.options.entity}ModalFilterClose"><span class="icon icon-cross"></span></div>
                                                    <div class="modal-header">Filtro</div>
                                                    <div class="modal-body">
                                                        <div id="${this.options.entity}FilterWrapper"></div>
                                                        <button class="btn rounded block primary mt-3" id="${this.options.entity}FilterAply"><span class="icon icon-filter"></span>Aplicar filtro</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="btn sm circle jsAction" data-menutrigger="${this.options.entity}DataTableFilter"><span class="icon icon-columns"></span></div>
                                            <div class="menu-overlay no-closable" data-menu="${this.options.entity}DataTableFilter">
                                                <div class="menu-content data-table-filter">
                                                    <div class="form-item inner">
                                                        <label for="headerCompany" class="form-label">Buscar columna</label>
                                                        <input type="search" class="form-control sm" id="${this.options.entity}SearchCols">
                                                    </div>
                                                    <ul class="list data-table-filter-list" id="${this.options.entity}ListCols">
                                                        ${this.options.columns.map(col => `<li><input type="checkbox" class="js${this.options.entity}ToggleCols" data-key="${col.id}" ${col.visible === true ? 'checked' : ''}><span class="ml-2">${col.title}</span></li>`).join('')}
                                                    </ul>
                                                    <div class="data-table-filter-footer">
                                                        <button class="btn rounded" id="${this.options.entity}HideAllCols">Ocultar todo</button>
                                                        <button class="btn rounded ml-3" id="${this.options.entity}ShowAllCols">Mostrar todo</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="data-table-table">
                                        <div class="table-wrapper">
                                            <table class="table" id="${this.options.entity}Table">
                                                <thead id="${this.options.entity}TableHead"></thead>
                                                <tbody id="${this.options.entity}TableBody">${this._buildEmptyRow()}</tbody>
                                                <tfoot id="${this.options.entity}TableFoot"></tfoot>
                                            </table>
                                        </div>
                                        <div id="${this.options.entity}Pagination"></div>
                                    </div>
                                    <div class="data-table-detail" id="${this.options.entity}data_table_detail">
                                    </div>
                                </div>`;

    // Render filter
    if (this.options.filterEnabled) {
      this.filter = new PdFilter({
        fields: this.options.columns.filter(item => [undefined, true].includes(item.filterable)),
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
    filterToggle.addEventListener('click', (e) => {
      e.preventDefault();
      Modal.open(`${this.options.entity}ModalFilter`);
    });

    const filterClose = document.getElementById(`${this.options.entity}ModalFilterClose`);
    filterClose.addEventListener('click', (e) => {
      e.preventDefault();
      Modal.close(`${this.options.entity}ModalFilter`);
    });

    const filterAply = document.getElementById(`${this.options.entity}FilterAply`);
    filterAply.addEventListener('click', e => {
      e.preventDefault();
      this.getData();
      Modal.close(`${this.options.entity}ModalFilter`);
    });

    // ===================================================================================================
    // S H O W   A N D   H I D E   C O L U M N S
    // ===================================================================================================
    const searchCols = document.getElementById(`${this.options.entity}SearchCols`);
    searchCols.addEventListener('input', e => {
      this._reRenderColumnFilter(false, searchCols.value);
    });

    const toggleCols = document.querySelectorAll(`.js${this.options.entity}ToggleCols`);
    toggleCols.forEach(checkbox => {
      checkbox.addEventListener('change', e => {
        this.options.columns = this.options.columns.map(item => ({ ...item, visible: (item.id === checkbox.dataset.key ? checkbox.checked : item.visible) }));
        this._reRenderColumnFilter(true);
      });
    });

    // hide all
    const hideAllCols = document.getElementById(`${this.options.entity}HideAllCols`);
    hideAllCols.addEventListener('click', e => {
      this.options.columns = this.options.columns.map(item => ({ ...item, visible: false }));
      this._reRenderColumnFilter(true);
    });

    // show all
    const showAllCols = document.getElementById(`${this.options.entity}ShowAllCols`);
    showAllCols.addEventListener('click', e => {
      this.options.columns = this.options.columns.map(item => ({ ...item, visible: true }));
      this._reRenderColumnFilter(true);
    });
  }

  _renderTableHead() {
    let entityTableHead = document.getElementById(`${this.options.entity}TableHead`);

    // Head Table
    let tableHeadHtml = '';
    this._getVisibleColumns().forEach(item => {
      tableHeadHtml += `<th ${item.style != undefined ? `style="${item.style}"` : ''} title="${item.tooltip || item.title}">
                                <div class="data-table-caption">
                                    <div class="data-table-caption-left">${item.title}</div>
                                    <div class="btn square text sm jsTableColMenu${this.options.entity}" data-field="${item.field}"><span class="icon icon-menu-alt"></span></div>
                                </div>
                                ${item.filterable ? `<input type="${(item.type === 'datetime-local' || item.type === 'date') ? item.type : 'search'}" value="${this.getTableColumnFilterValue(item.field) ?? ''}" class="jsFilterValue${this.options.entity} form-control sm mt-1 mb-1 not-print" data-field="${item.field}">` : ''}
                            </th>`;
    });

    entityTableHead.innerHTML = `${this.options.tableHeadTopHtml}
                                    <tr>
                                        ${this.options.selectable ? (this.options.selectableRadio ? '<th class="not-print"></th>' : `<th class="not-print"><input type="checkbox" id="${this.options.entity}TableSelectHead"></th>`) : ''}
                                        ${tableHeadHtml}
                                    </tr>`;

    // Filter listeners
    let filterValue = document.querySelectorAll(`.jsFilterValue${this.options.entity}`);
    filterValue.forEach(item => {
      const inputType = item.getAttribute('type');

      // Change listener -- EXPERIMENTAL
      if (inputType === 'date' || inputType === 'datetime-local') {
        item.addEventListener('change', e => {
          this.setTableColumnFilter(e.target.dataset.field, e.target.value);
        });
      }

      // Key Up Listener
      item.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
          this.setTableColumnFilter(e.target.dataset.field, e.target.value);
        }
      });
    });

    // Sort listeners jsTableColMenu
    let colMenu = document.querySelectorAll(`.jsTableColMenu${this.options.entity}`);
    colMenu.forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        let field = item.dataset.field;
        this._renderTableHeadMenu(item, field);
      });
    });

    // Selected lsitener
    if (this.options.selectable) {
      const selectHead = document.getElementById(`${this.options.entity}TableSelectHead`);
      if (selectHead) {
        selectHead.addEventListener('change', e => {
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

    this._setResizeListener();
  }

  _renderTableHeadMenu(trigger, field) {
    const menu = [
      { key: 'asc', title: 'Ordenar Ascendente', icon: 'icon-asc' },
      { key: 'desc', title: 'Ordenar Descendente', icon: 'icon-desc' },
      { key: 'none', title: 'Limpiar Orden', icon: 'icon-none' },
      // { key: 'filter', title: 'Filtros', icon: 'icon-filter' },
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
    columnMenu.forEach((item, idx) => {
      menuHtml += `<li class="menu-item jsAction" data-key="${item.key}">
                                    <span class="icon ${item.icon} mr-2"></span>${item.title}
                                </li>`;
    });

    menuHtml = `<ul class="menu" id="${this.options.entity}TableHeadMenu" style="right: 0; min-width: auto">${menuHtml}</ul>`;
    this.renderMenuPortal('col' + field, trigger, menuHtml, true);

    const handleTableHeadMenuClick = (key) => {
      switch (key) {
        case 'asc':
          this.columnSorters = { field, order: 'asc' };
          this.getData();
          break;
        case 'desc':
          this.columnSorters = { field, order: 'desc' };
          this.getData();
          break;
        case 'none':
          this.columnSorters = { field: this.rowKey, order: 'desc' };
          this.getData();
          break;
        case 'hide':
          this.options.columns = this.options.columns.map(item => item.field === field ? ({ ...item, visible: false }) : item);
          this._reRenderColumnFilter(true);
          break;
        case 'columns':
          break;
        default:
          break;
      }
    }

    const tableHeadMenu = document.getElementById(`${this.options.entity}TableHeadMenu`);
    [...tableHeadMenu.children].forEach(item => {
      item.addEventListener('click', e => {
        const key = item.dataset.key;
        handleTableHeadMenuClick(key);
      });
    });
  }

  _renderTableBody() {
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
    entityTableBody.innerHTML = tableBodyHtml;

    // Render summary
    this._renderSummary();

    // Render pagination
    this._renderPagination();

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
      [...tableRowSelect].forEach(item => {
        item.addEventListener('change', e => {
          const selectId = item.dataset.id;
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
      });
    }

    // Menu Listeners
    if (this._getTableActions().length > 0) {
      const tableRowMenus = document.querySelectorAll(`[id^="${this.options.entity}TableMenu"]`);
      [...tableRowMenus].forEach(element => {
        element.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();

          const id = element.getAttribute('key');
          const params = (element.dataset.params ?? '').split('_');

          this._renderActionMenu(id, element, true, params);
        });
      });

      const tableRow = document.querySelectorAll(`#${this.options.entity}Table tbody tr`);
      [...tableRow].forEach(tr => {
        tr.addEventListener('contextmenu', e => {
          e.preventDefault();

          const id = tr.getAttribute('key');
          const params = (tr.dataset.params ?? '').split('_');
          this._renderActionMenu(id, { x: e.clientX, y: e.clientY }, false, params);
        });
      });
    }
  }

  _setResizeListener() {
    const entityName = this.options.entity;
    const table = document.getElementById(`${entityName}Table`);

    let row = table.getElementsByTagName('tr')[0],
      cols = row ? row.children : undefined;
    if (!cols) return;

    table.style.overflow = 'hidden';

    let tableHeight = table.offsetHeight;

    for (let i = 0; i < cols.length; i++) {
      let div = createDiv(tableHeight);
      cols[i].appendChild(div);
      cols[i].style.position = 'relative';
      setListeners(div);
    }

    function setListeners(div) {
      let pageX, curCol, nxtCol, curColWidth, nxtColWidth, tableWidth;

      div.addEventListener('mousedown', function (e) {

        tableWidth = document.getElementById(`${entityName}Table`).offsetWidth;
        curCol = e.target.parentElement;
        nxtCol = curCol.nextElementSibling;
        pageX = e.pageX;

        let padding = paddingDiff(curCol);

        curColWidth = curCol.offsetWidth - padding;
        //  if (nxtCol)
        //nxtColWidth = nxtCol.offsetWidth - padding;
      });

      div.addEventListener('mouseover', function (e) {
        e.target.style.borderRight = '2px solid var(--primary)';
      })

      div.addEventListener('mouseout', function (e) {
        e.target.style.borderRight = '';
      })

      document.addEventListener('mousemove', function (e) {
        if (curCol) {
          let diffX = e.pageX - pageX;

          // if (nxtCol)
          //nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';

          curCol.style.width = (curColWidth + diffX) + 'px';
          document.getElementById(`${entityName}Table`).style.width = tableWidth + diffX + "px"
        }
      });

      document.addEventListener('mouseup', function (e) {
        curCol = undefined;
        nxtCol = undefined;
        pageX = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined
      });
    }

    function createDiv(height) {
      let div = document.createElement('div');
      div.style.top = 0;
      div.style.right = 0;
      div.style.width = '5px';
      div.style.position = 'absolute';
      div.style.cursor = 'col-resize';
      div.style.userSelect = 'none';
      // div.style.height = height + 'px';
      div.style.height = '100%';
      return div;
    }

    function paddingDiff(col) {

      if (getStyleVal(col, 'box-sizing') == 'border-box') {
        return 0;
      }

      let padLeft = getStyleVal(col, 'padding-left');
      let padRight = getStyleVal(col, 'padding-right');
      return (parseInt(padLeft) + parseInt(padRight));

    }

    function getStyleVal(elm, css) {
      return (window.getComputedStyle(elm, null).getPropertyValue(css))
    }
  }

  _renderSummary() {
    // Validate
    if (this.summaryFields.length === 0) {
      return;
    }

    // Init
    const calcValues = (values = [], ope = 'sum') => {
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
    }

    const summaryHtml = this._getVisibleColumns().map(col => {
      const colData = this.summaryFields.find(summary => summary.field === col.field);
      return colData ? `<td>${FormatNumber(calcValues(colData.values, colData.summaryOperator ?? 'sum'))}</td>` : '<td></td>';
    }).join('');

    let entityTableFoot = document.getElementById(`${this.options.entity}TableFoot`);
    entityTableFoot.innerHTML = `<tr>${this.options.selectable ? '<td></td>' : ''}${summaryHtml}</tr>`;
  }

  _renderPagination() {
    const result = this.result;
    let page = parseInt(result.current);
    let pages = parseInt(result.pages);
    let limit = parseInt(result.limit);
    let totalRows = parseInt(result.total);
    let startRow = (page - 1) * limit + 1;
    let endRow = Math.min(page * limit, totalRows);

    let pagina = parseInt(result.current);
    let totalPage = parseInt(result.pages);
    let lastPage = totalPage;

    let paginationHtml = '';
    // if (totalPage > 1) {
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
        </button>`
    // }

    let selectHtml = [10, 20, 50, 100, 200, 300, 500, 1000].map(value => `<option value="${value}" ${value == result.limit ? 'selected' : ''}>${value}</option>`).join('');

    let tableFooter = `<div class="flex gap items-center justify-end mt-3">
              <div class="flex gap items-center">
                <label htmlFor="${this.options.entity}Limit" style="white-space: nowrap;">Filas por Página:</label>
                <select class="form-control sm" id="${this.options.entity}Limit">${selectHtml}</select>
              </div>
              <div>${startRow} a ${endRow} de ${totalRows}</div>
              <div class="flex gap items-center">${paginationHtml}</div>
            </div>`;

    let entityPagination = document.getElementById(`${this.options.entity}Pagination`);
    entityPagination.innerHTML = tableFooter;


    // Limit Event
    let entityLimit = document.getElementById(`${this.options.entity}Limit`);
    entityLimit.addEventListener('change', () => {
      this.limit = entityLimit.value;
      this.page = 1;
      this.getData();
    });

    // Pagination listeners
    if (totalPage > 1) {
      let previousPageEle = document.getElementById(`${this.options.entity}PreviousPage`);
      if (previousPageEle) {
        previousPageEle.addEventListener('click', e => {
          e.preventDefault();
          this.page = pagina - 1;
          this.getData();
        });
      }

      let firstPageEle = document.getElementById(`${this.options.entity}FirstPage`);
      if (firstPageEle) {
        firstPageEle.addEventListener('click', e => {
          e.preventDefault();
          this.page = 1;
          this.getData();
        });
      }

      let pageEle = document.querySelectorAll(`.js${this.options.entity}Page`);
      pageEle.forEach(p => {
        p.addEventListener('click', e => {
          e.preventDefault();
          this.page = p.dataset.id;
          this.getData();
        });
      });

      let lastPageEle = document.getElementById(`${this.options.entity}LastPage`);
      if (lastPageEle) {
        lastPageEle.addEventListener('click', e => {
          e.preventDefault();
          this.page = lastPage;
          this.getData();
        });
      }

      let nextPageEle = document.getElementById(`${this.options.entity}NextPage`);
      if (nextPageEle) {
        nextPageEle.addEventListener('click', e => {
          e.preventDefault();
          this.page = pagina + 1;
          this.getData();
        });
      }
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

  _buildMenuButton(col, item) {
    const paramValues = this._getTableActionParamValues(item);
    return `<td style="padding: 0"><div class="flex items-center justify-between jsAction"><span>${this._buildCustomRow(col, item)}</span><button type="button" class="btn square text sm jsAction" id="${this.options.entity}TableMenu_${item.id}" key="${item.id}" data-params="${paramValues}" title="Mostrar más opciones"><i class="icon icon-menu-alt"></i></button></div></td>`;
  }

  _buildCustomRow(row, item) {
    if (row.customRender && typeof row.customRender === "function") {
      return row.customRender(item, this);
    } else {
      return item[row.field];
    }
  }

  _buildDataRow(item) {
    return this._getVisibleColumns().map((col, colIndex) => (colIndex === 0 && this._getTableActions().length > 0) ? this._buildMenuButton(col, item) : `<td>${this._buildCustomRow(col, item)}</td>`).join('')
  }

  //  ========================================================================================
  //  P O R T A L
  _renderActionMenu(id, positionOrElement, toggle, params = []) {
    let actionHtml = '';
    this._getTableActions().forEach((act, idx) => {
      const eventName = (act?.event_name_prefix?.length > 1 ? act.event_name_prefix : this.options.entity) + act.event_name;
      actionHtml += `<li class="menu-item jsAction" key="${act.id || idx}" onclick="${eventName}('${this.options.entity}','${act.screen_id_controller}', [${params.join(',')}])">
                                    <i class="${act.icon} mr-2"></i>${act.title}
                                </li>`;
    });

    actionHtml = `<ul class="menu shadow" style="right: 0; min-width: auto">${actionHtml}</ul>`;
    this.renderMenuPortal(id, positionOrElement, actionHtml, toggle);
  }

  renderMenuPortal(key, positionOrElement, content = "", toggle = true) {
    Menu.portal(positionOrElement, content, { key, toggle });
  }

  //  ========================================================================================
  //  C H E C K B O X      S E L E C T E D
  _buildSelectColumn(item) {
    if (this.options.selectable) {
      return `<td><input type="checkbox" class="jsAction" id="${this.options.entity}TableRowSelect${item[this.rowKey]}" data-id="${item[this.rowKey]}"></td>`;
    } else {
      return '';
    }
  }

  _reRenderSelectRowChecked() {
    [...document.querySelectorAll(`[id^="${this.options.entity}TableRowSelect"]`)].forEach(row => {
      row.checked = false;
    });

    this.selectRows.forEach(row => {
      const rowSelect = document.getElementById(`${this.options.entity}TableRowSelect${row}`);
      if (rowSelect) {
        rowSelect.checked = true;
      }
    });

    if (this.options.onSelectChange && typeof this.options.onSelectChange === "function") {
      this.options.onSelectChange(this);
    }
  }

  //  ========================================================================================
  //  C U S T O M      F I L T E R
  setFilterModel(filterModel) {
    this.filter.setFilterModel(filterModel);
    this.page = 1;
    this.getData();

    this._renderFilterDescriptions();
  }

  setTableColumnFilter(fieldName, fieldValue) {
    this.filter.setRootFilter(fieldName, fieldValue);
    this.page = 1;
    this.getData();

    this._renderFilterDescriptions();
  }

  getTableColumnFilterValue(fieldName) {
    const filterModel = this.filter.getFilterModel();
    const columnFilters = filterModel.conditions.filter(item => item.filterType !== 'join');
    if (columnFilters.length === 0) {
      return '';
    }
    const entry = columnFilters.find(item => item.field === fieldName);
    return entry?.filter1;
  }

  _renderFilterDescriptions() {
    const formatValue = (type, value) => {
      if (!['datetime-local', 'date'].includes(type)) {
        return value;
      }
      if ((value || '').length === 0) {
        return value;
      }

      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];

      const [date, time] = value.split(" ");
      const [year, month, day] = date.split("-");
      const monthName = months[parseInt(month, 10) - 1];

      let result = `${parseInt(day, 10)} de ${monthName} de ${year}`;

      // if (time) {
      //   const [hourPart, minutePart] = time.split(":");
      //   result += ` a las ${hourPart}:${minutePart}`;
      // }

      return result;
    }

    const translateConditionToSql = (filter) => {
      const operators = { ...FILTER_TEXT_FILTER_TYPE, ...FILTER_SCALAR_FILTER_TYPE, ...FILTER_RELATIVE_DATE_TILTER_TYPE };
      const colfield = this.options.columns.find(item => item.field === filter.field);

      let operationSql = '';
      if (filter.type === 'relativeDate') {
        const periods = { ...FILTER_RELATIVE_DATE_PERIODS, ...FILTER_RELATIVE_DATE_PERIOD };
        operationSql = `${colfield?.title} <strong>${FILTER_RELATIVE_DATE_TYPE[filter.relativeInterval]} ${filter.relativeInterval !== 'this' ? filter.relativeDuration : ''} ${periods[filter.relativePeriod]}</strong>`;
        operationSql += ' desde ' + formatValue(filter.filterType, filter.filter1) + ' <strong>hasta</strong> ' + formatValue(filter.filterType, filter.filter2);
      } else {
        operationSql = `${colfield?.title} <strong>${operators[filter.type]}</strong> ${formatValue(filter.filterType, filter.filter1)}`;
        operationSql += filter.type === 'inRange' ? (' <strong>y</strong> ' + formatValue(filter.filterType, filter.filter2)) : '';
      }

      return `<span class="tag jsFilterDescriptionTag${this.options.entity}">
                  <span>${operationSql}</span>
                  <span class="btn xs circle ml-2 jsFilterDescriptionRemove${this.options.entity}" title="Quitar filtro" data-key="${filter.key}">X</span>
              </span>`;
    }

    const translateFilterToSqlCondition = (filters) => {
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
    const filterModel = this.filter.getFilterModel();
    const sqlCondition = translateFilterToSqlCondition(filterModel);
    const result = sqlCondition.replace(/^\(|\)$/g, '');

    // Render
    const filterDescription = document.getElementById(`${this.options.entity}FilterDescription`);
    filterDescription.innerHTML = result;

    // Filter description remove
    let jsFilterDescriptionRemove = document.querySelectorAll(`.jsFilterDescriptionRemove${this.options.entity}`);
    jsFilterDescriptionRemove.forEach(item => {
      const filterKey = item.dataset.key;

      item.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        this.filter.removeFilter(filterKey);
        this.getData();

        // Only in filter head
        // if (parentid == '0') {
        //   this._renderTableHead();
        // }
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
  _reRenderColumnFilter(hasChange, search = '') {
    const listCols = document.getElementById(`${this.options.entity}ListCols`);
    for (const item of listCols.children) {

      // Get elements
      const checkbox = item.querySelector('input');
      const colItem = this.options.columns.find(item => item.id === checkbox.dataset.key);

      if (colItem) {
        // cheked elments
        checkbox.checked = colItem.visible === true;

        // Hide and show columns
        if (search.length > 0) {
          item.classList.toggle('hidden', !colItem.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
        } else {
          item.classList.remove('hidden');
        }
      }
    }

    if (hasChange) {
      this._renderTableHead();
      this._renderTableBody();
    }
  }
}

export default Table;
