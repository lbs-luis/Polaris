import { useInvoicesTable } from '@/database/tables/invoices.table';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import {
  fetchInvoices,
  InvoiceResult,
  ParsedInvoice,
} from '@/services/invoice.service';
import { useCallback, useState } from 'react';

export type ProcessorState =
  | { status: 'idle' }
  | { status: 'processing'; done: number; total: number }
  | { status: 'done'; results: InvoiceResult[] };

interface ParsedDateTime {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  /** ISO-ish YYYY-MM-DDTHH:MM:SS in local components (sortable lexicographically). */
  iso: string;
}

/**
 * Parses NFC-e issued_at strings like "15/05/2026 18:42:33" (Brazilian DD/MM/YYYY).
 * Hours/minutes default to 12:00 if not present in the source.
 */
function parseInvoiceDateTime(issued_at: string): ParsedDateTime {
  const match = issued_at.match(
    /(\d{2})\/(\d{2})\/(\d{4})(?:[\sT]+(\d{2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const hour = match[4] ? parseInt(match[4], 10) : 12;
    const minute = match[5] ? parseInt(match[5], 10) : 0;
    const second = match[6] ? parseInt(match[6], 10) : 0;
    const iso = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    return { day, month, year, hour, minute, iso };
  }
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    iso: now.toISOString().slice(0, 19),
  };
}

export function useInvoiceProcessor() {
  const [state, setState] = useState<ProcessorState>({ status: 'idle' });
  const { set: setInvoice } = useInvoicesTable();
  const { set: setTransaction } = useTransactionsTable();

  const process = useCallback(
    async (urls: string[]) => {
      setState({ status: 'processing', done: 0, total: urls.length });

      const results = await fetchInvoices(urls, (done, total) => {
        setState({ status: 'processing', done, total });
      });

      setState({ status: 'done', results });

      const successful = results
        .filter((r): r is [ParsedInvoice, null] => r[0] !== null)
        .map((r) => r[0]);

      for (const invoice of successful) {
        try {
          await setInvoice({
            chave_acesso: invoice.chave_acesso,
            establishment_name: invoice.establishment_name,
            cnpj: invoice.cnpj,
            issued_at: invoice.issued_at,
            total_value: invoice.total_value,
            tax_icms: 0,
            tax_iof: 0,
            tax_pis: 0,
            tax_cofins: 0,
            tax_others: invoice.tax_total,
            items: JSON.stringify(invoice.items),
            qrcode_url: invoice.qrcode_url,
            raw_html: '',
          });

          const parsed = parseInvoiceDateTime(invoice.issued_at);

          await setTransaction({
            value: invoice.total_value,
            month: parsed.month,
            year: parsed.year,
            due_day: parsed.day,
            description: invoice.establishment_name,
            category_id: 1,
            invoice_id: invoice.chave_acesso,
            issued_at: parsed.iso,
          });
        } catch {
          // Silently skip if INSERT fails
        }
      }

      setTimeout(() => setState({ status: 'idle' }), 5000);
      return results;
    },
    [setInvoice, setTransaction]
  );

  const dismiss = useCallback(() => setState({ status: 'idle' }), []);

  return { state, process, dismiss };
}
