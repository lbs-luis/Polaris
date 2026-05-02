# Polaris Expense App — QR Scanner Implementation Plan

## Context

React Native app with Expo SDK 55, focused on Android. Need to add QR code scanning for Brazilian NF-e (nota fiscal eletrônica) using `expo-camera`.

## User Answers

1. **After scanning**: For testing, just fetch + parse + display result in a simple on-screen modal. No DB save yet.
2. **Parse failure**: Show native `Alert` with error. No new packages.
3. **Camera**: Full-screen `CameraView`.
4. **Platform**: Android-focused.

---

## Steps

### 1. Install `expo-camera`

- `npx expo install expo-camera`
- Add plugin to `app.config.ts`:
  ```
  ['expo-camera', { cameraPermission: '...', barcodeScannerEnabled: true }]
  ```
- Update `NSCameraUsageDescription` to mention QR scanning for invoices.

### 2. Create Invoice Service

**File:** `src/services/invoice.service.ts`

Responsibilities:

- `extractChaveAcesso(url: string): string` — extracts the 44-digit key from SEFAZ QR URL
- `fetchInvoice(url: string): Promise<ParsedInvoice>` — fetches HTML, parses it, returns structured data
- `parseNFeHtml(html: string): ParsedInvoice` — internal parser using regex/string matching

`ParsedInvoice` shape (temporary, for display):

```ts
interface ParsedInvoice {
  chave_acesso: string;
  establishment_name: string;
  cnpj: string;
  issued_at: string;
  total_value: number; // centavos
  qrcode_url: string;
}
```

Error handling:

- Network failure → throw with message
- Parse failure → throw with message
- Both caught by UI and shown via `Alert.alert()`

### 3. Create Scanner Button Component

**File:** `src/components/ui/scanner-button.tsx`

- Floating circular button: absolute `bottom-4 right-4`, `ScanLine` icon from lucide
- On press: shows full-screen camera overlay
- Uses `CameraView` with `barcodeScannerSettings={{ barcodeTypes: ['qr'] }}`
- `onBarcodeScanned` callback receives `result.data` (the SEFAZ URL)
- Includes a close button (X) to dismiss camera without scanning
- Uses `useCameraPermissions()` to request permission
- Only one `CameraView` active at a time (unmounts when not visible)

### 4. Create Simple Result Display

**File:** inline in `home/index.tsx` (or separate component if grows)

- `const [scannedInvoice, setScannedInvoice] = useState<ParsedInvoice | null>(null)`
- When `scannedInvoice !== null`:
  - Render absolute positioned `View` covering screen
  - Background: black/opacity
  - White text showing parsed fields
  - Close button to dismiss (`setScannedInvoice(null)`)
- Very minimal, no styling library needed beyond NativeWind

### 5. Integrate into Home Screen

**File:** `src/app/home/index.tsx`

- Add `<ScannerButton />` in the bottom-right corner
- On scan flow:
  1. Camera closes
  2. Show loading indicator (optional simple text)
  3. Call `invoiceService.fetchInvoice(url)`
  4. On success → `setScannedInvoice(result)`
  5. On error → `Alert.alert('Erro', error.message)`

### 6. Verification

- Run `npx tsc --noEmit` for TypeScript checks
- Test on Android device:
  - Permission request works
  - QR scan triggers callback
  - SEFAZ URL is fetched and parsed
  - Result modal displays correctly
  - Error cases show Alert

---

## Future TODOs

- Save scanned invoice to database (`useInvoicesTable().set()`)
- Link invoice to transaction during confirmation flow
- Robust HTML parser (SEFAZ changes structure)
- Retry logic for offline scenarios (save qrcode_url, re-fetch later)
- iOS-specific testing and config
