import { useRecurrentsTable } from '@/database/tables/recurrents.table';
import { useSettingsTable } from '@/database/tables/settings.table';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import { useEffect } from 'react';

const SETTING_KEY = 'last_recurrents_check';

/**
 * Runs the recurrents → transactions reconciliation at most once per calendar
 * day. The "did we run today" gate lives in the `settings` table as a
 * YYYY-MM-DD date string — that way the boolean naturally resets when the day
 * changes without needing a midnight hook or background task.
 *
 * Rules per recurrent (only those with `concluded = 0`):
 *   - if today's day-of-month is before `due_day` → skip (not due yet)
 *   - if a transaction already exists for the recurrent in this month → skip
 *   - otherwise insert a new transaction with the recurrent's base value
 *     using today's month/year and the recurrent's due_day.
 */
export function useRecurrentsReconciler() {
  const { select: selectSetting, set: setSetting } = useSettingsTable();
  const { list: listRecurrents } = useRecurrentsTable();
  const { selectByMonth, set: setTransaction } = useTransactionsTable();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const today = new Date();
      const todayKey = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const last = await selectSetting(SETTING_KEY);
      if (cancelled) return;
      if (last?.sValue === todayKey) return;

      const recurrents = await listRecurrents();
      if (cancelled) return;

      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const day = today.getDate();

      for (const r of recurrents) {
        if (cancelled) return;
        if (r.concluded) continue;
        if (day < r.due_day) continue;
        const exists = await selectByMonth(r.id, month, year);
        if (cancelled) return;
        if (exists) continue;
        await setTransaction({
          recurrent_id: r.id,
          value: r.base_value,
          month,
          year,
          due_day: r.due_day,
          category_id: r.category_id,
        });
      }

      if (cancelled) return;
      await setSetting({ sKey: SETTING_KEY, sValue: todayKey });
    })();

    return () => {
      cancelled = true;
    };
  }, [
    selectSetting,
    setSetting,
    listRecurrents,
    selectByMonth,
    setTransaction,
  ]);
}
