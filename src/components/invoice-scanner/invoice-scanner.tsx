import { useScannerScreen } from '@/hooks/view-models/use-scanner-screen';
import { CameraView } from 'expo-camera';
import { Pressable, Text, View } from 'react-native';
import { ConcluirButton } from './concluir-button';
import { ScanAimWindow } from './scan-aim-window';
import { ScanCounter } from './scan-counter';

import { BlurView } from 'expo-blur';
import { XIcon } from 'phosphor-react-native';

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

      <Pressable
        onPress={vm.handleClose}
        className=" absolute right-4 top-4 overflow-hidden rounded-full"
      >
        <BlurView
          intensity={30}
          tint="dark"
          className="h-10 w-10 items-center justify-center bg-black/55"
        >
          <XIcon size={22} color="#FFFFFF" weight="bold" />
        </BlurView>
      </Pressable>
      <ScanCounter counter={vm.scannedUrls.length} />

      <View className="absolute bottom-4 right-4  w-28">
        <ConcluirButton
          disabled={vm.scannedUrls.length === 0}
          onPress={vm.handleConcluir}
        />
      </View>
    </View>
  );
}
