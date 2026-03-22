export const steps = ['user', 'category', 'income', 'outcome'] as const;
export type ISteps = (typeof steps)[number];
