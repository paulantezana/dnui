import { uniqueId } from "../main";
import { DOMUtils } from "./filter";
import { FILTER_RELATIVE_DATE_FILTER_TYPE, FILTER_SCALAR_FILTER_TYPE, FILTER_TEXT_FILTER_TYPE, type ColumnFilterNode, type DnInputType, type FilterModel, type JoinFilterNode } from "./filterModel";
import { getDefaultFilterType, isScalarType } from "./filterService";

interface FilterColumnOptions {
  field: string;
  inputType: DnInputType;
  filterValues: (params: any) => Promise<string[]>;
  filterModel: FilterModel;
  onChange: (apply: boolean, newFilterModel: FilterModel) => void;
}

export class FilterColumn {
  private options: FilterColumnOptions;

  private colSimpleFilter: ColumnFilterNode;
  private colMultiFilter: ColumnFilterNode;

  private topElement: HTMLElement;
  private middleElement: HTMLElement;
  private bottomElement: HTMLElement;

  constructor(container: HTMLElement, options: FilterColumnOptions) {
    this.options = options;

    this.topElement = DOMUtils.createElement('div', { classNames: 'p-2' });
    this.middleElement = DOMUtils.createElement('div');
    this.bottomElement = DOMUtils.createElement("div", { classNames: "flex gap-2 p-2" });

    container.append(this.topElement);
    container.append(this.middleElement);
    container.append(this.bottomElement);

    this.colSimpleFilter = {
      key: uniqueId(),
      filterType: options.inputType,
      field: options.field,
      type: getDefaultFilterType(options.inputType),
      filter1: '',
    } as ColumnFilterNode;

    this.colMultiFilter = {
      key: uniqueId(),
      filterType: options.inputType,
      field: options.field,
      type: 'in',
      filter1: '',
    } as ColumnFilterNode;

    this.render();
  }

  private render(): void {
    const columnFilters = (this.options.filterModel as JoinFilterNode)?.conditions.filter(item => item.filterType !== 'join') || [];
    const matchingFilters = columnFilters.filter(item => item.field === this.options.field && item.type !== 'in');
    const secodMatchingFilter = columnFilters.filter(item => item.field === this.options.field && item.type === 'in');

    if (matchingFilters.length > 0) {
      this.colSimpleFilter = matchingFilters[0];
    }

    if (secodMatchingFilter.length > 0) {
      this.colMultiFilter = secodMatchingFilter[0];
    }

    this.simpleFilter();
    this.multiFilter();
    this.footer();
  }

  private simpleFilter(): void {
    this.topElement.innerHTML = '';
    this.topElement.style.borderBottom = '1px solid var(--border-color)';
    this.topElement.style.borderTop = '1px solid var(--border-color)';

    // Select
    const typeFilterOptions = isScalarType(this.options.inputType)
      ? (this.options.inputType === 'date'
        ? ({ ...FILTER_RELATIVE_DATE_FILTER_TYPE, ...FILTER_SCALAR_FILTER_TYPE })
        : FILTER_SCALAR_FILTER_TYPE)
      : FILTER_TEXT_FILTER_TYPE;

    const typeSelect = DOMUtils.createSelect(typeFilterOptions, {
      selectedValue: this.colSimpleFilter?.type,
      classNames: 'form-control sm mb-2',
      onChange: (value: string) => {
        this.colSimpleFilter = {
          ...this.colSimpleFilter,
          type: value as any,
        };
        this.simpleFilter();
      }
    });

    this.topElement.append(typeSelect);

    // Input 1
    const value1Input = DOMUtils.createElement("input", {
      attributes: {
        type: this.options.inputType,
        value: this.colSimpleFilter?.filter1?.toString() || ''
      },
      classNames: 'form-control sm',
    });
    value1Input.onchange = () => {
      this.colSimpleFilter = {
        ...this.colSimpleFilter,
        filter1: value1Input.value
      };
      this.simpleFilter();
    };
    this.topElement.append(value1Input);

    // Input 2
    let value2Input: HTMLInputElement | null = null;
    if (this.colSimpleFilter?.type === 'inRange') {
      value2Input = DOMUtils.createElement("input", {
        attributes: {
          type: this.options.inputType,
          value: this.colSimpleFilter?.filter2?.toString() || ''
        },
        classNames: 'form-control sm mt-2',
      });
      value2Input.onchange = () => {
        this.colSimpleFilter = {
          ...this.colSimpleFilter,
          filter2: value2Input?.value
        };
        this.simpleFilter();
      };
      this.topElement.append(value2Input);
    }
  }

  private async multiFilter(): Promise<void> {
    const values = await this.options.filterValues({
      field: this.options.field,
      inputType: this.options.inputType,
    });

    if (!values || values.length === 0) return;

    this.middleElement.innerHTML = '';
    this.middleElement.style.borderBottom = '1px solid var(--border-color)';
    this.middleElement.className = 'p-2';

    const allValuesSet = new Set(values);
    const selectedValues = new Set(
      (this.colMultiFilter.filter1?.toString().split(',') || []).filter(Boolean)
    );

    const isFiltering = selectedValues.size > 0 && selectedValues.size !== allValuesSet.size;

    const currentSelection = isFiltering ? selectedValues : allValuesSet;

    const searchInput = DOMUtils.createElement('input', {
      attributes: { type: 'search', placeholder: 'Buscar...' },
      classNames: 'form-control sm mb-2',
    });

    const list = DOMUtils.createElement('div');
    list.style.maxHeight = '150px';
    list.style.overflowY = 'auto';
    list.tabIndex = 0;
    list.classList.add('outline', 'outline-none');

    const updateFilter = () => {
      const checkboxes = list.querySelectorAll<HTMLInputElement>('input[type=checkbox]:not([data-select-all])');
      const selected = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      // Actualiza el filtro
      this.colMultiFilter = {
        ...this.colMultiFilter,
        filter1: selected.length === values.length ? '' : selected.join(',')
      };

      // Actualiza el checkbox de "Seleccionar todo"
      const selectAllCheckbox = list.querySelector<HTMLInputElement>('input[data-select-all]');
      if (selectAllCheckbox) {
        const total = checkboxes.length;
        const checked = selected.length;

        selectAllCheckbox.checked = checked === total;
        selectAllCheckbox.indeterminate = checked > 0 && checked < total;
      }
    };

    const renderList = (filtered: string[]) => {
      list.innerHTML = '';

      const allSelected = filtered.every(v => currentSelection.has(v));
      const allNoSelected = filtered.every(v => !currentSelection.has(v));

      const selectAllWrapper = DOMUtils.createElement('div', { classNames: 'flex items-center gap' });
      const selectAllCheckbox = DOMUtils.createElement('input', {
        attributes: { type: 'checkbox', 'data-select-all': 'true' }
      });

      // Ajustar checked e indeterminate dinámicamente
      selectAllCheckbox.checked = allSelected;
      selectAllCheckbox.indeterminate = !allSelected && !allNoSelected;

      const selectAllLabel = DOMUtils.createElement('span', { content: 'Seleccionar todo' });

      selectAllCheckbox.onchange = () => {
        currentSelection.clear();
        if (selectAllCheckbox.checked) {
          filtered.forEach(v => currentSelection.add(v));
        }
        renderList(filtered);
        updateFilter();
      };

      selectAllWrapper.append(selectAllCheckbox, selectAllLabel);
      list.appendChild(selectAllWrapper);

      filtered.forEach((value, index) => {
        const row = DOMUtils.createElement('div', {
          classNames: 'flex items-center gap mt-1 mb-1',
        });
        row.tabIndex = -1;
        row.setAttribute('data-index', index.toString());

        const checkbox = DOMUtils.createElement('input', {
          attributes: {
            type: 'checkbox',
            value,
            ...(currentSelection.has(value) ? { checked: 'true' } : {}),
          },
        });

        checkbox.onchange = () => {
          if (checkbox.checked) {
            currentSelection.add(value);
          } else {
            currentSelection.delete(value);
          }
          updateFilter();
        };

        row.onkeydown = (e) => {
          const focusables = list.querySelectorAll<HTMLElement>('[data-index]');
          const current = Array.from(focusables).indexOf(row);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusables[Math.min(current + 1, focusables.length - 1)]?.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusables[Math.max(current - 1, 0)]?.focus();
          } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
          }
        };

        const label = DOMUtils.createElement('span', { content: value });
        row.appendChild(checkbox);
        row.appendChild(label);
        list.appendChild(row);
      });
    };

    searchInput.oninput = () => {
      const search = searchInput.value.toLowerCase();
      const filtered = values.filter(v => v.toLowerCase().includes(search));
      renderList(filtered);
    };

    this.middleElement.appendChild(searchInput);
    this.middleElement.appendChild(list);

    renderList(values);
  }

  private footer(): void {
    const applyBtn = DOMUtils.createElement("button", { classNames: "btn rounded soft primary", content: "Aplicar" });
    const cancelBtn = DOMUtils.createElement("button", { classNames: "btn rounded soft", content: "Cancelar" });

    applyBtn.onclick = () => {
      this.options.onChange(true, this.composeFilterModel());
    }

    cancelBtn.onclick = () => {
      this.options.onChange(false, this.composeFilterModel());
    }

    this.bottomElement.append(applyBtn, cancelBtn);
  }

  private composeFilterModel(): FilterModel {
    const currentFilterModel = this.options.filterModel as JoinFilterNode;
    let matchSimpleFilter = false;
    let matchMultiFilter = false;

    // Update if exists filter
    let conditions = (currentFilterModel.conditions as FilterModel[]).map((item) => {
      if(item.filterType === 'join'){
        return item;
      }

      const itemRow = item as ColumnFilterNode;
      if (itemRow.field === this.options.field && itemRow.key === this.colSimpleFilter.key) {
        matchSimpleFilter = true;
        return ({ ...itemRow, ...this.colSimpleFilter });
      } else if (itemRow.field === this.options.field && itemRow.key === this.colMultiFilter.key) {
        matchMultiFilter = true;
        return ({ ...itemRow, ...this.colMultiFilter });
      }
      return item;
    }) as FilterModel[];

    // Remove if filter1 is empty
    conditions = conditions.filter(item => {
      if(item.filterType === 'join'){
        return true;
      }

      return ((item as ColumnFilterNode).filter1?.toString() || '').length > 0
    }) as FilterModel[];

    // Add if not exists filter
    if (!matchSimpleFilter && (this.colSimpleFilter.filter1?.toString() || '').length > 0) {
      conditions.push(this.colSimpleFilter);
    }

    // Add if not exists filter
    if (!matchMultiFilter && (this.colMultiFilter.filter1?.toString() || '').length > 0) {
      conditions.push(this.colMultiFilter);
    }

    return ({
      ...currentFilterModel,
      conditions,
    });
  }
}
