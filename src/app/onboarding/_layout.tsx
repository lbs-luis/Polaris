import { ScreenHeader } from '@/components/layout/screen-header';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <ScreenHeader {...props} />,
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="user-step" options={{ title: 'Usuário' }} />
      <Stack.Screen name="category-step" options={{ title: 'Categoria' }} />
      <Stack.Screen
        name="income-outcome-step"
        options={{
          title: 'Receitas e Despesas',
        }}
      />
    </Stack>
  );
}
