import {
  DateTimeValue,
  DateTimeWheel,
} from '@/components/drawer-form/transaction/datetime-wheel';
import { Button } from '@/components/ui/button';
import { CategorySelect } from '@/components/ui/category/select.category';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import { useTransactionsTable } from '@/database/tables/transactions.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { formatCurrency, parseCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'phosphor-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddTransactionFormProps {
  onSaved: () => void | Promise<void>;
}

/**
 * Drawer body for adding a manual transaction (no invoice, no recurrent).
 * Lets the user pick Saída/Entrada, value, description, category, and an
 * exact day-month-year-hour-minute — all five datetime fields default to
 * "now" so submitting without touching anything records what just happened.
 *
 * The category list is filtered by the chosen kind (Saída → outcome,
 * Entrada → income) so the picker never offers a mismatched type. If the
 * user flips the toggle and the previously-chosen category no longer
 * matches, we reset the selection so the form stays consistent.
 */
export function AddTransactionForm({ onSaved }: AddTransactionFormProps) {
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();
  const { list: listCategories } = useCategoriesTable();
  const { set: setTransaction } = useTransactionsTable();

  const now = useMemo(() => new Date(), []);
  const [kind, setKind] = useState<'income' | 'outcome'>('outcome');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<ICategoriesTRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    ICategoriesTRow | undefined
  >();
  const [dt, setDt] = useState<DateTimeValue>({
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    listCategories(kind).then((rows) => {
      if (!mounted) return;
      setCategories(rows);
      setSelectedCategory((prev) => {
        if (prev && rows.find((r) => r.id === prev.id)) return prev;
        return rows[0] ?? undefined;
      });
    });
    return () => {
      mounted = false;
    };
  }, [listCategories, kind]);

  const valueCents = Math.round(parseCurrency(amount) * 100);
  const isDisabled = isSaving || !selectedCategory || valueCents <= 0;
  const tint = kind === 'income' ? '#3CC85F' : '#FF4D4D';

  async function handleSave() {
    if (isDisabled || !selectedCategory) return;
    setIsSaving(true);
    const iso = `${dt.year.toString().padStart(4, '0')}-${String(
      dt.month + 1
    ).padStart(2, '0')}-${String(dt.day).padStart(2, '0')}T${String(
      dt.hour
    ).padStart(2, '0')}:${String(dt.minute).padStart(2, '0')}:00`;
    await setTransaction({
      value: valueCents,
      month: dt.month + 1,
      year: dt.year,
      due_day: dt.day,
      description: description.trim() || undefined,
      category_id: selectedCategory.id,
      issued_at: iso,
    });
    setIsSaving(false);
    Keyboard.dismiss();
    await onSaved();
  }

  const paddingBottom = useMemo(
    () => keyboardHeight + 16 + insets.bottom,
    [keyboardHeight, insets.bottom]
  );

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Kind toggle — Saída / Entrada */}
      <View className="flex-row gap-1 rounded-full border border-border-subtle bg-surface p-1">
        <KindButton
          label="Saída"
          icon={ArrowDownIcon}
          active={kind === 'outcome'}
          activeBg="bg-outcome"
          activeFg="text-bg"
          onPress={() => setKind('outcome')}
        />
        <KindButton
          label="Entrada"
          icon={ArrowUpIcon}
          active={kind === 'income'}
          activeBg="bg-income"
          activeFg="text-bg"
          onPress={() => setKind('income')}
        />
      </View>

      <View className="mt-5">
        <Label label="Valor" uppercase={false} />
        <View
          className={cn(
            'mt-2 flex-row items-baseline gap-2 rounded-tile border-[1.5px] bg-surface px-4 py-3.5',
            isSaving && 'opacity-50'
          )}
          style={{ borderColor: tint }}
        >
          <Text
            style={{
              fontFamily: 'JetBrainsMono_500Medium',
              fontSize: 14,
              color: tint,
            }}
          >
            R$
          </Text>
          <TextInput
            value={amount}
            onChangeText={(text) =>
              setAmount(formatCurrency(text).replace('R$', '').trim())
            }
            editable={!isSaving}
            placeholder="0,00"
            placeholderTextColor="#5E5E66"
            keyboardType="numeric"
            style={{
              flex: 1,
              fontFamily: 'JetBrainsMono_700Bold',
              fontSize: 28,
              color: '#FFFFFF',
              letterSpacing: -0.5,
              padding: 0,
            }}
          />
        </View>
      </View>

      <View className="mt-5">
        <Input
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          editable={!isSaving}
          placeholder="Ex.: Mercado, Uber, Salário…"
          className={cn(isSaving && 'opacity-50')}
        />
      </View>

      <View className="mt-5">
        <Label label="Categoria" uppercase={false} />
        <View className="mt-2">
          <CategorySelect
            list={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>
      </View>

      <View className="mt-5">
        <Label label="Data e hora" uppercase={false} />
        <DateTimeWheel value={dt} onChange={setDt} accent={tint} />
        <Text
          className="mt-2 text-center text-xs text-text-dim"
          style={{ fontFamily: 'Sora_400Regular' }}
        >
          Toque nas linhas acima ou abaixo para ajustar.
        </Text>
      </View>

      <Button
        className="mt-6"
        onPress={handleSave}
        disabled={isDisabled}
        text={isSaving ? 'Salvando...' : 'Salvar'}
      />
    </ScrollView>
  );
}

function KindButton({
  label,
  icon: Icon,
  active,
  activeBg,
  activeFg,
  onPress,
}: {
  label: string;
  icon: typeof ArrowDownIcon;
  active: boolean;
  activeBg: string;
  activeFg: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'h-10 flex-1 flex-row items-center justify-center gap-1.5 rounded-full',
        active ? activeBg : 'bg-transparent'
      )}
    >
      <Icon size={14} color={active ? '#000000' : '#9A9AA2'} weight="bold" />
      <Text
        className={cn('text-sm', active ? activeFg : 'text-text-dim')}
        style={{ fontFamily: 'Sora_700Bold' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
