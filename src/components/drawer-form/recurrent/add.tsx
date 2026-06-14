import { DayPickerModal } from '@/components/recurrence/day-picker-modal';
import { Button } from '@/components/ui/button';
import { CategorySelect } from '@/components/ui/category/select.category';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ICategoriesTRow } from '@/database/tables/categories.table';
import {
  IRecurrentsTRow,
  useRecurrentsTable,
} from '@/database/tables/recurrents.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { formatCurrency, parseCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { CalendarDotsIcon } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PARCEL_OPTIONS: { v: number | null; label: string }[] = [
  { v: null, label: 'Não' },
  { v: 3, label: '3×' },
  { v: 6, label: '6×' },
  { v: 10, label: '10×' },
  { v: 12, label: '12×' },
  { v: 18, label: '18×' },
  { v: 24, label: '24×' },
];

interface AddRecurrentFormProps {
  type: 'income' | 'outcome';
  categories: ICategoriesTRow[];
  /** All recurrents of the same type — used by the day-picker calendar to
   *  show which days already have entries. */
  registries: IRecurrentsTRow[];
  recurrent?: IRecurrentsTRow;
  /**
   * Called after the recurrent row has been saved. Receives the new/edited
   * row's `due_day`, whether the record is brand new, and the saved row's
   * id (newly minted when `isNew`, otherwise the existing one). The caller
   * uses this to surface the same-day "Lançar agora?" prompt or just close
   * the drawer.
   */
  onSaved: (info: {
    day: number;
    isNew: boolean;
    recurrentId: number;
    value: number;
    categoryId: number;
  }) => void;
}

/**
 * Drawer body used by the /recurrence route to create or edit a recurrent.
 * Unlike the onboarding flow (calendar → form), this form owns the day
 * selection internally — the user fills value + category + day all in one
 * place, with the day picker opening as a full-screen modal on demand.
 */
export function AddRecurrentForm({
  type,
  categories,
  registries,
  recurrent,
  onSaved,
}: AddRecurrentFormProps) {
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();
  const { set, update } = useRecurrentsTable();

  const initialCategory = recurrent
    ? categories.find((c) => c.id === recurrent.category_id)
    : undefined;

  const [day, setDay] = useState<number | null>(recurrent?.due_day ?? null);
  const [description, setDescription] = useState(recurrent?.description ?? '');
  const [baseValue, setBaseValue] = useState(
    recurrent ? formatCurrency(recurrent.base_value.toString()) : ''
  );
  const [selectedCategory, setSelectedCategory] = useState<
    ICategoriesTRow | undefined
  >(initialCategory);
  const [installments, setInstallments] = useState<number | null>(
    recurrent?.installments_total ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isDisabled = !day || !selectedCategory || !baseValue.trim() || isSaving;

  async function handleSave() {
    if (isDisabled || !day || !selectedCategory) return;
    Keyboard.dismiss();
    setIsSaving(true);

    const valueCents = Math.round(parseCurrency(baseValue) * 100);
    const payload = {
      base_value: valueCents,
      category_id: selectedCategory.id,
      due_day: day,
      description: description.trim() || null,
      type,
      concluded: recurrent?.concluded ?? 0,
      installments_total: installments,
      first_fire_month: recurrent?.first_fire_month ?? null,
    };

    let recurrentId: number;
    if (recurrent) {
      await update(recurrent.id, payload);
      recurrentId = recurrent.id;
    } else {
      recurrentId = await set(payload);
    }

    setIsSaving(false);
    onSaved({
      day,
      isNew: !recurrent,
      recurrentId,
      value: valueCents,
      categoryId: selectedCategory.id,
    });
  }

  const previewCents = Math.round(parseCurrency(baseValue) * 100);
  const installmentSummary =
    installments !== null && previewCents > 0
      ? `${installments}× de ${formatCurrency(previewCents.toString())} · total ${formatCurrency(
          (previewCents * installments).toString()
        )} · conclui em ${installments} ${installments === 1 ? 'mês' : 'meses'}`
      : null;

  const paddingBottom = useMemo(
    () => keyboardHeight + 16 + insets.bottom,
    [keyboardHeight, insets.bottom]
  );

  const accentBorder = type === 'income' ? 'border-income' : 'border-outcome';

  return (
    <View className="px-6 pt-2" style={{ paddingBottom }}>
      <Label label="Valor" uppercase={false} />
      <View
        className={cn(
          'mt-2 flex-row items-center rounded-tile border-[1.5px] bg-surface-2 px-4 py-3',
          accentBorder,
          isSaving && 'opacity-50'
        )}
      >
        <TextInput
          value={baseValue}
          onChangeText={(text) => setBaseValue(formatCurrency(text))}
          editable={!isSaving}
          placeholder="R$ 0,00"
          placeholderTextColor="#5E5E66"
          keyboardType="numeric"
          style={{
            flex: 1,
            fontFamily: 'JetBrainsMono_700Bold',
            fontSize: 26,
            color: '#FFFFFF',
            letterSpacing: -0.5,
            paddingVertical: 4,
          }}
        />
      </View>

      <View className="mt-5">
        <Input
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          editable={!isSaving}
          placeholder="Ex.: Aluguel, Salário, Spotify…"
          className={cn(isSaving && 'opacity-50')}
        />
      </View>

      <View className="mt-5">
        <Label label="Categoria" uppercase={false} />
        <View className="mt-2">
          <CategorySelect
            list={categories}
            onSelect={setSelectedCategory}
            selected={selectedCategory}
          />
        </View>
      </View>

      <View className="mt-5">
        <Label label="Dia do mês" uppercase={false} />
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            setPickerOpen(true);
          }}
          disabled={isSaving}
          className={cn(
            'mt-2 h-14 flex-row items-center justify-between rounded-tile border border-border bg-surface-2 px-4',
            isSaving && 'opacity-50'
          )}
        >
          <Text
            className={cn('text-base', day ? 'text-text' : 'text-text-dim')}
            style={{ fontFamily: 'Sora_600SemiBold' }}
          >
            {day ? `Todo dia ${day}` : 'Selecione um dia'}
          </Text>
          <CalendarDotsIcon size={20} color="#9A9AA2" weight="bold" />
        </Pressable>
      </View>

      <View className="mt-5">
        <Label label="Parcelado?" uppercase={false} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingVertical: 8 }}
        >
          {PARCEL_OPTIONS.map((o) => {
            const active = installments === o.v;
            return (
              <Pressable
                key={String(o.v ?? 'none')}
                onPress={() => setInstallments(o.v)}
                className={cn(
                  'h-10 items-center justify-center rounded-full px-4',
                  active
                    ? 'bg-brand'
                    : 'border border-border-subtle bg-surface-2'
                )}
              >
                <Text
                  className={cn('text-xs', active ? 'text-bg' : 'text-text')}
                  style={{ fontFamily: 'Sora_700Bold' }}
                >
                  {o.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {installmentSummary ? (
          <View className="mt-1 rounded-tile border border-border-subtle bg-surface px-3.5 py-2.5">
            <Text
              className="text-xs text-text-dim"
              style={{ fontFamily: 'Sora_400Regular' }}
            >
              {installmentSummary}
            </Text>
          </View>
        ) : null}
      </View>

      <Button
        text={recurrent ? 'Atualizar' : 'Salvar'}
        disabled={isDisabled}
        onPress={handleSave}
        className={cn('mt-6', isDisabled && 'opacity-50')}
      />

      <DayPickerModal
        visible={pickerOpen}
        type={type}
        registries={registries}
        initial={day ?? undefined}
        onSelectDay={(picked) => {
          setDay(picked);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
