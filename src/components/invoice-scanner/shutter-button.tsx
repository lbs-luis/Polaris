import { Pressable, View } from 'react-native';

interface ShutterButtonProps {
  onPress?: () => void;
}

export function ShutterButton({ onPress }: ShutterButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 80,
          height: 80,
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderWidth: 3,
          borderColor: 'rgba(255,255,255,0.7)',
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#FFFFFF',
            shadowColor: '#FFFFFF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 24,
            elevation: 12,
          }}
        />
      </View>
    </Pressable>
  );
}
