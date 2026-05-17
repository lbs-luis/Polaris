/**
 * Tailwind class helpers for swipeable list rows that live inside a Card.
 *
 * Three coordinated helpers — the row content keeps its top/bottom corners,
 * and the left/right swipe-action buttons mirror the matching side's
 * corner so the reveal animation stays visually flush with the rounded
 * edge of the parent container.
 */

export function rowRadiusClass(index: number, total: number): string {
  if (total <= 0) return '';
  if (total === 1) return 'rounded-card';
  if (index === 0) return 'rounded-t-card';
  if (index === total - 1) return 'rounded-b-card';
  return '';
}

/** Edit action sits on the LEFT — mirror the row's left-side corners. */
export function leftActionRadiusClass(index: number, total: number): string {
  if (total <= 0) return 'rounded-tile';
  if (total === 1) return 'rounded-l-card';
  if (index === 0) return 'rounded-tl-card';
  if (index === total - 1) return 'rounded-bl-card';
  return 'rounded-none';
}

/** Delete action sits on the RIGHT — mirror the row's right-side corners. */
export function rightActionRadiusClass(index: number, total: number): string {
  if (total <= 0) return 'rounded-tile';
  if (total === 1) return 'rounded-r-card';
  if (index === 0) return 'rounded-tr-card';
  if (index === total - 1) return 'rounded-br-card';
  return 'rounded-none';
}
