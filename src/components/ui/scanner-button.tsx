import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScanLine, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';

interface ScannerButtonProps {
  onScan: (url: string) => void;
}

export function ScannerButton({ onScan }: ScannerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
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
  }, []);

  const handleBarcodeScanned = useCallback(
    (result: { data: string }) => {
      setIsOpen(false);
      onScan(result.data);
    },
    [onScan]
  );

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
