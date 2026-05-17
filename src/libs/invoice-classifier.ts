/**
 * Maps merchant-name patterns to a default category. First-match wins, so
 * order the rules by specificity (longer / brand-specific patterns first).
 *
 * Categories referenced here MUST exist as seeded defaults in
 * `categories.table.ts` so the processor can resolve them by name.
 */
const RULES: Array<{ patterns: RegExp[]; category: string }> = [
  {
    patterns: [
      /mercado/i,
      /supermercado/i,
      /atacad/i,
      /hortifruti/i,
      /padaria/i,
      /a[çc]ougue/i,
      /alimentos/i,
      /\bsuper\b/i,
    ],
    category: 'Mercado',
  },
  {
    patterns: [
      /restaurante/i,
      /pizzaria/i,
      /lanchonete/i,
      /\bbar\b/i,
      /lanches/i,
      /churrasc/i,
    ],
    category: 'Restaurante',
  },
  {
    patterns: [/drogaria/i, /farm[áa]cia/i, /droga\s/i],
    category: 'Farmácia',
  },
  {
    patterns: [/posto/i, /combust[íi]vel/i, /shell/i, /ipiranga/i, /petrobr/i],
    category: 'Combustível',
  },
  {
    patterns: [/uber/i, /\b99\b/i, /transporte/i, /metr[ôo]/i],
    category: 'Transporte',
  },
  {
    patterns: [
      /magazine/i,
      /americanas/i,
      /\blojas\b/i,
      /confec[çc]/i,
      /boutique/i,
      /roupas/i,
    ],
    category: 'Compras',
  },
];

/**
 * Returns the suggested category name for an NFC-e merchant string,
 * or null when no rule matches. Caller is responsible for falling
 * back to a default (e.g., "Outros").
 */
export function classifyByMerchant(merchant: string): string | null {
  for (const { patterns, category } of RULES) {
    if (patterns.some((p) => p.test(merchant))) return category;
  }
  return null;
}
