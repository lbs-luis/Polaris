import { useInvoiceProcessorContext } from '@/context/invoice-processor.context';
import { extractChave } from '@/services/invoice.service';
import { useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UseScannerScreenOptions {
  onDone: () => void;
}

export function useScannerScreen({ onDone }: UseScannerScreenOptions) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const { process } = useInvoiceProcessorContext();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission().then((response) => {
        if (!response.granted) {
          Alert.alert(
            'Permissão negada',
            'É necessário permitir o acesso à câmera para escanear notas.'
          );
        }
      });
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = useCallback((result: { data: string }) => {
    const url = result.data;
    const chave = extractChave(url);
    setScannedUrls((prev) => {
      if (prev.some((u) => extractChave(u) === chave)) return prev;
      return [...prev, url];
    });
  }, []);

  const clearQueue = useCallback(() => setScannedUrls([]), []);

  const handleConcluir = useCallback(() => {
    if (scannedUrls.length === 0) return;
    void process(scannedUrls);
    clearQueue();
    onDone();
  }, [scannedUrls, process, clearQueue, onDone]);

  const handleClose = useCallback(() => {
    clearQueue();
    onDone();
  }, [clearQueue, onDone]);

  const handleShutter = useCallback(() => {
    // auto-scan via onBarcodeScanned; shutter is decorative for now
  }, []);

  return {
    permission,
    scannedUrls,
    handleBarcodeScanned,
    handleConcluir,
    handleClose,
    handleShutter,
  };
}
