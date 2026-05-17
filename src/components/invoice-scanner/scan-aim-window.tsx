import { View } from 'react-native';

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
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: '45%',
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
    </View>
  );
}
