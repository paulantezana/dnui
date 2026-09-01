/**
 * Formatea un numero con separador de miles y `precision` decimales.
 * Portado tal cual de dn-ui `utils/formatNumber.ts`: mantiene el locale
 * `es-US` y el retorno `0` (numero) cuando la entrada no es parseable.
 */
export const formatNumber = (
  value: number | string,
  precision = 2
): string | number => {
  const parsed = parseFloat(value as string)

  if (Number.isNaN(parsed)) {
    return 0
  }

  return parsed.toLocaleString('es-US', {
    style: 'decimal',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  })
}
