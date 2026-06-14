export const MONTH_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const WEEKDAY_LONG = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

/** Formats a date as "14/06 segunda-feira" for the home greeting. */
export function formatDayWithWeekday(date: Date): string {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${WEEKDAY_LONG[date.getDay()]}`;
}

/**
 * Returns "Hoje", "Ontem", or "Sex, 12 Mai" based on how recent the date is.
 * Always interprets the date in the user's local timezone.
 */
export function formatRelativeDate(
  day: number,
  month: number,
  year: number
): string {
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDay = new Date(year, month - 1, day);
  targetDay.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  return `${WEEKDAY_SHORT[target.getDay()]}, ${day} ${MONTH_SHORT[month - 1]}`;
}

const pad = (n: number) => n.toString().padStart(2, '0');

/**
 * Formats an ISO-ish datetime string (e.g. "2026-05-15T18:42:00") as
 * Brazilian "DD/MM HH:MM". Falls back to an empty string when the input
 * can't be parsed.
 */
export function formatInvoiceDateTime(isoLike: string): string {
  const match = isoLike.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})/);
  if (!match) return '';
  const [, , month, day, hour, minute] = match;
  return `${day}/${month} ${hour}:${minute}`;
}

/**
 * Convenience for transaction rows: picks the precise invoice timestamp when
 * available, otherwise falls back to the relative "Hoje / Ontem / Sex, 12 Mai"
 * format used for recurrents and manual entries.
 */
export function formatTransactionTime(
  issued_at: string | null,
  day: number | null,
  month: number,
  year: number
): string {
  if (issued_at) {
    const formatted = formatInvoiceDateTime(issued_at);
    if (formatted) return formatted;
  }
  if (day != null) return formatRelativeDate(day, month, year);
  return `${pad(month)}/${year}`;
}
