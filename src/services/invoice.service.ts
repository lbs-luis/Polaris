export interface InvoiceItem {
  desc: string;
  code: string;
  qty: number;
  unit: number; // centavos
  total: number; // centavos
}

export interface ParsedInvoice {
  chave_acesso: string;
  establishment_name: string;
  cnpj: string;
  address: string;
  issued_at: string;
  number: string | null;
  series: string | null;
  protocol: string | null;
  total_value: number; // centavos
  tax_total: number; // centavos
  payment_method: string | null;
  paid: number | null; // centavos
  items: InvoiceItem[];
  qrcode_url: string;
}

export type InvoiceError = { error: string };
export type InvoiceResult = [ParsedInvoice | null, InvoiceError | null];

function toCents(raw: string): number {
  const clean = raw.replace(/[^\d,]/g, '').replace(',', '.');
  return Math.round(parseFloat(clean) * 100) || 0;
}

export function extractChave(url: string): string | null {
  return url.match(/\d{44}/)?.[0] ?? null;
}

function extractSefazError(html: string): string | null {
  const patterns = [
    /Erro\(s\):\s*<[^>]*>\s*-?\s*([^<]+)/is,
    /class="msgErro"[^>]*>([^<]+)/i,
    /Nota Fiscal[^<>]*não encontrada/is,
    /Chave de Acesso[^<>]*inválida/is,
    /class="erro"[^>]*>([^<]+)/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1]?.trim() ?? match[0]?.trim() ?? null;
  }
  return null;
}

function parseItems(html: string): InvoiceItem[] {
  const rows = [...html.matchAll(/<tr id="Item[^"]*">([\s\S]*?)<\/tr>/gi)];
  return rows.map((row) => {
    const content = row[1];
    const desc = content.match(/class="txtTit">([^<]+)/)?.[1]?.trim() ?? '';
    const code = content.match(/\(Código:\s*(\d+)\s*\)/)?.[1]?.trim() ?? '';
    const qty = content.match(/Qtde\.:?<\/strong>([^<]+)/)?.[1]?.trim() ?? '1';
    const unit =
      content.match(/Vl\. Unit\.:?<\/strong>[^>]*>?([^<]+)/)?.[1]?.trim() ??
      '0';
    const total = content.match(/class="valor">([^<]+)/)?.[1]?.trim() ?? '0';
    return {
      desc,
      code,
      qty: parseFloat(qty.replace(',', '.')) || 1,
      unit: toCents(unit),
      total: toCents(total),
    };
  });
}

function parseHtml(
  html: string
): Omit<ParsedInvoice, 'chave_acesso' | 'qrcode_url'> | null {
  const establishment_name =
    html.match(/id="u20"[^>]*>([\s\S]*?)<\/div>/)?.[1]?.trim() ?? null;
  if (!establishment_name) return null;

  const cnpj = html.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)?.[0] ?? '';

  // Address: the SEFAZ block emits sibling <div class="text">…</div> entries
  // under the merchant header — the CNPJ line first, then the address line.
  const textBlocks = [...html.matchAll(/class="text"[^>]*>([\s\S]*?)<\/div>/g)];
  const address = textBlocks[1]?.[1]?.replace(/\s+/g, ' ').trim() ?? '';

  const issued_at =
    html.match(/Emiss[aã]o.*?(\d{2}\/\d{2}\/\d{4}\s[\d:]+)/s)?.[1]?.trim() ??
    '';

  const number =
    html.match(/N[úu]mero:\s*<\/strong>\s*(\d+)/)?.[1]?.trim() ?? null;
  const series =
    html.match(/S[ée]rie:\s*<\/strong>\s*(\d+)/)?.[1]?.trim() ?? null;
  const protocol =
    html
      .match(/Protocolo de Autoriza[çc][ãa]o:\s*<\/strong>\s*(\d+)/)?.[1]
      ?.trim() ?? null;

  // Payment block: look for #linhaForma then capture the following label + value.
  // Layout per SEFAZ: <div id="linhaForma">…</div><div id="linhaTotal"><label class="tx">…</label><span class="totalNumb">12,98</span></div>
  const paymentBlock = html.match(
    /id="linhaForma"[\s\S]*?<label class="tx">\s*([\s\S]*?)<\/label>\s*<span class="totalNumb">([^<]+)<\/span>/
  );
  const payment_method = paymentBlock?.[1]?.replace(/\s+/g, ' ').trim() ?? null;
  const paid = paymentBlock?.[2] ? toCents(paymentBlock[2]) : null;

  const totalRaw =
    html.match(/class="totalNumb txtMax"[^>]*>([^<]+)/)?.[1] ?? '0';
  const taxRaw =
    html.match(/class="totalNumb txtObs"[^>]*>([^<]+)/)?.[1] ?? '0';
  const items = parseItems(html);

  return {
    establishment_name,
    cnpj,
    address,
    issued_at,
    number,
    series,
    protocol,
    total_value: toCents(totalRaw),
    tax_total: toCents(taxRaw),
    payment_method,
    paid,
    items,
  };
}

export async function fetchInvoice(qrUrl: string): Promise<InvoiceResult> {
  const chave_acesso = extractChave(qrUrl);
  if (!chave_acesso) {
    return [
      null,
      { error: 'QR Code inválido — chave de acesso não encontrada.' },
    ];
  }

  try {
    const response = await fetch(qrUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
      },
    });

    if (!response.ok) {
      return [null, { error: `SEFAZ indisponível (HTTP ${response.status}).` }];
    }

    const html = await response.text();
    const sefazError = extractSefazError(html);
    if (sefazError) return [null, { error: `SEFAZ: ${sefazError}` }];

    const parsed = parseHtml(html);
    if (!parsed)
      return [null, { error: 'Não foi possível ler os dados da nota fiscal.' }];

    return [{ chave_acesso, qrcode_url: qrUrl, ...parsed }, null];
  } catch {
    return [null, { error: 'Sem conexão. Tente novamente.' }];
  }
}

export async function fetchInvoices(
  urls: string[],
  onProgress: (done: number, total: number, result: InvoiceResult) => void
): Promise<InvoiceResult[]> {
  const results: InvoiceResult[] = [];
  let done = 0;

  await Promise.all(
    urls.map(async (url) => {
      const result = await fetchInvoice(url);
      results.push(result);
      onProgress(++done, urls.length, result);
    })
  );

  return results;
}
