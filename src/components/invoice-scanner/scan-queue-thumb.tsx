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

export type QueueStatus = 'done' | 'fetching' | 'queued';

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
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          borderTopColor: 'transparent',
        },
        style,
      ]}
    />
  );
}

function MiniQrPattern() {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 2,
        overflow: 'hidden',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {Array.from({ length: 36 }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 6,
            height: 6,
            backgroundColor:
              (i + Math.floor(i / 6)) % 2 === 0 ? '#000' : '#fff',
          }}
        />
      ))}
    </View>
  );
}

interface ScanQueueThumbProps {
  status: QueueStatus;
}

export function ScanQueueThumb({ status }: ScanQueueThumbProps) {
  const bg =
    status === 'done'
      ? 'bg-white'
      : status === 'fetching'
        ? 'bg-surface-2'
        : 'bg-surface';
  const border =
    status === 'fetching'
      ? 'border-2 border-white'
      : 'border border-white/[0.08]';

  return (
    <View
      className={`h-13 w-13 items-center justify-center overflow-hidden rounded-xl ${bg} ${border}`}
      style={{ width: 52, height: 52, position: 'relative' }}
    >
      {status === 'done' && (
        <>
          <MiniQrPattern />
          <View
            className="absolute right-1 top-1 h-4 w-4 items-center justify-center rounded-full bg-income"
            style={{
              shadowColor: '#FFFFFF',
              shadowOpacity: 1,
              shadowRadius: 0,
              shadowOffset: { width: 0, height: 0 },
            }}
          >
            <CheckIcon size={10} color="#FFFFFF" weight="bold" />
          </View>
        </>
      )}
      {status === 'fetching' && <Spinner />}
      {status === 'queued' && (
        <Text
          className="text-text-mute"
          style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 14 }}
        >
          ···
        </Text>
      )}
    </View>
  );
}
