import uniqueId from '../utils/unique-id';
import dayjs from 'dayjs';

import type {
  FilterModel,
  FilterOptions,
  FilterField,
  ScalarFilterType,
  TextFilterType,
  RelativeDateFilterType,
  RelativeInterval,
  RelativePeriod,
  JoinFilterNode,
  ColumnFilterNode,
} from './filterModel'; // Asegúrate de que la ruta sea correcta

import { FILTER_RELATIVE_DATE_TYPE } from './filterModel'; // Asegúrate de que la ruta sea correcta

export class FilterService {
  private options: FilterOptions;
  private filterModel: FilterModel;

  constructor(options: FilterOptions) {
    this.options = options;
    this.filterModel = this.validateFilterModel(this.options.filterModel);
  }

  private validateFilterModel(filterModel?: FilterModel): FilterModel {
    const defaultFilterModel: FilterModel = {
      key: uniqueId(),
      filterType: "join",
      type: "AND",
      conditions: [],
    };

    if (!filterModel || typeof filterModel !== 'object') {
      return defaultFilterModel;
    }

    const validatedFilterModel: FilterModel = {
      key: filterModel.key || uniqueId(),
      filterType: filterModel.filterType === "join" ? filterModel.filterType : defaultFilterModel.filterType,
      type: (filterModel as JoinFilterNode).type || (defaultFilterModel as JoinFilterNode).type,
      conditions: Array.isArray((filterModel as JoinFilterNode).conditions) ? (filterModel as JoinFilterNode).conditions : (defaultFilterModel as JoinFilterNode).conditions
    };

    return this._computeFilterModel(validatedFilterModel);
  }

  private alert(log: string): void {
    console.error(log);
  }

  private findGroup(groupKey: number, node: FilterModel = this.filterModel): JoinFilterNode | undefined {
    if (node.filterType === 'join' && node.key === groupKey) {
      return node;
    }
    if (node.filterType === 'join' && node.conditions) {
      for (const condition of node.conditions) {
        const found = this.findGroup(groupKey, condition);
        if (found) return found;
      }
    }
    return undefined;
  }

  private findFilter(filterKey: number, node: FilterModel = this.filterModel): ColumnFilterNode | undefined {
    if (node.filterType !== 'join' && node.key === filterKey) {
      return node;
    }
    if (node.filterType === 'join' && node.conditions) {
      for (const condition of node.conditions) {
        const found = this.findFilter(filterKey, condition);
        if (found) return found;
      }
    }
    return undefined;
  }

  public findFilterByField(field: string, node: FilterModel = this.filterModel, root: boolean = true): ColumnFilterNode | null {
    if (node.filterType !== 'join' && node.field === field) {
      return node;
    }
    if (node.filterType === 'join' && node.conditions) {
      for (const condition of node.conditions) {
        const found = condition.filterType === 'join' && !root
          ? this.findFilterByField(field, condition, root)
          : condition.filterType !== 'join' && condition.field === field
            ? condition as ColumnFilterNode
            : null;
        if (found) return found;
      }
    }
    return null;
  }

  public addFilter(parentKey: number | null = null, field: string | null = null, value: string | number | null = null): number | null {
    let firstEntry: FilterField | undefined = undefined;
    if (field) {
      firstEntry = this.options.fields.find(item => item.field === field);
    } else if (this.options.fields.length > 0) {
      firstEntry = this.options.fields[0];
    }

    if (!firstEntry) {
      this.alert("No se encontró ningún campo");
      return null;
    }

    const filterKey = uniqueId();
    const newFilter: ColumnFilterNode = {
      key: filterKey,
      filterType: firstEntry.filterType as 'text' | 'number' | 'date' | 'datetime-local' | 'relativeDate',
      field: firstEntry.field,
      type: getDefaultFilterType(firstEntry.filterType),
      filter1: value !== null ? String(value) : '',
    } as ColumnFilterNode;

    if (!parentKey) {
      (this.filterModel as JoinFilterNode).conditions.push(newFilter);
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

  public removeFilter(filterKey: number, node: FilterModel = this.filterModel): boolean {
    if (node.filterType === 'join' && node.conditions) {
      for (let i = 0; i < node.conditions.length; i++) {
        if (node.conditions[i].filterType !== 'join' && node.conditions[i].key === filterKey) {
          node.conditions.splice(i, 1);
          return true;
        } else if (node.conditions[i].filterType === 'join') {
          if (this.removeFilter(filterKey, node.conditions[i])) return true;
        }
      }
    }
    return false;
  }

  public addGroup(type: 'AND' | 'OR' = "AND", parentKey: number | null = null): number | null {
    const groupKey = uniqueId();
    const newGroup: JoinFilterNode = {
      key: groupKey,
      filterType: "join",
      type,
      conditions: []
    };

    if (!parentKey) {
      (this.filterModel as JoinFilterNode).conditions.push(newGroup);
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

  public removeGroup(groupKey: number, node: FilterModel = this.filterModel): boolean {
    if (node.filterType === 'join' && node.conditions) {
      for (let i = 0; i < node.conditions.length; i++) {
        if (node.conditions[i].filterType === 'join' && node.conditions[i].key === groupKey) {
          node.conditions.splice(i, 1);
          return true;
        } else if (node.conditions[i].filterType === 'join') {
          if (this.removeGroup(groupKey, node.conditions[i])) return true;
        }
      }
    }
    return false;
  }

  public updateGroup(groupKey: number | null, newValues: JoinFilterNode): boolean {
    const group = groupKey !== null ? this.findGroup(groupKey) : this.filterModel;

    if (!group || group.filterType !== 'join') {
      console.error("Grupo no encontrado");
      return false;
    }

    (Object.keys(newValues) as Array<keyof JoinFilterNode>).forEach(key => {
      if (key !== 'key') {
        (group as any)[key] = newValues[key];
      }
    });

    return true;
  }

  public updateFilter(filterKey: number, newValues: ColumnFilterNode): boolean {
    const filter = this.findFilter(filterKey);
    if (!filter) {
      console.error("Filtro no encontrado");
      return false;
    }

    // Set default values in changes for relative dates
    if (newValues?.type === 'relativeDate') {
      newValues = {
        ...newValues,
        relativeInterval: newValues.relativeInterval || 'last',
        relativeDuration: newValues.relativeDuration !== undefined ? newValues.relativeDuration : 1,
        relativePeriod: newValues.relativePeriod || 'months',
      };
    } else if (newValues?.relativeInterval && !!FILTER_RELATIVE_DATE_TYPE[newValues.relativeInterval as RelativeInterval]) {
      if (newValues.relativeInterval === 'this') {
        newValues = {
          ...newValues,
          relativeDuration: null,
          relativePeriod: 'month',
        };
      } else {
        newValues = {
          ...newValues,
          relativeDuration: newValues.relativeDuration !== undefined ? newValues.relativeDuration : 1,
          relativePeriod: newValues.relativePeriod || 'months',
        };
      }
    }

    // Apply values
    (Object.keys(newValues) as Array<keyof ColumnFilterNode>).forEach(key => {
      if (key !== 'key') {
        (filter as any)[key] = newValues[key];
      }
    });

    // Calculate values for relative dates
    if (filter.type === 'relativeDate' && filter.relativeInterval && filter.relativePeriod) {
      const [filter1, filter2] = this._calculateDateRange(
        filter.relativeInterval,
        filter.relativeDuration,
        filter.relativePeriod
      );
      filter.filter1 = filter1;
      filter.filter2 = filter2;
    }

    if (newValues?.field) {
      const entry = this.options.fields.find(item => item.field === newValues?.field);
      if(entry){
        filter.filterType = entry.filterType;
      }
    }

    return true;
  }

  private _calculateDateRange(
    relativeInterval: RelativeInterval,
    relativeDuration: number | null | undefined,
    relativePeriod: RelativePeriod
  ): [string, string] {
    const today = dayjs();
    let startDate: dayjs.Dayjs;
    let endDate: dayjs.Dayjs;

    if (relativeDuration === undefined) {
      relativeDuration = 1; // Default duration
    }

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
          default:
            throw new Error(`Unsupported relative period for 'this': ${relativePeriod}`);
        }
        break;

      case 'last':
        if (relativeDuration === null) {
          throw new Error("Relative duration cannot be null for 'last'");
        }
        switch (relativePeriod) {
          case 'days':
            endDate = today.endOf('day');
            startDate = today.subtract(relativeDuration, 'day').startOf('day');
            break;
          case 'weeks':
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
          default:
            throw new Error(`Unsupported relative period for 'last': ${relativePeriod}`);
        }
        break;

      case 'next':
        if (relativeDuration === null) {
          throw new Error("Relative duration cannot be null for 'next'");
        }
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
          default:
            throw new Error(`Unsupported relative period for 'next': ${relativePeriod}`);
        }
        break;
      default:
        throw new Error(`Unsupported relative interval: ${relativeInterval}`);
    }

    return [
      startDate.format('YYYY-MM-DD'),
      endDate.format('YYYY-MM-DD')
    ];
  }

  private _computeFilterModel(filterModel: FilterModel): FilterModel {
    const processTree = (filter: FilterModel): FilterModel => {
      if (filter.filterType === 'join') {
        const conditions = filter.conditions ? filter.conditions.map(item => processTree(item)) : [];
        return ({
          ...filter,
          conditions
        } as JoinFilterNode);
      }

      if (filter.filterType === 'relativeDate' && filter.relativeInterval && filter.relativePeriod) {
        const [filter1, filter2] = this._calculateDateRange(
          filter.relativeInterval,
          filter.relativeDuration,
          filter.relativePeriod
        );
        return ({
          ...filter,
          filter1,
          filter2,
        } as ColumnFilterNode);
      }

      return filter;
    };

    return processTree(filterModel);
  }

  public getFilterModel(): FilterModel {
    return this.filterModel;
  }

  public setFilterModel(filterModel: FilterModel | undefined): void {
    this.filterModel = this.validateFilterModel(filterModel);
  }
}

export const getDefaultFilterType = (filterType: string): TextFilterType | ScalarFilterType | RelativeDateFilterType => {
  if (filterType === 'text') return 'contains';
  if (['number', 'date', 'datetime-local'].includes(filterType)) return 'equals';
  if (filterType === 'relativeDate') return 'relativeDate';
  return 'equals'; // Default fallback
}

export const isScalarType = (filterType: string): filterType is 'number' | 'date' | 'datetime-local' => {
  return ['number', 'date', 'datetime-local'].includes(filterType);
}