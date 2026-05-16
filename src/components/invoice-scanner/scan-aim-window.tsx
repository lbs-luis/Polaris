import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AIM = 220;
const BRACKET = 26;

function Bracket({
  top,
  right,
  bottom,
  left,
  rotate,
}: {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  rotate: number;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        top,
        right,
        bottom,
        left,
        width: BRACKET,
        height: BRACKET,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderColor: '#FFFFFF',
        borderTopLeftRadius: 6,
        transform: [{ rotate: `${rotate}deg` }],
        shadowColor: '#FFFFFF',
        shadowOpacity: 0.4,
        shadowRadius: 12,
      }}
    />
  );
}

export function ScanAimWindow() {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(AIM - 14, {
        duration: 2400,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [offset]);

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: AIM,
        height: AIM,
        marginLeft: -AIM / 2,
        marginTop: -AIM / 2,
      }}
    >
      <Bracket top={0} left={0} rotate={0} />
      <Bracket top={0} right={0} rotate={90} />
      <Bracket bottom={0} left={0} rotate={-90} />
      <Bracket bottom={0} right={0} rotate={180} />

      <View style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 12,
              right: 12,
              height: 2,
              backgroundColor: '#FFFFFF',
              shadowColor: '#FFFFFF',
              shadowOpacity: 0.9,
              shadowRadius: 14,
            },
            lineStyle,
          ]}
        />
      </View>
    </View>
  );
}
