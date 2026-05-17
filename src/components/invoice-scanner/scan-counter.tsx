import { BlurView } from 'expo-blur';
import { Text, View } from 'react-native';

export function ScanCounter({ counter }: { counter: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '48%',
        marginTop: 130,
      }}
      className="items-center"
    >
      <View className="overflow-hidden rounded-full">
        {counter <= 0 ? (
          <BlurView
            intensity={30}
            tint="dark"
            className="bg-black/60 px-4 py-2"
          >
            <Text
              className="text-[13px] text-white"
              style={{ fontFamily: 'Sora_600SemiBold' }}
            >
              Aponte para o QR Code da nota fiscal
            </Text>
          </BlurView>
        ) : (
          <BlurView
            intensity={30}
            tint="dark"
            className="flex flex-row gap-3 bg-black/60 px-2.5 py-2 pr-8"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
              <Text
                className="text-base text-text-inverse"
                style={{ fontFamily: 'Sora_700Bold' }}
              >
                {counter}
              </Text>
            </View>
            <View className="felx flex-col gap-[2px]">
              <Text
                className="text-base text-text"
                style={{ fontFamily: 'Sora_700Bold' }}
              >
                Notas na fila
              </Text>
              <Text
                className="text-sm text-text-dim"
                style={{ fontFamily: 'Sora_400Regular' }}
              >
                QR Codes capturados
              </Text>
            </View>
          </BlurView>
        )}
      </View>
    </View>
  );
}
