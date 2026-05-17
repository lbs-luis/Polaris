import { Card } from '@/components/ui/card';
import { CatIcon, isCatKind } from '@/components/ui/cat-icon';
import { Money } from '@/components/ui/money';
import { SwipeableRow } from '@/components/ui/swipeable-row';
import { IRecurrentsTRow } from '@/database/tables/recurrents.table';
import { rowRadiusClass } from '@/libs/list-radius';
import { Text, View } from 'react-native';

interface DayEntriesListProps {
  entries: IRecurrentsTRow[];
  type: 'income' | 'outcome';
  onEdit: (item: IRecurrentsTRow) => void;
  onDelete: (id: number) => Promise<void>;
}

function EntryAvatar({ entry }: { entry: IRecurrentsTRow }) {
  if (isCatKind(entry.category_icon)) {
    return <CatIcon kind={entry.category_icon} size={40} />;
  }
  return (
    <View className="h-10 w-10 items-center justify-center rounded-tile border border-border-subtle bg-surface-2">
      <Text
        className="text-sm text-text"
        style={{ fontFamily: 'JetBrainsMono_500Medium' }}
      >
        {entry.due_day}
      </Text>
    </View>
  );
}

export function DayEntriesList({
  entries,
  type,
  onEdit,
  onDelete,
}: DayEntriesListProps) {
  const accent = type === 'income' ? 'text-income' : 'text-outcome';

  if (entries.length === 0) {
    return (
      <Card className="mt-2.5 p-5">
        <Text
          className="text-center text-sm text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          Nenhuma recorrência registrada.
        </Text>
      </Card>
    );
  }

  return (
    <Card className="mt-2.5 p-0">
      {entries.map((e, i) => (
        <SwipeableRow
          key={e.id}
          index={i}
          total={entries.length}
          onEdit={() => onEdit(e)}
          onDelete={() => onDelete(e.id)}
        >
          <View
            className={`flex-row items-center gap-3 bg-surface px-3 py-3 ${rowRadiusClass(i, entries.length)} ${i === 0 ? '' : 'border-t border-border-subtle'}`}
          >
            <EntryAvatar entry={e} />
            <View className="flex-1">
              <Text
                className="text-sm text-text"
                style={{ fontFamily: 'Sora_700Bold' }}
              >
                {e.category_name}
              </Text>
              <Text
                className="mt-0.5 text-xs text-text-dim"
                style={{ fontFamily: 'Sora_400Regular' }}
              >
                Recorrente · todo dia {e.due_day}
              </Text>
            </View>
            <Money value={e.base_value / 100} className={accent} bold />
          </View>
        </SwipeableRow>
      ))}
    </Card>
  );
}
