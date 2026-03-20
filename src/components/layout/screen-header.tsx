import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export function ScreenHeader({
  back,
  navigation,
  options,
  route,
}: NativeStackHeaderProps) {
  const steps = ['user-step', 'category-step', 'income-outcome-step'];
  const current = steps.indexOf(route.name);
  const hasNextStep = current < steps.length - 1;
  function handleNavigateBack() {
    if (back) {
      navigation.goBack();
    }
  }
  function handleNavigateFoward() {
    if (hasNextStep) {
      navigation.navigate(steps[current + 1]);
    }
  }

  return (
    <View className="flex w-full flex-row items-center gap-4 bg-background px-8 py-6">
      <TouchableOpacity onPress={handleNavigateBack}>
        <ArrowLeft className="text-white" color="#ffffff" size={18} />
      </TouchableOpacity>
      <Text className="text-xl font-semibold text-white">{`Onboarding | ${options.title}`}</Text>
      {hasNextStep && (
        <TouchableOpacity className="ml-auto" onPress={handleNavigateFoward}>
          <ArrowRight className="text-white" color="#ffffff" size={18} />
        </TouchableOpacity>
      )}
    </View>
  );
}
