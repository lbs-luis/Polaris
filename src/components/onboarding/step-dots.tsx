import { View } from 'react-native';

interface StepDotsProps {
  step: number;
  total?: number;
}

export function StepDots({ step, total = 4 }: StepDotsProps) {
  return (
    <View className="flex-row items-center justify-end gap-1.5 px-6 pt-1">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === step;
        return (
          <View
            key={i}
            style={{
              width: isCurrent ? 22 : 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: isCurrent ? '#FFFFFF' : '#5E5E66',
            }}
          />
        );
      })}
    </View>
  );
}
