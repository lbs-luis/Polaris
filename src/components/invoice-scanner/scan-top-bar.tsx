import { BlurView } from 'expo-blur';
import { LightningIcon, XIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

function PulseDot() {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      false
    );
  }, [opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF4D4D' },
        style,
      ]}
    />
  );
}

interface ScanTopBarProps {
  onClose: () => void;
  batchCount: number;
}

export function ScanTopBar({ onClose, batchCount }: ScanTopBarProps) {
  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 flex-row items-center justify-between px-4 pt-3"
    >
      <Pressable onPress={onClose} className="overflow-hidden rounded-full">
        <BlurView
          intensity={30}
          tint="dark"
          className="h-10 w-10 items-center justify-center bg-black/55"
        >
          <XIcon size={22} color="#FFFFFF" weight="bold" />
        </BlurView>
      </Pressable>

      <View className="overflow-hidden rounded-full">
        <BlurView
          intensity={30}
          tint="dark"
          className="flex-row items-center gap-2 bg-black/55 px-3.5 py-2"
        >
          <PulseDot />
          <Text
            className="text-[13px] text-white"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            Modo lote · {batchCount} capturadas
          </Text>
        </BlurView>
      </View>

      <View className="overflow-hidden rounded-full">
        <BlurView
          intensity={30}
          tint="dark"
          className="h-10 w-10 items-center justify-center bg-black/55"
        >
          <LightningIcon size={20} color="#FFFFFF" weight="regular" />
        </BlurView>
      </View>
    </View>
  );
}
