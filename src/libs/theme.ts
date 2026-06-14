/**
 * Polaris design tokens — the single source of truth for colors used in places
 * that can't take a Tailwind class (e.g. Phosphor `color` props, SVG fills,
 * inline shadow/border styles). Mirrors the palette in tailwind.config.js and
 * the `P` tokens from the Claude Design handoff (Samsung One UI–inspired,
 * absolute-dark monochrome).
 */
export const theme = {
  // surfaces — true-black canvas; cards are tone-lifted (no borders)
  bg: '#000000',
  surface: '#161618', // cards / list groups
  surface2: '#212124', // inner chips, inputs, nested blocks
  surface3: '#2E2E33', // tracks, pressed, grabber
  border: '#34343A',
  borderSubtle: '#242428', // hairline dividers only (inside groups)
  // text
  text: '#FFFFFF',
  textDim: '#9C9CA6',
  textMute: '#62626B',
  // brand — WHITE is the primary; black sits on white surfaces
  brand: '#FFFFFF',
  brandDark: '#E8E8EC',
  brandFg: '#000000',
  // semantic — income / expense only; keep distinctive
  income: '#3CC85F',
  outcome: '#FF4D4D',
  warning: '#FFB320',
} as const;

export type ThemeColor = keyof typeof theme;
