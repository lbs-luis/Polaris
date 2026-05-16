import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface TransactionRowSkeletonProps {
  isFirst?: boolean;
}

export function TransactionRowSkeleton({
  isFirst,
}: TransactionRowSkeletonProps) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.45, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View
      className={`flex-row items-center gap-3 px-3.5 py-3 ${isFirst ? '' : 'border-t border-border-subtle'}`}
    >
      <Animated.View
        style={pulseStyle}
        className="h-9 w-9 rounded-tile bg-surface-2"
      />
      <View className="flex-1 gap-1.5">
        <Animated.View
          style={pulseStyle}
          className="h-3 w-40 rounded bg-surface-2"
        />
        <Animated.View
          style={pulseStyle}
          className="h-2.5 w-24 rounded bg-surface-2"
        />
      </View>
      <Animated.View
        style={pulseStyle}
        className="h-3.5 w-16 rounded bg-surface-2"
      />
    </View>
  );
}
