import type {
  FilterOptions,
  FilterModel,
  JoinFilterNode,
  ColumnFilterNode,
} from './filterModel';
import {
  FILTER_TEXT_FILTER_TYPE,
  FILTER_SCALAR_FILTER_TYPE,
  FILTER_RELATIVE_DATE_FILTER_TYPE,
  FILTER_RELATIVE_DATE_TYPE,
  FILTER_RELATIVE_DATE_PERIODS,
  FILTER_RELATIVE_DATE_PERIOD
} from './filterModel';

import { FilterService, isScalarType } from './filterService';

import { Menu } from './menu';


export type ElementOptions = {
  classNames?: string;
  content?: string;
  isHTML?: boolean;
  attributes?: Record<string, string>;
};

export type SelectOptions = {
  selectedValue?: string;
  onChange?: ((value: string) => void) | null;
  classNames?: string;
  attributes?: Record<string, string>;
};

export class DOMUtils {
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    {
      classNames = "",
      content = "",
      isHTML = false,
      attributes = {},
    }: ElementOptions = {}
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    if (classNames) element.className = classNames;
    if (content) {
      isHTML ? (element.innerHTML = content) : (element.textContent = content);
    }
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );
    return element;
  }

  static createSelect(
    options: Record<string, string>,
    {
      selectedValue,
      onChange = null,
      classNames = "",
      attributes = {},
    }: SelectOptions = {}
  ): HTMLSelectElement {
    const select = this.createElement("select", { attributes, classNames });

    Object.entries(options).forEach(([key, value]) => {
      const opt = this.createElement("option", {
        content: value,
        attributes: { value: key },
      });
      select.appendChild(opt);
    });

    if (onChange) {
      select.onchange = () => onChange(select.value);
    }

    if (selectedValue) {
      select.value = selectedValue;
    }

    return select;
  }
}

export class FilterView {
  private options: FilterOptions;
  private container: HTMLElement;
  private filterBuilder: FilterService;

  constructor(options: FilterOptions, filterBuilder: FilterService) {
    this.options = options;

    if (!this.options.elementId) {
      throw new Error("Element ID is required for FilterView");
    }

    const container = document.getElementById(this.options.elementId);
    if (!container) {
      throw new Error(`Element with ID "${this.options.elementId}" not found`);
    }

    this.container = container;
    this.filterBuilder = filterBuilder;
    this.render();
  }

  render(): void {
    this.container.innerHTML = "";
    const model = this.filterBuilder.getFilterModel();
    this.container.appendChild(this.createGroupElement(model as JoinFilterNode, true));
  }

  createGroupElement(group: JoinFilterNode, isRoot = false): HTMLElement {
    // Contenedor principal del grupo
    const groupEl = DOMUtils.createElement("div", { classNames: `${isRoot ? "" : "nested"}` });

    // Sección superior del grupo
    const groupTopEl = DOMUtils.createElement("div", { classNames: "flex justify-between filter-item" });
    const groupTopRightEl = DOMUtils.createElement("div", { classNames: "flex gap-2 items-center" });

    // Botón de unión con el tipo de grupo
    const joinButton = DOMUtils.createElement("div", { classNames: "btn info soft sm", content: group.type === 'AND' ? 'Y' : 'O' });
    joinButton.onclick = (e: Event) => {
      e.stopPropagation();
      this._openUpdateJoin(joinButton, group.key);
    };

    // Botón para agregar elementos
    const addButton = DOMUtils.createElement("button", { classNames: "btn soft circle sm", content: "+" });
    addButton.onclick = (e: Event) => {
      e.stopPropagation();
      this._openAddMenu(addButton, group.key);
    };

    // Si no es el grupo raíz, añadimos elementos adicionales
    if (!isRoot) {
      // Botón para eliminar el grupo
      const removeGroupButton = DOMUtils.createElement("button", { classNames: "btn soft circle sm", content: "-" });
      removeGroupButton.onclick = () => {
        this.filterBuilder.removeGroup(group.key);
        this.render();
      };

      groupTopEl.appendChild(joinButton);
      groupTopRightEl.appendChild(addButton);
      groupTopRightEl.appendChild(removeGroupButton);
    } else {
      groupTopEl.appendChild(joinButton);
    }

    // Contenedor de condiciones dentro del grupo
    const conditionsContainer = DOMUtils.createElement("div", { classNames: "pl-4 filter-group" });

    // Iterar sobre las condiciones del grupo y agregarlas al contenedor
    group.conditions.forEach(condition => {
      const conditionEl = (condition.filterType === "join")
        ? this.createGroupElement(condition as JoinFilterNode)
        : this.createFilterElement(condition as ColumnFilterNode, group.key);

      conditionsContainer.appendChild(conditionEl);
    });

    // Ensamblar los elementos creados
    groupTopEl.appendChild(groupTopRightEl);
    groupEl.appendChild(groupTopEl);
    groupEl.appendChild(conditionsContainer);

    // Si es el grupo raíz, el botón de añadir se coloca al final
    if (isRoot) {
      groupEl.appendChild(addButton);
    }

    return groupEl;
  }

  createFilterElement(filter: ColumnFilterNode, parentKey: number): HTMLElement {
    const filterEl = DOMUtils.createElement("div", { classNames: "filter-item flex items-center justify-between" });

    const filterLeftEl = DOMUtils.createElement("div", { classNames: "flex gap-2" });
    const filterRightEl = DOMUtils.createElement("div", { classNames: "flex gap-2" });

    const fields = this.options.fields.reduce<Record<string, string>>((prev, item) => {
      prev[item.field] = item.caption;
      return prev;
    }, {});

    const fieldSelect = DOMUtils.createSelect(fields, {
      selectedValue: filter.field,
      classNames: 'form-control',
      onChange: (value: string) => {
        // Nota: Este comportamiento parece incorrecto ya que solo actualiza el campo field
        // pero no actualiza el filterType. En una implementación real,
        // esto podría causar inconsistencias.
        this.filterBuilder.updateFilter(filter.key, { field: value } as any);
        this.render();
      }
    });

    // =====================================================================================
    // Filter type selector
    const typeFilterOptions = isScalarType(filter.filterType)
      ? (filter.filterType === 'date'
        ? ({ ...FILTER_RELATIVE_DATE_FILTER_TYPE, ...FILTER_SCALAR_FILTER_TYPE })
        : FILTER_SCALAR_FILTER_TYPE)
      : FILTER_TEXT_FILTER_TYPE;

    const typeSelect = DOMUtils.createSelect(typeFilterOptions, {
      selectedValue: filter.type,
      classNames: 'form-control',
      onChange: (value: string) => {
        this.filterBuilder.updateFilter(filter.key, { type: value } as any);
        this.render();
      }
    });

    filterLeftEl.append(fieldSelect, typeSelect);

    // =====================================================================================
    // Filter Inputs
    if (filter.type === 'relativeDate') {
      const relativeTypeOptions = DOMUtils.createSelect(FILTER_RELATIVE_DATE_TYPE, {
        selectedValue: filter.relativeInterval,
        classNames: 'form-control',
        onChange: (value: string) => {
          this.filterBuilder.updateFilter(filter.key, { relativeInterval: value } as any);
          this.render();
        }
      });
      filterLeftEl.append(relativeTypeOptions);

      if (filter.relativeInterval !== "this") {
        const relativeNumberInput = DOMUtils.createElement("input", {
          attributes: {
            type: 'number',
            value: filter.relativeDuration?.toString() || '1'
          },
          classNames: 'form-control',
        });
        relativeNumberInput.onchange = () => {
          this.filterBuilder.updateFilter(filter.key, {
            relativeDuration: parseInt(relativeNumberInput.value, 10)
          } as any);
        };
        filterLeftEl.append(relativeNumberInput);
      }

      const datePeriod = filter.relativeInterval === 'this'
        ? FILTER_RELATIVE_DATE_PERIOD
        : FILTER_RELATIVE_DATE_PERIODS;

      const relativeDateType = DOMUtils.createSelect(datePeriod, {
        selectedValue: filter.relativePeriod,
        classNames: 'form-control',
        onChange: (value: string) => {
          this.filterBuilder.updateFilter(filter.key, { relativePeriod: value } as any);
          this.render();
        }
      });

      filterLeftEl.append(relativeDateType);
    } else {
      const value1Input = DOMUtils.createElement("input", {
        attributes: {
          type: filter.filterType,
          value: filter.filter1?.toString() || ''
        },
        classNames: 'form-control',
      });
      value1Input.onchange = () => {
        this.filterBuilder.updateFilter(filter.key, { filter1: value1Input.value.trim() } as any);
      };

      let value2Input: HTMLInputElement | null = null;
      if (filter.type === 'inRange') {
        value2Input = DOMUtils.createElement("input", {
          attributes: {
            type: filter.filterType,
            value: filter.filter2?.toString() || '' // Corregido: usar filter2 en lugar de filter1
          },
          classNames: 'form-control',
        });
        value2Input.onchange = () => {
          this.filterBuilder.updateFilter(filter.key, { filter2: value2Input?.value?.trim() } as any);
        };
      }

      filterLeftEl.append(value1Input);
      if (value2Input) {
        filterLeftEl.append(value2Input);
      }
    }

    // =====================================================================================
    // Action buttons
    const removeButton = DOMUtils.createElement("button", { classNames: "btn soft circle sm", content: "-" });
    removeButton.onclick = () => {
      this.filterBuilder.removeFilter(filter.key);
      this.render();
    };

    const addButton = DOMUtils.createElement("button", { classNames: "btn soft circle sm", content: "+" });
    addButton.onclick = (e: Event) => {
      e.stopPropagation();
      this._openAddMenu(addButton, parentKey);
    };

    filterRightEl.append(addButton, removeButton);
    filterEl.append(filterLeftEl, filterRightEl);

    return filterEl;
  }

  _openUpdateJoin(trigger: HTMLElement, parentKey: number | null = null): void {
    const menuUl = DOMUtils.createElement("ul", {
      classNames: "list menu",
      isHTML: true,
      content: `
        <li class='list-item' data-key='AND'>Y</li>
        <li class='list-item' data-key='OR'>O</li>
      `
    });

    Menu.portal(trigger, menuUl);

    menuUl.onclick = (e: Event) => {
      const target = e.target as HTMLElement;
      const key = target.dataset.key as 'AND' | 'OR';
      if (key) {
        this.filterBuilder.updateGroup(parentKey, { type: key } as any);
        this.render();
      }
    };
  }

  _openAddMenu(trigger: HTMLElement, parentKey: number | null = null): void {
    const menuUl = DOMUtils.createElement("ul", {
      classNames: "list menu",
      isHTML: true,
      content: `
        <li class='list-item' data-key='filter'>Añadir filtro</li>
        <li class='list-item' data-key='group'>Añadir grupo</li>
      `
    });

    Menu.portal(trigger, menuUl);

    menuUl.onclick = (e: Event) => {
      const target = e.target as HTMLElement;
      const key = target.dataset.key;
      if (key === "group") this.filterBuilder.addGroup("AND", parentKey);
      if (key === "filter") this.filterBuilder.addFilter(parentKey);
      this.render();
    };
  }
}

export interface FilterField {
  title: string;
  field: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local' | 'relativeDate';
}

export class Filter {
  private options: FilterOptions;
  private service: FilterService;
  private view: FilterView;

  constructor(options: FilterOptions) {
    this.options = options;

    // Mapear los campos proporcionados al formato requerido por AdvancedFilterService
    const mappedOptions: FilterOptions = {
      ...this.options,
      fields: this.options.fields.map(item => ({
        caption: item.caption,
        field: item.field,
        filterType: item.filterType || 'text',
      }))
    };

    this.service = new FilterService(mappedOptions);
    this.view = new FilterView(mappedOptions, this.service);
  }

  getFilterModel(): FilterModel {
    return this.service.getFilterModel();
  }

  setFilterModel(filterModel: FilterModel): void {
    this.service.setFilterModel(filterModel);
    this.view.render();
  }

  setRootFilter(field: string, value: string | number): void {
    const filter = this.service.findFilterByField(field, this.service.getFilterModel(), true);
    if (filter) {
      this.service.updateFilter(filter.key, { filter1: value } as any);
    } else {
      this.service.addFilter(null, field, value);
    }
    this.view.render();
  }

  removeFilter(key: number): void {
    this.service.removeFilter(key);
    this.view.render();
  }
}

export default Filter;
