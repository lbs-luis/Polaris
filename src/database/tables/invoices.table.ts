import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

export interface IInvoiceItem {
  desc: string;
  qty: number;
}

export interface IInvoicesTUpdate {
  key: string; // chave de acesso (44 digits)
  merchant: string;
  cnpj: string;
  address?: string | null;
  issued_at: string; // ISO datetime (YYYY-MM-DDTHH:MM:SS)
  number?: string | null;
  series?: string | null;
  protocol?: string | null;
  total: number; // cents
  tax_total: number; // cents
  payment_method?: string | null;
  paid?: number | null;
  items: string; // JSON array of IInvoiceItem
  qrcode_url: string;
}

export interface IInvoicesTRow {
  key: string;
  merchant: string;
  cnpj: string;
  address: string | null;
  issued_at: string;
  number: string | null;
  series: string | null;
  protocol: string | null;
  total: number;
  tax_total: number;
  payment_method: string | null;
  paid: number | null;
  items: string;
  qrcode_url: string;
  scanned_at: string;
}

type IInvoicesTSelect = IInvoicesTRow | null;

export function useInvoicesTable() {
  const database = useSQLiteContext();

  const set = useCallback(
    async (invoice: IInvoicesTUpdate) => {
      await database.runAsync(
        `INSERT OR IGNORE INTO invoices (
          key, merchant, cnpj, address, issued_at,
          number, series, protocol,
          total, tax_total,
          payment_method, paid,
          items, qrcode_url, scanned_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          invoice.key,
          invoice.merchant,
          invoice.cnpj,
          invoice.address ?? null,
          invoice.issued_at,
          invoice.number ?? null,
          invoice.series ?? null,
          invoice.protocol ?? null,
          invoice.total,
          invoice.tax_total,
          invoice.payment_method ?? null,
          invoice.paid ?? null,
          invoice.items,
          invoice.qrcode_url,
        ]
      );
    },
    [database]
  );

  const select = useCallback(
    async (key: string): Promise<IInvoicesTSelect> => {
      return (await database.getFirstAsync(
        `SELECT * FROM invoices WHERE key = ?`,
        [key]
      )) as IInvoicesTSelect;
    },
    [database]
  );

  const list = useCallback(async (): Promise<IInvoicesTRow[]> => {
    return (await database.getAllAsync(
      `SELECT * FROM invoices ORDER BY scanned_at DESC`
    )) as IInvoicesTRow[];
  }, [database]);

  const exclude = useCallback(
    async (key: string) => {
      await database.runAsync(`DELETE FROM invoices WHERE key = ?`, [key]);
    },
    [database]
  );

  return { set, select, list, exclude };
}

export const CreateInvoicesTable = `
  CREATE TABLE IF NOT EXISTS invoices (
    key TEXT PRIMARY KEY,
    merchant TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    address TEXT,
    issued_at TEXT NOT NULL,
    number TEXT,
    series TEXT,
    protocol TEXT,
    total INTEGER NOT NULL,
    tax_total INTEGER NOT NULL DEFAULT 0,
    payment_method TEXT,
    paid INTEGER,
    items TEXT NOT NULL,
    qrcode_url TEXT NOT NULL,
    scanned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
