import { Text, View } from 'react-native';

export function StepHeader({
  description,
  title,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="flex w-full flex-col gap-3">
      <Text className="text-text-accent text-5xl font-extrabold">{title}</Text>
      <Text className="text-text-secondary text-lg font-medium">
        {description}
      </Text>
    </View>
  );
}
