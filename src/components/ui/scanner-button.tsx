import { extractChave } from '@/services/invoice.service';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScanLine, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface ScannerButtonProps {
  onConfirm: (urls: string[]) => void;
}

export function ScannerButton({ onConfirm }: ScannerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [permission, requestPermission] = useCameraPermissions();

  const handleOpen = useCallback(() => {
    if (!permission?.granted) {
      requestPermission().then((response) => {
        if (response.granted) {
          setIsOpen(true);
        } else {
          Alert.alert(
            'Permissão negada',
            'É necessário permitir o acesso à câmera para escanear QR codes.'
          );
        }
      });
    } else {
      setIsOpen(true);
    }
  }, [permission, requestPermission]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setScannedUrls([]);
  }, []);

  const handleBarcodeScanned = useCallback((result: { data: string }) => {
    const url = result.data;
    const chave = extractChave(url);

    setScannedUrls((prev) => {
      const alreadyExists = prev.some((u) => extractChave(u) === chave);
      if (alreadyExists) return prev;
      return [...prev, url];
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (scannedUrls.length === 0) return;
    onConfirm(scannedUrls);
    setScannedUrls([]);
    setIsOpen(false);
  }, [scannedUrls, onConfirm]);

  if (isOpen) {
    return (
      <View className="absolute inset-0 z-50 flex-1 bg-black">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />

        <TouchableOpacity
          className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black/50"
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <X color="#fff" size={24} />
        </TouchableOpacity>

        {scannedUrls.length > 0 && (
          <View className="absolute left-4 top-4 z-50 rounded-full bg-app-accent px-4 py-2">
            <Text className="text-sm font-bold text-app-accent-muted">
              {scannedUrls.length} nota{scannedUrls.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {scannedUrls.length > 0 && (
          <TouchableOpacity
            className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-app-accent px-8 py-4"
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text className="text-base font-extrabold uppercase text-app-accent-muted">
              Confirmar ({scannedUrls.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity
      className="absolute bottom-4 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-app-accent shadow-lg"
      onPress={handleOpen}
      activeOpacity={0.8}
    >
      <ScanLine color="#0A305F" size={28} strokeWidth={2.4} />
    </TouchableOpacity>
  );
}
