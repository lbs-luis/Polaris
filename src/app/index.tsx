import { useSettingsTable } from '@/database/tables/settings.table';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootPage() {
  const { select } = useSettingsTable();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    select('onboarding_complete').then((setting) => {
      setOnboardingComplete(setting?.sValue === 'true');
    });
  }, [select]);

  if (onboardingComplete === null) {
    return null;
  }

  if (onboardingComplete) {
    return <Redirect href={'/home'} />;
  }

  return <Redirect href={'/onboarding'} />;
}
