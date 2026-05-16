export const steps = ['profile', 'category', 'income', 'outcome'] as const;

export type ISteps = (typeof steps)[number];

export interface IRenderStepProps {
  currentStep: ISteps;
  onNextStep: () => void;
  onPreviousStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}
