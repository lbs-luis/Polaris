import { useInvoiceProcessorContext } from '@/context/invoice-processor.context';
import { CheckIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

function Spinner() {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  return (
    <Animated.View
      style={[
        {
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          borderTopColor: 'transparent',
        },
        style,
      ]}
    />
  );
}

export function SefazNotification() {
  const { state } = useInvoiceProcessorContext();

  if (state.status === 'idle') return null;

  if (state.status === 'processing') {
    const pct =
      state.total > 0 ? Math.round((state.done / state.total) * 100) : 0;
    return (
      <View className="flex-row items-center gap-3 rounded-[18px] bg-surface p-3.5">
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-surface-2">
          <Spinner />
        </View>
        <View className="flex-1">
          <Text
            className="text-[13px] text-text"
            style={{ fontFamily: 'Sora_700Bold' }}
          >
            Buscando na SEFAZ
          </Text>
          <Text
            className="text-[11px] text-text-dim"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            {state.done} de {state.total} notas processadas
          </Text>
        </View>
        <Text
          className="text-[12px] text-text"
          style={{
            fontFamily: 'JetBrainsMono_700Bold',
            fontVariant: ['tabular-nums'],
          }}
        >
          {pct}%
        </Text>
      </View>
    );
  }

  // status === 'done'
  const success = state.results.filter((r) => r[0] !== null).length;
  return (
    <View className="flex-row items-center gap-3 rounded-[18px] bg-surface p-3.5">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-income">
        <CheckIcon size={18} color="#FFFFFF" weight="bold" />
      </View>
      <View className="flex-1">
        <Text
          className="text-[13px] text-text"
          style={{ fontFamily: 'Sora_700Bold' }}
        >
          Notas importadas
        </Text>
        <Text
          className="text-[11px] text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          {success} {success === 1 ? 'salva' : 'salvas'}
        </Text>
      </View>
    </View>
  );
}
