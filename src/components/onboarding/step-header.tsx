import { Text, View } from 'react-native';

export function StepHeader({
  description,
  title,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="mt-7 flex w-full flex-col">
      <Text
        className="text-3xl text-text-primary"
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        {title}
      </Text>
      <Text
        className="mt-2 text-lg text-text-secondary"
        style={{ fontFamily: 'Sora_400Regular' }}
      >
        {description}
      </Text>
    </View>
  );
}
