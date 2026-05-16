import { BlurView } from 'expo-blur';
import { Text, View } from 'react-native';

export function ScanInstruction() {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        marginTop: 130,
      }}
      className="items-center"
    >
      <View className="overflow-hidden rounded-full">
        <BlurView intensity={30} tint="dark" className="bg-black/60 px-4 py-2">
          <Text
            className="text-[13px] text-white"
            style={{ fontFamily: 'Sora_600SemiBold' }}
          >
            Aponte para o QR Code da nota fiscal
          </Text>
        </BlurView>
      </View>
    </View>
  );
}
