import { useScannerScreen } from '@/hooks/view-models/use-scanner-screen';
import { CameraView } from 'expo-camera';
import { Text, View } from 'react-native';
import { ConcluirButton } from './concluir-button';
import { ScanAimWindow } from './scan-aim-window';
import { ScanInstruction } from './scan-instruction';
import { ScanQueueStrip } from './scan-queue-strip';
import { ScanTopBar } from './scan-top-bar';
import { ShutterButton } from './shutter-button';

interface InvoiceScannerProps {
  onDone: () => void;
}

export function InvoiceScanner({ onDone }: InvoiceScannerProps) {
  const vm = useScannerScreen({ onDone });

  if (!vm.permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-8">
        <Text
          className="text-center text-base text-white"
          style={{ fontFamily: 'Sora_600SemiBold' }}
        >
          Aguardando permissão da câmera...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={vm.handleBarcodeScanned}
      />

      <ScanAimWindow />
      <ScanTopBar onClose={vm.handleClose} batchCount={vm.scannedUrls.length} />
      <ScanInstruction />

      <View className="absolute inset-x-0 bottom-0 pb-6">
        <ScanQueueStrip urls={vm.scannedUrls} />
        <View className="mt-3 flex-row items-center justify-between px-6">
          <View
            className="h-13 w-13 items-center justify-center rounded-2xl bg-white/[0.08]"
            style={{
              width: 52,
              height: 52,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
            }}
          />
          <ShutterButton onPress={vm.handleShutter} />
          <ConcluirButton
            disabled={vm.scannedUrls.length === 0}
            onPress={vm.handleConcluir}
          />
        </View>
      </View>
    </View>
  );
}
