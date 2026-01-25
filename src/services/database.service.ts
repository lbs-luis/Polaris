import { useDatabase } from '../database';
import { SettingRecord } from '../database/tables/settings';

export async function setUserOnboardingStatus(status: boolean): Promise<void> {
  try {
    const executeQuery = useDatabase();
    await executeQuery(
      'UPDATE settings SET value = ?, updated_at = strftime("%s", "now") WHERE key = ?',
      [status.toString(), 'onboarding_status'],
    );
    console.info('Onboarding status updated to:', status);
  } catch (error: unknown) {
    console.error('Error setting user onboarding status:', error);
  }
}

export async function getUserOnboardingStatus(): Promise<boolean> {
  try {
    const executeQuery = useDatabase();
    const result = await executeQuery(
      'SELECT value FROM settings WHERE key = ?',
      ['onboarding_status'],
    );
    const settingsRecords = result as SettingRecord[];
    const status = settingsRecords[0]?.value === 'true' || false;
    console.info('Onboarding status retrieved:', status);
    return status;
  } catch (error: unknown) {
    console.error('Error getting user onboarding status:', error);
    return false;
  }
}
