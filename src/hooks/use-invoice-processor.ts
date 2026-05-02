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

function parseInvoiceDate(issued_at: string): {
  day: number;
  month: number;
  year: number;
} {
  const match = issued_at.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    return {
      day: parseInt(match[1], 10),
      month: parseInt(match[2], 10),
      year: parseInt(match[3], 10),
    };
  }
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
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

          const { day, month, year } = parseInvoiceDate(invoice.issued_at);

          await setTransaction({
            value: invoice.total_value,
            month,
            year,
            due_day: day,
            description: invoice.establishment_name,
            category_id: 1,
            invoice_id: invoice.chave_acesso,
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
