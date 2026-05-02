# Polaris — Multi-Scan QR & Parallel Invoice Processing Plan (Confirmed)

## Context

React Native app with Expo SDK 55, Android-focused, uses `expo-camera`, NativeWind, `expo-sqlite`.

## User Confirmations

1. ✅ **Auto-save invoices** — successful results saved to DB via `useInvoicesTable().set()`
2. ✅ **Deduplicate scans** — within a batch, same `chave_acesso` scanned twice = processed once
3. ✅ **Scanner button hidden during processing** — `ScannerButton` invisible while `InvoiceSnackbar` is active. Snackbar takes `left-4 right-4` full width.

---

## Step 1 — Refactor Invoice Service (`src/services/invoice.service.ts`)

### New Types

```typescript
export type InvoiceError = { error: string };
export type InvoiceResult = [ParsedInvoice | null, InvoiceError | null];
```

### `fetchInvoice(qrUrl): Promise<InvoiceResult>`

- Extract `chave_acesso` from URL
- Fetch SEFAZ HTML with mobile User-Agent
- **Error detection FIRST** — before parsing data, check for SEFAZ error page patterns:
  - `html.match(/Erro\(s\):/i)`
  - `html.match(/não encontrada/i)`
  - `html.match(/Chave de Acesso[^<>]*inválida/i)`
  - `class="msgErro"` blocks
- Returns `InvoiceResult` tuple:
  - Success: `[invoice, null]`
  - Error: `[null, { error: "user-friendly message" }]`

### Error Messages

- Invalid QR → `"QR Code inválido — chave não encontrada."`
- SEFAZ error page → `"SEFAZ: {extracted_message}"`
- HTTP error → `"SEFAZ indisponível ({status})."`
- Parse failure → `"Não foi possível ler os dados da nota."`
- Network failure → `"Sem conexão. Tente novamente."`

### `fetchInvoices(urls, onProgress)`

```typescript
export async function fetchInvoices(
  urls: string[],
  onProgress: (done: number, total: number, result: InvoiceResult) => void
): Promise<InvoiceResult[]>;
```

- Fire all `fetchInvoice(url)` calls in parallel via `Promise.all`
- Each promise, when resolved, immediately calls `onProgress(done, total, result)`
- Returns array of all results when complete

---

## Step 2 — Multi-Scan Scanner Button (`src/components/ui/scanner-button.tsx`)

### New Props

```typescript
interface ScannerButtonProps {
  onConfirm: (urls: string[]) => void;
}
```

### Internal State

- `scannedUrls: string[]` — accumulates scanned URLs
- Dedupe by checking if URL (or extracted chave) already exists before adding

### Behavior

- Open camera → full-screen `CameraView`
- On barcode scan:
  - Extract `chave_acesso` from URL
  - If already in `scannedUrls` → ignore (silent dedupe)
  - Else add to `scannedUrls`
  - Camera **stays open**
- Show counter badge at top: `"3 notas"`
- Show bottom center button: **"Confirmar (3)"**
  - Position: `absolute bottom-8 left-1/2 -translate-x-1/2`
  - Style: rounded-full, `bg-app-accent`, white text, uppercase bold
- On confirm:
  - Call `onConfirm(scannedUrls)`
  - Reset `scannedUrls` to `[]`
  - Close camera
- On close (X button top-right):
  - Close camera
  - Discard `scannedUrls`

---

## Step 3 — Invoice Processor Hook (`src/hooks/use-invoice-processor.ts`)

### State Shape

```typescript
type ProcessorState =
  | { status: 'idle' }
  | { status: 'processing'; done: number; total: number }
  | { status: 'done'; results: InvoiceResult[] };
```

### API

```typescript
function useInvoiceProcessor() {
  const [state, setState] = useState<ProcessorState>({ status: 'idle' });

  const process = useCallback(async (urls: string[]) => {
    setState({ status: 'processing', done: 0, total: urls.length });

    const results = await fetchInvoices(urls, (done, total) => {
      setState({ status: 'processing', done, total });
    });

    setState({ status: 'done', results });

    // Auto-save successful invoices to DB
    const { set } = useInvoicesTable();
    const successful = results
      .filter((r): r is [ParsedInvoice, null] => r[0] !== null)
      .map((r) => r[0]);

    for (const invoice of successful) {
      await set({
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
        items: '[]',
        qrcode_url: invoice.qrcode_url,
        raw_html: '',
      });
    }

    setTimeout(() => setState({ status: 'idle' }), 5000);
    return results;
  }, []);

  const dismiss = useCallback(() => setState({ status: 'idle' }, []);

  return { state, process, dismiss };
}
```

---

## Step 4 — Snackbar Component (`src/components/ui/invoice-snackbar.tsx`)

### Position

```
absolute bottom-4 left-4 right-4 z-30
```

Full width respecting screen padding.

### States

**Processing:**

- Background: `bg-surface-secondary/95`
- Layout: horizontal flex row — text left, spinner right
- Text: `"Processando nota {done}/{total}"`
- Spinner: React Native `ActivityIndicator` (circular, built-in)
  - `size="small"`, color `text-accent`

**Done:**

- Count successes and errors from results
- Text: `"{success} salva(s) • {errors} erro(s)"`
- Auto-dismisses after 5s (handled by hook)

**Idle:**

- Render `null`

### Props

```typescript
interface InvoiceSnackbarProps {
  state: ProcessorState;
}
```

---

## Step 5 — Home Screen Integration (`src/app/home/index.tsx`)

### Changes

1. Replace `ScannerButton` prop from `onScan` to `onConfirm`
2. Use `useInvoiceProcessor()` hook
3. Render `<InvoiceSnackbar state={state} />` above `ScannerButton`
4. Remove old single-scan modal (`scannedInvoice` state and its UI)
5. `handleConfirm(urls)` calls `processor.process(urls)`
6. **Scanner button visibility**: Only render `ScannerButton` when `state.status === 'idle'`

### Flow

1. User taps scanner button → camera opens
2. User scans 3 invoices rapidly → counter shows "3 notas"
3. User taps "Confirmar (3)" → camera closes
4. `processor.process(urls)` starts
5. Snackbar appears: "Processando nota 0/3" + spinner
6. Scanner button is **hidden**
7. As each fetch completes, snackbar updates: "1/3", "2/3", "3/3"
8. Successful invoices saved to DB automatically
9. Done: "3 salva(s) • 0 erro(s)"
10. Snackbar auto-dismisses after 5s
11. Scanner button **reappears**

---

## Step 6 — Files Changed / Created

| File                                     | Action                                                                |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `src/services/invoice.service.ts`        | Refactor to tuple return, add SEFAZ error extraction, add batch fetch |
| `src/components/ui/scanner-button.tsx`   | Multi-scan mode with confirm button + dedupe                          |
| `src/hooks/use-invoice-processor.ts`     | **New** — processing state + auto-save to DB                          |
| `src/components/ui/invoice-snackbar.tsx` | **New** — bottom progress snackbar                                    |
| `src/app/home/index.tsx`                 | Integrate processor + snackbar + multi-scan + auto-save               |

---

## Verification Checklist

- [ ] `npx tsc --noEmit` — zero errors
- [ ] Multi-scan: camera stays open, URLs accumulate
- [ ] Dedupe: same QR scanned twice = only one entry
- [ ] Parallel fetch: 3+ invoices processed simultaneously
- [ ] Real-time snackbar updates as each completes
- [ ] Scanner button hidden during processing, visible after
- [ ] Successful invoices saved to DB (check via `useInvoicesTable().list()`)
- [ ] Error cases: SEFAZ error page, invalid QR, no network → correct messages in summary
