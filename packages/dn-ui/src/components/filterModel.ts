// ─────────────────────────────────────────────────────────────
// 🔸 Tipos base y configuración
// ─────────────────────────────────────────────────────────────

/**
 * Tipos de entrada disponibles para los filtros
 * - 'text': Para campos de texto
 * - 'number': Para campos numéricos
 * - 'date': Para campos de fecha
 * - 'datetime-local': Para campos de fecha y hora
 * - 'relativeDate': Para filtros de fecha relativa
 */
export type DnInputType = 'text' | 'number' | 'date' | 'datetime-local' | 'relativeDate';

/**
 * Define un campo de filtro con su configuración
 */
export interface FilterField {
  /** Etiqueta o nombre descriptivo del campo que se mostrará en la interfaz */
  caption: string;
  /** Identificador único del campo en los datos */
  field: string;
  /** Tipo de entrada que determina el comportamiento del filtro */
  filterType: DnInputType;
}

/**
 * Opciones de configuración para el sistema de filtros
 */
export interface FilterOptions {
  /** ID del elemento HTML donde se renderizará el filtro */
  elementId: string;
  /** Lista de campos disponibles para filtrar */
  fields: FilterField[];
  /** Modelo de filtro inicial (opcional) */
  filterModel?: FilterModel;
}

// ─────────────────────────────────────────────────────────────
// 🔸 Constantes de tipos de filtro
// ─────────────────────────────────────────────────────────────

/**
 * Tipos de filtro disponibles para campos de texto
 * Incluye operadores como igual, contiene, empieza con, etc.
 */
export const FILTER_TEXT_FILTER_TYPE = {
  equals: 'Igual a',
  notEqual: 'No igual a',
  contains: 'Contiene',
  notContains: 'No contiene',
  startsWith: 'Empieza con',
  endsWith: 'Termina con',
  blank: 'En blanco',
  notBlank: 'No en blanco',
  in: 'Incluye',
} as const;

/**
 * Tipos de filtro disponibles para campos escalares (número, fecha, datetime)
 * Incluye operadores de comparación como mayor que, menor que, entre, etc.
 */
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
  in: 'Incluye',
} as const;

/**
 * Tipos de filtro disponibles para fechas relativas
 * Permite filtrar por períodos relativos como "últimos 7 días"
 */
export const FILTER_RELATIVE_DATE_FILTER_TYPE = {
  relativeDate: 'Relativo',
} as const;

/**
 * Intervalos relativos disponibles para filtros de fecha
 * - 'last': Períodos pasados (ej: últimos 7 días)
 * - 'this': Período actual (ej: este mes)
 * - 'next': Períodos futuros (ej: próximos 30 días)
 */
export const FILTER_RELATIVE_DATE_TYPE = {
  last: 'Último(s)',
  this: 'Este',
  next: 'Siguiente(s)',
} as const;

/**
 * Períodos de tiempo disponibles para filtros relativos (plural)
 * Se usa cuando se especifica una cantidad (ej: 3 meses)
 */
export const FILTER_RELATIVE_DATE_PERIODS = {
  days: 'Días',
  weeks: 'Semanas',
  months: 'Meses',
  years: 'Años',
} as const;

/**
 * Tipos de filtro para fechas relativas (constante duplicada, se mantiene por compatibilidad)
 * El tipo de filtro a aplicar debe ser de tipo inRange(entre)
 */
export const FILTER_RELATIVE_DATE_TILTER_TYPE = {
  relativeDate: 'Relativo',
} as const;

/**
 * Períodos de tiempo disponibles para filtros relativos (singular)
 * Se usa para el período actual (ej: este mes)
 */
export const FILTER_RELATIVE_DATE_PERIOD = {
  day: 'Día',
  week: 'Semana',
  month: 'Mes',
  year: 'Año',
} as const;

// ─────────────────────────────────────────────────────────────
// 🔸 Tipos auxiliares
// ─────────────────────────────────────────────────────────────

/**
 * Tipo que representa las claves de los filtros de texto
 */
export type TextFilterType = keyof typeof FILTER_TEXT_FILTER_TYPE;

/**
 * Tipo que representa las claves de los filtros escalares
 */
export type ScalarFilterType = keyof typeof FILTER_SCALAR_FILTER_TYPE;

/**
 * Tipo que representa las claves de los filtros de fecha relativa
 */
export type RelativeDateFilterType = keyof typeof FILTER_RELATIVE_DATE_FILTER_TYPE;

/**
 * Tipo que representa los intervalos relativos disponibles
 */
export type RelativeInterval = keyof typeof FILTER_RELATIVE_DATE_TYPE;

/**
 * Tipo que representa los períodos de tiempo relativos disponibles
 * Combina tanto períodos en plural como en singular
 */
export type RelativePeriod = keyof typeof FILTER_RELATIVE_DATE_PERIODS | keyof typeof FILTER_RELATIVE_DATE_PERIOD;

// ─────────────────────────────────────────────────────────────
// 🔸 Modelo de filtros (recursivo)
// ─────────────────────────────────────────────────────────────

/**
 * Nodo que representa un filtro de columna individual
 * Contiene la configuración específica para filtrar un campo de datos
 */
export interface ColumnFilterNode {
  /** Identificador único del filtro */
  key: number;
  /** Tipo de entrada del campo (text, number, date, etc.) */
  filterType: DnInputType;
  /** Nombre del campo en los datos a filtrar */
  field: string;
  /** Tipo de operación de filtro (equals, contains, greaterThan, etc.) */
  type:
  | TextFilterType
  | ScalarFilterType
  | RelativeDateFilterType;

  /** Primer valor del filtro (obligatorio para la mayoría de operaciones) */
  filter1: string | number | null;
  /** Segundo valor del filtro (opcional, usado para rangos como 'inRange') */
  filter2?: string | number | null;

  /** Intervalo relativo para filtros de fecha (last, this, next) */
  relativeInterval?: RelativeInterval;
  /** Duración del período relativo (ej: 7 para "últimos 7 días") */
  relativeDuration?: number | null;
  /** Período de tiempo relativo (days, weeks, months, years) */
  relativePeriod?: RelativePeriod;
}

/**
 * Nodo que representa una unión lógica de filtros
 * Permite agrupar múltiples filtros con operadores AND/OR
 */
export interface JoinFilterNode {
  /** Identificador único del grupo de filtros */
  key: number;
  /** Tipo fijo 'join' para identificar nodos de unión */
  filterType: 'join';
  /** Operador lógico para combinar las condiciones (AND u OR) */
  type: 'AND' | 'OR';
  /** Lista de condiciones que pueden ser filtros individuales o grupos anidados */
  conditions: FilterModel[];
}

/**
 * Tipo unión que representa cualquier nodo del árbol de filtros
 * Puede ser un filtro individual (ColumnFilterNode) o un grupo (JoinFilterNode)
 */
export type FilterModel = ColumnFilterNode | JoinFilterNode;
