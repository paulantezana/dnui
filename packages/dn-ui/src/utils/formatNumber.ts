export const FormatNumber = (number: number | string, presition: number = 2): string | number => {
  const parsed = parseFloat(number as string);

  if (isNaN(parsed)) {
    return 0;
  }

  return parsed.toLocaleString('es-US', {
    style: 'decimal',
    minimumFractionDigits: presition,
    maximumFractionDigits: presition
  });
};
