import { Button } from '@/components/ui/button';
import { CategorySelect } from '@/components/ui/category/select.category';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ICategoriesTRow,
  useCategoriesTable,
} from '@/database/tables/categories.table';
import { ITransactionsTRow } from '@/database/tables/transactions.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { formatInvoiceDateTime, formatRelativeDate } from '@/libs/dates';
import { formatCurrency, parseCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { useEffect, useMemo, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface EditTransactionFormProps {
  transaction: ITransactionsTRow;
  onSaved: () => Promise<void> | void;
  onUpdate: (
    id: number,
    partial: {
      value?: number;
      description?: string | null;
      category_id?: number;
    }
  ) => Promise<void>;
}

/**
 * Bottom-sheet form for editing a transaction. Editability depends on the
 * row's source:
 *   - invoice-linked → value + date are readonly (the invoice is authoritative);
 *     only category and description can change.
 *   - recurrent-linked or manual → value, description, and category all editable.
 * The date is never edited from this form — manual date editing would risk
 * corrupting the recurrent reconciler's "did this month already get a row"
 * check, and invoice dates come from SEFAZ.
 */
export function EditTransactionForm({
  transaction,
  onSaved,
  onUpdate,
}: EditTransactionFormProps) {
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();
  const { list: listCategories } = useCategoriesTable();

  const isInvoice = transaction.invoice_id !== null;
  const valueLocked = isInvoice;

  const [categories, setCategories] = useState<ICategoriesTRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    ICategoriesTRow | undefined
  >();
  const [amount, setAmount] = useState(
    formatCurrency(Math.abs(transaction.value).toString())
  );
  const [description, setDescription] = useState(transaction.description ?? '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    listCategories().then((rows) => {
      if (!mounted) return;
      setCategories(rows);
      setSelectedCategory(
        rows.find((c) => c.id === transaction.category_id) ?? undefined
      );
    });
    return () => {
      mounted = false;
    };
  }, [listCategories, transaction.category_id]);

  const dateLabel = transaction.issued_at
    ? formatInvoiceDateTime(transaction.issued_at)
    : transaction.due_day
      ? formatRelativeDate(
          transaction.due_day,
          transaction.month,
          transaction.year
        )
      : `${transaction.month}/${transaction.year}`;

  const isDisabled =
    isSaving ||
    !selectedCategory ||
    (!valueLocked && parseCurrency(amount) <= 0);

  async function handleSave() {
    if (isDisabled || !selectedCategory) return;
    setIsSaving(true);
    const partial: {
      value?: number;
      description?: string | null;
      category_id?: number;
    } = {
      category_id: selectedCategory.id,
      description: description.trim() || null,
    };
    if (!valueLocked) {
      partial.value = Math.round(parseCurrency(amount) * 100);
    }
    await onUpdate(transaction.id, partial);
    setIsSaving(false);
    Keyboard.dismiss();
    await onSaved();
  }

  const paddingBottom = useMemo(
    () => keyboardHeight + 16 + insets.bottom,
    [keyboardHeight, insets.bottom]
  );

  return (
    <View className="px-6 pt-2" style={{ paddingBottom }}>
      <View>
        <Label label="Data" uppercase={false} />
        <View className="mt-2 h-12 justify-center rounded-tile border border-border-subtle bg-surface px-4">
          <Text
            className="text-sm text-text-dim"
            style={{ fontFamily: 'Sora_600SemiBold' }}
          >
            {dateLabel}
          </Text>
        </View>
      </View>

      <View className="mt-5">
        <Input
          label="Valor"
          value={amount}
          onChangeText={(text) => setAmount(formatCurrency(text))}
          editable={!isSaving && !valueLocked}
          placeholder="R$ 0,00"
          keyboardType="numeric"
          className={cn((isSaving || valueLocked) && 'opacity-50')}
        />
        {valueLocked ? (
          <Text
            className="mt-1.5 text-xs text-text-mute"
            style={{ fontFamily: 'Sora_400Regular' }}
          >
            Valor importado da nota fiscal e não pode ser editado.
          </Text>
        ) : null}
      </View>

      <View className="mt-5">
        <Input
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          editable={!isSaving}
          placeholder="Opcional"
          className={cn(isSaving && 'opacity-50')}
        />
      </View>

      <View className="mt-5">
        <Label label="Categoria" uppercase={false} />
        <CategorySelect
          className="mt-2"
          list={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      <Button
        className="mt-6"
        onPress={handleSave}
        disabled={isDisabled}
        text={isSaving ? 'Salvando...' : 'Salvar'}
      />
    </View>
  );
}
