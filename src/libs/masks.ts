export function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (!digits) return '';

  const number = parseInt(digits, 10) / 100;

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export function parseCurrency(formatted: string): number {
  const digits = formatted.replace(/\D/g, '');
  return parseInt(digits || '0', 10) / 100;
}
