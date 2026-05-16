import { KeyboardView } from '@/components/layout/keyboard-view.layout';
import { OnboardingFooter } from '@/components/layout/onboarding/onboarding-footer.layout';
import { StepHeader } from '@/components/onboarding/step-header';
import { Input } from '@/components/ui/input';
import { useProfileStep } from '@/hooks/view-models/use-profile-step';
import { IRenderStepProps } from '@/interfaces/onboarding.types';
import { CameraIcon, UserIcon } from 'phosphor-react-native';
import { Image, TouchableOpacity, View } from 'react-native';

export default function ProfileStep({
  onNextStep,
  onPreviousStep,
  isFirstStep,
}: IRenderStepProps) {
  const { name, setName, avatar, pickAvatar, save, canContinue } =
    useProfileStep();

  async function handleNextStep() {
    await save();
    onNextStep();
  }

  return (
    <>
      <KeyboardView className="px-6 pb-4">
        <StepHeader
          title={`Vamos te\nconhecer.`}
          description="Como podemos te chamar?"
        />

        <TouchableOpacity
          onPress={pickAvatar}
          className="relative mx-auto mt-10 h-32 w-32 rounded-full"
        >
          {avatar ? (
            <Image
              className="z-10 h-32 w-32 rounded-full"
              source={{ uri: avatar }}
            />
          ) : (
            <View className="z-10 h-32 w-32 items-center justify-center rounded-full bg-brand">
              <UserIcon size={56} color="#000000" weight="regular" />
            </View>
          )}
          <View className="absolute bottom-0 right-0 z-20 h-10 w-10 items-center justify-center rounded-full border-[3px] border-bg bg-brand">
            <CameraIcon size={18} color="#000000" weight="fill" />
          </View>
        </TouchableOpacity>

        <View className="mb-6 mt-10 flex w-full flex-col gap-2">
          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            placeholder="Como quer ser chamado?"
          />
        </View>
      </KeyboardView>

      <OnboardingFooter
        onContinue={handleNextStep}
        continueDisabled={!canContinue}
        onBack={onPreviousStep}
        showBack={!isFirstStep}
      />
    </>
  );
}
