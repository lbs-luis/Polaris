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
      <Text className="text-5xl font-extrabold text-text-accent">{title}</Text>
      <Text className="text-lg font-medium text-text-secondary">
        {description}
      </Text>
    </View>
  );
}
