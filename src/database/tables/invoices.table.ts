import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

export interface InvoiceItem {
  desc: string;
  qty: number;
  unit: number; // centavos
  total: number; // centavos
}

export interface IInvoicesTUpdate {
  chave_acesso: string;
  establishment_name: string;
  cnpj: string;
  issued_at: string; // ISO date
  total_value: number; // centavos
  tax_icms: number;
  tax_iof: number;
  tax_pis: number;
  tax_cofins: number;
  tax_others: number;
  items: string; // JSON array string
  qrcode_url: string;
  raw_html: string;
}

export interface IInvoicesTRow {
  chave_acesso: string;
  establishment_name: string;
  cnpj: string;
  issued_at: string;
  total_value: number;
  tax_icms: number;
  tax_iof: number;
  tax_pis: number;
  tax_cofins: number;
  tax_others: number;
  items: string;
  qrcode_url: string;
  raw_html: string;
  scanned_at: string;
}

type IInvoicesTSelect = IInvoicesTRow | null;

export function useInvoicesTable() {
  const database = useSQLiteContext();

  const set = useCallback(
    async (invoice: IInvoicesTUpdate) => {
      await database.runAsync(
        `INSERT OR IGNORE INTO invoices (
          chave_acesso, establishment_name, cnpj, issued_at,
          total_value, tax_icms, tax_iof, tax_pis, tax_cofins, tax_others,
          items, qrcode_url, raw_html, scanned_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          invoice.chave_acesso,
          invoice.establishment_name,
          invoice.cnpj,
          invoice.issued_at,
          invoice.total_value,
          invoice.tax_icms,
          invoice.tax_iof,
          invoice.tax_pis,
          invoice.tax_cofins,
          invoice.tax_others,
          invoice.items,
          invoice.qrcode_url,
          invoice.raw_html,
        ]
      );
    },
    [database]
  );

  const select = useCallback(
    async (chave_acesso: string): Promise<IInvoicesTSelect> => {
      return (await database.getFirstAsync(
        `SELECT * FROM invoices WHERE chave_acesso = ?`,
        [chave_acesso]
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
    async (chave_acesso: string) => {
      await database.runAsync(`DELETE FROM invoices WHERE chave_acesso = ?`, [
        chave_acesso,
      ]);
    },
    [database]
  );

  return { set, select, list, exclude };
}

export const CreateInvoicesTable = `
  CREATE TABLE IF NOT EXISTS invoices (
    chave_acesso TEXT PRIMARY KEY,
    establishment_name TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    total_value INTEGER NOT NULL,
    tax_icms INTEGER NOT NULL DEFAULT 0,
    tax_iof INTEGER NOT NULL DEFAULT 0,
    tax_pis INTEGER NOT NULL DEFAULT 0,
    tax_cofins INTEGER NOT NULL DEFAULT 0,
    tax_others INTEGER NOT NULL DEFAULT 0,
    items TEXT NOT NULL,
    qrcode_url TEXT NOT NULL,
    raw_html TEXT NOT NULL,
    scanned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
