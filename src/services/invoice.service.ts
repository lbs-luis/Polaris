export interface ParsedInvoice {
  chave_acesso: string;
  establishment_name: string;
  cnpj: string;
  address: string;
  issued_at: string;
  total_value: number; // centavos
  tax_total: number; // centavos
  qrcode_url: string;
}

function toCents(raw: string): number {
  const clean = raw.replace(/[^\d,]/g, '').replace(',', '.');
  return Math.round(parseFloat(clean) * 100) || 0;
}

function extractChave(url: string): string | null {
  return url.match(/\d{44}/)?.[0] ?? null;
}

function parseHtml(
  html: string
): Omit<ParsedInvoice, 'chave_acesso' | 'qrcode_url'> | null {
  const get = (id: string) =>
    html.match(new RegExp(`id="${id}"[^>]*>([^<]+)`))?.[1]?.trim() ?? null;

  const getClass = (cls: string) =>
    html.match(new RegExp(`class="${cls}"[^>]*>([^<]+)`))?.[1]?.trim() ?? null;

  const establishment_name = get('u20');
  if (!establishment_name) return null;

  const cnpj = html.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)?.[0] ?? '';

  const textMatches = [...html.matchAll(/class="text"[^>]*>\s*([^<]+)/g)];
  const address = textMatches[1]?.[1]?.trim() ?? '';

  const issued_at =
    html.match(/Emiss[aã]o.*?(\d{2}\/\d{2}\/\d{4}\s[\d:]+)/s)?.[1]?.trim() ??
    '';

  const totalRaw =
    html.match(/class="totalNumb txtMax"[^>]*>([^<]+)/)?.[1] ?? '0';

  const taxRaw =
    html.match(/class="totalNumb txtObs"[^>]*>([^<]+)/)?.[1] ?? '0';

  return {
    establishment_name,
    cnpj,
    address,
    issued_at,
    total_value: toCents(totalRaw),
    tax_total: toCents(taxRaw),
  };
}

export async function fetchInvoice(
  qrUrl: string
): Promise<ParsedInvoice | null> {
  const chave_acesso = extractChave(qrUrl);
  if (!chave_acesso) return null;

  try {
    const response = await fetch(qrUrl);
    if (!response.ok) return null;

    const html = await response.text();
    const parsed = parseHtml(html);
    if (!parsed) return null;

    return { chave_acesso, qrcode_url: qrUrl, ...parsed };
  } catch {
    return null;
  }
}
