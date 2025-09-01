import { UniqueId } from '../utils/conmon';
import Menu from './menu';
import dayjs from 'dayjs';

export const FILTER_SCALAR_FILTER_TYPE = {
  equals: 'Igual a',
  notEqual: 'No igual a',
  lessThan: 'Menos que',
  lessThanOrEqual: 'Menos o igual que',
  greaterThan: 'Más que',
  greaterThanOrEqual: 'Más o igual que',
  inRange: 'Entre',
  blank: 'En blanco',
  notBlank: 'No en blanco',
}

export const FILTER_RELATIVE_DATE_TILTER_TYPE = {
  relativeDate: 'Relativo',
}

export const FILTER_RELATIVE_DATE_TYPE = {
  last: 'Ultimo(s)',
  this: 'Este',
  next: 'Siguiente(s)',
};

export const FILTER_RELATIVE_DATE_PERIODS = {
  days: 'Dias',
  weeks: 'Semanas',
  months: 'Meses',
  years: 'Años',
};

export const FILTER_RELATIVE_DATE_PERIOD = {
  day: 'Dia',
  week: 'Semana',
  month: 'Mes',
  year: 'Año',
};

export const FILTER_TEXT_FILTER_TYPE = {
  equals: 'Igual a',
  notEqual: 'No igual a',
  contains: 'Contiene',
  notContains: 'No contiene',
  startsWith: 'Empieza con',
  endsWith: 'Termina con',
  blank: 'En blanco',
  notBlank: 'No en blanco',
}

class FilterService {
  constructor(options) {
    this.options = options;

    this.filterModel = this.validateFilterModel(this.options.filterModel);
  }

  validateFilterModel(filterModel) {
    const defaultFilterModel = {
      filterType: "join",
      type: "AND",
      conditions: [],
    };

    if (!filterModel || typeof filterModel !== 'object') {
      return defaultFilterModel;
    }

    const validatedFilterModel = {
      filterType: filterModel.filterType === "join" ? filterModel.filterType : defaultFilterModel.filterType,
      type: filterModel.type || defaultFilterModel.type,
      conditions: Array.isArray(filterModel.conditions) ? filterModel.conditions : defaultFilterModel.conditions
    };

    return this._computeFilterModel(validatedFilterModel);
  }

  alert(log) {
    console.error(log);
  }

  getFieldEntry(field) {
    this.options.fields.find(item => item.field === field)
  }

  findGroup(groupKey, node = this.filterModel) {
    if (node.key === groupKey) return node;
    if (!node.conditions) return null;

    for (let condition of node.conditions) {
      if (condition.filterType === "join") {
        const found = this.findGroup(groupKey, condition);
        if (found) return found;
      }
    }
    return null;
  }

  findFilter(filterKey, node = this.filterModel) {
    if (!node.conditions) return null;

    for (let condition of node.conditions) {
      if (condition.key === filterKey) return condition;
      if (condition.filterType === "join") {
        const found = this.findFilter(filterKey, condition);
        if (found) return found;
      }
    }
    return null;
  }

  findFilterByField(field, node = this.filterModel, root = true) {
    if (!node.conditions) return null;

    for (let condition of node.conditions) {
      if (condition.field === field) return condition;
      if (condition.filterType === "join" && !root) {
        const found = this.findFilter(field, condition, root);
        if (found) return found;
      }
    }
    return null;
  }

  addFilter(parentKey = null, field = null, value = null) {
    let firstEntry = null;
    if (field) {
      firstEntry = this.options.fields.find(item => item.field === field);
    } else {
      firstEntry = this.options.fields[0];
    }

    if (!firstEntry) {
      this.alert("Nos se econtró ningun campo");
      return null;
    }

    const filterKey = UniqueId();
    const newFilter = {
      key: filterKey,
      filterType: firstEntry.filterType,

      field: firstEntry.field,
      type: this.isScalarType(firstEntry.filterType) ? 'equals' : 'contains',
      filter1: value ?? '',
      filter2: '',
    };

    if (!parentKey) {
      this.filterModel.conditions.push(newFilter);
    } else {
      const parentGroup = this.findGroup(parentKey);
      if (!parentGroup) {
        this.alert("Grupo padre no encontrado");
        return null;
      }
      parentGroup.conditions.push(newFilter);
    }

    return filterKey;
  }

  removeFilter(filterKey, node = this.filterModel) {
    if (!node.conditions) return false;

    for (let i = 0; i < node.conditions.length; i++) {
      if (node.conditions[i].key === filterKey) {
        node.conditions.splice(i, 1);
        return true;
      } else if (node.conditions[i].filterType === "join") {
        if (this.removeFilter(filterKey, node.conditions[i])) return true;
      }
    }

    return false;
  }

  addGroup(type = "AND", parentKey = null) {
    const groupKey = UniqueId();
    const newGroup = {
      key: groupKey,
      filterType: "join",
      type,
      conditions: []
    };

    if (!parentKey) {
      this.filterModel.conditions.push(newGroup);
    } else {
      const parentGroup = this.findGroup(parentKey);
      if (!parentGroup) {
        console.error("Grupo padre no encontrado");
        return null;
      }
      parentGroup.conditions.push(newGroup);
    }

    return groupKey;
  }

  removeGroup(groupKey, node = this.filterModel) {
    if (!node.conditions) return false;

    for (let i = 0; i < node.conditions.length; i++) {
      if (node.conditions[i].key === groupKey) {
        node.conditions.splice(i, 1);
        return true;
      } else if (node.conditions[i].filterType === "join") {
        if (this.removeGroup(groupKey, node.conditions[i])) return true;
      }
    }
    return false;
  }

  updateGroup(groupKey, newValues) {
    const group = groupKey !== null ? this.findGroup(groupKey) : this.filterModel;
    if (!group) {
      console.error("Grupo no encontrado");
      return false;
    }

    Object.keys(newValues).forEach(key => {
      if (key !== "key") {
        group[key] = newValues[key];
      }
    });
    return true;
  }

  updateFilter(filterKey, newValues) {
    const filter = this.findFilter(filterKey);
    if (!filter) {
      console.error("Filtro no encontrado");
      return false;
    }

    // Set default values in changes
    if (!!FILTER_RELATIVE_DATE_TILTER_TYPE[newValues?.type]) {
      newValues = {
        ...newValues,
        relativeInterval: 'last',
        relativeDuration: 1,
        relativePeriod: 'months',
      }
    } else if (!!FILTER_RELATIVE_DATE_TYPE[newValues?.relativeInterval]) {
      if(newValues.relativeInterval === 'this'){
        newValues = {
          ...newValues,
          relativeDuration: null,
          relativePeriod: 'month',
        }
      } else {
        newValues = {
          ...newValues,
          relativeDuration: 1,
          relativePeriod: 'months',
        }
      }
    }

    // Apply values
    Object.keys(newValues).forEach(key => {
      if (key !== "key") {
        filter[key] = newValues[key];
      }
    });

    // Calculate values
    if (!!FILTER_RELATIVE_DATE_TILTER_TYPE[filter.type]) {
      const [filter1, filter2] = this._calculateDateRange(filter.relativeInterval, filter.relativeDuration, filter.relativePeriod);
      filter.filter1 = filter1;
      filter.filter2 = filter2;
    }

    if (newValues?.field) {
      const entry = this.options.fields.find(item => item.field === newValues?.field);
      filter.filterType = entry.filterType;
    }

    return true;
  }

  _calculateDateRange(relativeInterval, relativeDuration, relativePeriod) {
    const today = dayjs();
    let startDate;
    let endDate;

    switch (relativeInterval) {
      case 'this':
        switch (relativePeriod) {
          case 'day':
            startDate = today.startOf('day');
            endDate = today.endOf('day');
            break;
          case 'week':
            startDate = today.startOf('week'); // Lunes
            endDate = today.endOf('week');     // Domingo
            break;
          case 'month':
            startDate = today.startOf('month');
            endDate = today.endOf('month');
            break;
          case 'year':
            startDate = today.startOf('year');
            endDate = today.endOf('year');
            break;
        }
        break;

      case 'last':
        switch (relativePeriod) {
          case 'days':
            endDate = today.endOf('day');
            startDate = today.subtract(relativeDuration, 'day').startOf('day');
            break;
          case 'weeks':
            // Calculamos desde el lunes de hace n semanas hasta el domingo de la semana anterior
            startDate = today
              .subtract(relativeDuration, 'week')
              .startOf('week');
            endDate = today
              .subtract(1, 'week')
              .endOf('week');
            break;
          case 'months':
            endDate = today
              .subtract(1, 'month')
              .endOf('month');
            startDate = today
              .subtract(relativeDuration, 'month')
              .startOf('month');
            break;
          case 'years':
            endDate = today
              .subtract(1, 'year')
              .endOf('year');
            startDate = today
              .subtract(relativeDuration, 'year')
              .startOf('year');
            break;
        }
        break;

      case 'next':
        switch (relativePeriod) {
          case 'days':
            startDate = today.startOf('day');
            endDate = today
              .add(relativeDuration, 'day')
              .endOf('day');
            break;
          case 'weeks':
            startDate = today.startOf('week');
            endDate = today
              .add(relativeDuration, 'week')
              .endOf('week');
            break;
          case 'months':
            startDate = today.startOf('month');
            endDate = today
              .add(relativeDuration, 'month')
              .endOf('month');
            break;
          case 'years':
            startDate = today.startOf('year');
            endDate = today
              .add(relativeDuration, 'year')
              .endOf('year');
            break;
        }
        break;
    }

    // Formatear las fechas a YYYY-MM-DD
    return [
      startDate.format('YYYY-MM-DD'),
      endDate.format('YYYY-MM-DD')
    ];
  }

  _computeFilterModel(filterModel) {
    const processTree = (filter) => {
      if (filter.filterType === 'join') {
        const conditions = filter.conditions.map(item => processTree(item))
        return ({
          ...filter,
          conditions
        })
      }

      if (!!FILTER_RELATIVE_DATE_TILTER_TYPE[filter.type]) {
        const [filter1, filter2] = this._calculateDateRange(filter.relativeInterval, filter.relativeDuration, filter.relativePeriod);
        return ({
          ...filter,
          filter1,
          filter2,
        })
      }

      return filter;
    }

    return processTree(filterModel);
  }

  getFilterModel() {
    return this.filterModel;
  }

  setFilterModel(filterModel) {
    this.filterModel = this.validateFilterModel(filterModel);
  }

  isScalarType(filterType) {
    return ['number', 'date', 'datetime-local'].includes(filterType);
  }
}

class DOMUtils {
  static createElement(tag, { classNames = "", content = "", isHTML = false, attributes = {} } = {}) {
    const element = document.createElement(tag);
    if (classNames) element.className = classNames;
    if (content) isHTML ? (element.innerHTML = content) : (element.textContent = content);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  static createSelect(options, { selectedValue = undefined, onChange = null, classNames = "", attributes = {} } = {}) {
    const select = this.createElement("select", { attributes, classNames });

    Object.entries(options).forEach(([key, value]) => {
      const opt = this.createElement("option", { content: value, attributes: { value: key } });
      select.appendChild(opt);
    });
    if (onChange) select.onchange = () => onChange(select.value);
    if (selectedValue) select.value = selectedValue;
    return select;
  }
}

export class FilterView {
  constructor(options, filterBuilder) {
    this.options = options;

    this.container = document.getElementById(this.options.elementId);
    this.filterBuilder = filterBuilder;
    this.render();
  }

  render() {
    this.container.innerHTML = "";
    const model = this.filterBuilder.getFilterModel();
    this.container.appendChild(this.createGroupElement(model, true));
  }

  createGroupElement(group, isRoot = false) {
    // Contenedor principal del grupo
    // const groupEl = DOMUtils.createElement("div");
    const groupEl = DOMUtils.createElement("div", { classNames: `${isRoot ? "" : "nested"}` });

    // Sección superior del grupo
    const groupTopEl = DOMUtils.createElement("div", { classNames: "flex justify-between filter-item" });
    const groupTopRightEl = DOMUtils.createElement("div", { classNames: "flex gap items-center" });

    // Botón de unión con el tipo de grupo
    const joinButton = DOMUtils.createElement("div", { classNames: "btn info soft sm", content: group.type });
    joinButton.onclick = (e) => {
      e.stopPropagation();
      this._openUpdateJoin(joinButton, group.key);
    }

    // Botón para agregar elementos
    const addButton = DOMUtils.createElement("button", { classNames: "btn soft circle sm", content: "+" });
    addButton.onclick = (e) => {
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
      // groupEl.appendChild(joinButton);
      groupTopEl.appendChild(joinButton);
    }

    // Contenedor de condiciones dentro del grupo
    const conditionsContainer = DOMUtils.createElement("div", { classNames: "pl-4 filter-group" });

    // Iterar sobre las condiciones del grupo y agregarlas al contenedor
    group.conditions.forEach(condition => {
      const conditionEl = (condition.filterType === "join")
        ? this.createGroupElement(condition)
        : this.createFilterElement(condition, group.key);

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


  createFilterElement(filter, parentKey) {
    // const filterEl = DOMUtils.createElement("div", { classNames: "flex justify-between" });
    const filterEl = DOMUtils.createElement("div", { classNames: "filter-item flex items-center justify-between" });

    const filterLeftEl = DOMUtils.createElement("div", { classNames: "flex gap" });
    const filterRightEl = DOMUtils.createElement("div", { classNames: "flex gap" });

    const fields = this.options.fields.reduce((prev, item) => {
      prev[item.field] = item.caption;
      return prev;
    }, {});

    const fieldSelect = DOMUtils.createSelect(fields, {
      selectedValue: filter.field,
      classNames: 'form-control',
      onChange: value => {
        this.filterBuilder.updateFilter(filter.key, { field: value });
        this.render();
      }
    });

    // =====================================================================================
    // Filter type selector
    const typeFilterOptions = this.filterBuilder.isScalarType(filter.filterType)
      ? (filter.filterType === 'date' ? ({ ...FILTER_RELATIVE_DATE_TILTER_TYPE, ...FILTER_SCALAR_FILTER_TYPE }) : FILTER_SCALAR_FILTER_TYPE)
      : FILTER_TEXT_FILTER_TYPE;
    const typeSelect = DOMUtils.createSelect(typeFilterOptions, {
      selectedValue: filter.type,
      classNames: 'form-control',
      onChange: value => {
        this.filterBuilder.updateFilter(filter.key, { type: value });
        this.render();
      }
    });

    filterLeftEl.append(fieldSelect, typeSelect);


    // =====================================================================================
    // Filter Inputs
    if (!!FILTER_RELATIVE_DATE_TILTER_TYPE[filter.type]) {
      const relativeTypeOpcions = DOMUtils.createSelect(FILTER_RELATIVE_DATE_TYPE, {
        selectedValue: filter.relativeInterval,
        classNames: 'form-control',
        onChange: value => {
          this.filterBuilder.updateFilter(filter.key, { relativeInterval: value });
          this.render();
        }
      });
      filterLeftEl.append(relativeTypeOpcions);

      if (filter.relativeInterval !== "this") {
        const relativeNumberInput = DOMUtils.createElement("input", {
          attributes: { type: 'number', value: filter.relativeDuration },
          classNames: 'form-control',
        });
        relativeNumberInput.onchange = () => {
          this.filterBuilder.updateFilter(filter.key, { relativeDuration: relativeNumberInput.value });
        };
        filterLeftEl.append(relativeNumberInput);
      }

      const datePeriod = filter.relativeInterval === 'this' ? FILTER_RELATIVE_DATE_PERIOD : FILTER_RELATIVE_DATE_PERIODS;
      const relativeDateType = DOMUtils.createSelect(datePeriod, {
        selectedValue: filter.relativePeriod,
        classNames: 'form-control',
        onChange: value => {
          this.filterBuilder.updateFilter(filter.key, { relativePeriod: value });
          this.render();
        }
      });

      filterLeftEl.append(relativeDateType);
    } else {
      const value1Input = DOMUtils.createElement("input", {
        attributes: { type: filter.filterType, value: filter.filter1 },
        classNames: 'form-control',
      });
      value1Input.onchange = () => {
        this.filterBuilder.updateFilter(filter.key, { filter1: value1Input.value });
      };

      let value2Input = null;
      if (filter.type === 'inRange') {
        value2Input = DOMUtils.createElement("input", {
          attributes: { type: filter.filterType, value: filter.filter1 },
          classNames: 'form-control',
        });
        value2Input.onchange = () => {
          this.filterBuilder.updateFilter(filter.key, { filter2: value2Input.value });
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
    addButton.onclick = (e) => {
      e.stopPropagation();
      this._openAddMenu(addButton, parentKey);
    };

    filterRightEl.append(addButton, removeButton);
    filterEl.append(filterLeftEl, filterRightEl);

    return filterEl;
  }

  _openUpdateJoin(trigger, parentKey = null) {

    const menuUl = DOMUtils.createElement("ul", {
      classNames: "list menu", isHTML: true, content: `
      <li class='list-item' data-key='and'>AND</li>
      <li class='list-item' data-key='or'>OR</li>
    ` });
    Menu.portal(trigger, menuUl);

    menuUl.onclick = e => {
      const key = e.target.dataset.key;
      this.filterBuilder.updateGroup(parentKey, { type: key });
      this.render();
    };
  }

  _openAddMenu(trigger, parentKey = null) {
    const menuUl = DOMUtils.createElement("ul", {
      classNames: "list menu", isHTML: true, content: `
      <li class='list-item' data-key='filter'>Añadir filtro</li>
      <li class='list-item' data-key='group'>Añadir grupo</li>
    ` });
    Menu.portal(trigger, menuUl);

    menuUl.onclick = e => {
      const key = e.target.dataset.key;
      if (key === "group") this.filterBuilder.addGroup("AND", parentKey);
      if (key === "filter") this.filterBuilder.addFilter(parentKey);
      this.render();
    };
  }
}

class Filter {
  constructor(options) {
    this.options = options;

    this.options.fields = this.options.fields.map(item => ({
      caption: item.title,
      field: item.field,
      filterType: item?.type || 'text',
    }));

    this.service = new FilterService(this.options);
    this.view = new FilterView(this.options, this.service);
  }

  getFilterModel() {
    return this.service.getFilterModel();
  }

  setFilterModel(filterModel) {
    this.service.setFilterModel(filterModel);
    this.view.render();
  }

  setRootFilter(field, value) {
    const filter = this.service.findFilterByField(field, this.service.filterModel, true);
    if(filter){
      this.service.updateFilter(filter.key, { filter1: value });
    } else {
      this.service.addFilter(null, field, value);
    }
    this.view.render();
  }

  removeFilter(key) {
    this.service.removeFilter(key);
    this.view.render();
  }
}

export default Filter;
