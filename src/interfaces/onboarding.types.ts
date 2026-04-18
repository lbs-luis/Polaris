const stepskeys = ['user', 'category', 'income', 'outcome'] as const;
const stepsTitles: Record<ISteps, string> = {
  user: 'Perfil',
  category: 'Categoria',
  income: 'Entrada',
  outcome: 'Saída',
};

export type ISteps = (typeof stepskeys)[number];
export const steps = { keys: stepskeys, titles: stepsTitles };

export interface IRenderStepProps {
  currentStep: ISteps;
  onNextStep: () => void;
}
