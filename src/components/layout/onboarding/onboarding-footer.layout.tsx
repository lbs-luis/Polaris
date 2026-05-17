import { Button } from '@/components/ui/button';
import { GhostButton } from '@/components/ui/ghost-button';
import { Text, View } from 'react-native';

interface OnboardingFooterProps {
  continueText?: string;
  onContinue: () => void;
  continueDisabled?: boolean;
  onBack?: () => void;
  showBack?: boolean;
}

export function OnboardingFooter({
  continueText = 'Continuar',
  onContinue,
  continueDisabled,
  onBack,
  showBack = true,
}: OnboardingFooterProps) {
  return (
    <View className="flex-row gap-3 bg-bg px-6 pb-4 pt-3">
      {showBack && (
        <GhostButton onPress={onBack} text="Voltar" className="flex-1" />
      )}
      <Button
        onPress={onContinue}
        disabled={continueDisabled}
        className={showBack ? 'flex-[2]' : 'flex-1'}
      >
        <Text
          className="text-lg text-text-inverse"
          style={{ fontFamily: 'Sora_600SemiBold' }}
        >
          {continueText}
        </Text>
      </Button>
    </View>
  );
}
