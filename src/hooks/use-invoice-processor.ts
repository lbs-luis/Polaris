import { useCategoriesTable } from '@/database/tables/categories.table';
import { useInvoicesTable } from '@/database/tables/invoices.table';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import { classifyByMerchant } from '@/libs/invoice-classifier';
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
  const { set: setTransaction, lastByDescription } = useTransactionsTable();
  const { list: listCategories } = useCategoriesTable();

  const process = useCallback(
    async (urls: string[]) => {
      setState({ status: 'processing', done: 0, total: urls.length });

      const results = await fetchInvoices(urls, (done, total) => {
        setState({ status: 'processing', done, total });
      });

      const successful = results
        .filter((result): result is [ParsedInvoice, null] => result[0] !== null)
        .map((result) => result[0]);

      // Load categories once per batch so each invoice can be linked to a
      // valid id without N round-trips. Resolution order, per merchant:
      //   1. Static classifier hit (e.g. "Mercado", "Restaurante").
      //   2. Learned default — the most recent transaction with the same
      //      description. This makes user edits sticky: rename a single
      //      "ALPHA POSTO" → "Transporte" once, and every future scan of
      //      that merchant starts there automatically.
      //   3. Catch-all "Outros".
      const categories = await listCategories();
      const fallbackId = categories.find((c) => c.name === 'Outros')?.id ?? 1;

      const resolveCategoryId = async (merchant: string): Promise<number> => {
        const matched = classifyByMerchant(merchant);
        if (matched) {
          const cat = categories.find((c) => c.name === matched);
          if (cat) return cat.id;
        }
        const previous = await lastByDescription(merchant);
        if (previous?.category_id != null) return previous.category_id;
        return fallbackId;
      };

      for (const invoice of successful) {
        try {
          await setInvoice({
            key: invoice.chave_acesso,
            merchant: invoice.establishment_name,
            cnpj: invoice.cnpj,
            address: invoice.address || null,
            issued_at: invoice.issued_at,
            number: invoice.number,
            series: invoice.series,
            protocol: invoice.protocol,
            total: invoice.total_value,
            tax_total: invoice.tax_total,
            payment_method: invoice.payment_method,
            paid: invoice.paid,
            items: JSON.stringify(invoice.items),
            qrcode_url: invoice.qrcode_url,
          });

          const parsed = parseInvoiceDateTime(invoice.issued_at);
          const category_id = await resolveCategoryId(
            invoice.establishment_name
          );

          await setTransaction({
            value: invoice.total_value,
            month: parsed.month,
            year: parsed.year,
            due_day: parsed.day,
            description: invoice.establishment_name,
            category_id,
            invoice_id: invoice.chave_acesso,
            issued_at: parsed.iso,
          });
        } catch {
          // Silently skip if INSERT fails
        }
      }

      // Mark done only after the rows are committed, so screens listening for
      // the 'done' transition refresh against a database that already has them.
      setState({ status: 'done', results });
      setTimeout(() => setState({ status: 'idle' }), 5000);
      return results;
    },
    [setInvoice, setTransaction, listCategories, lastByDescription]
  );

  const dismiss = useCallback(() => setState({ status: 'idle' }), []);

  return { state, process, dismiss };
}
