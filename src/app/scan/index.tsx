import { InvoiceScanner } from '@/components/invoice-scanner';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
  const router = useRouter();
  return <InvoiceScanner onDone={() => router.replace('/home')} />;
}
