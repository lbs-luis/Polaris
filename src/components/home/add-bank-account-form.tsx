import { Button } from '@/components/ui/button';
import { GhostButton } from '@/components/ui/ghost-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IBankAccountTRow } from '@/database/tables/bank-accounts.table';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { formatCurrency, parseCurrency } from '@/libs/masks';
import { cn } from '@/libs/utils';
import { TrashIcon } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLOR_PALETTE = [
  '#8A05BE', // Nubank purple
  '#EC7000', // Itaú orange
  '#1E5BFF', // Caixa/Inter blue
  '#3B3B3B', // C6 gray
  '#FFFFFF', // generic white
  '#000000', // generic black
];

interface AddBankAccountFormProps {
  onSaved: () => Promise<void>;
  onAdd: (payload: {
    name: string;
    amount: number;
    color: string;
  }) => Promise<void>;
  onUpdate: (
    id: number,
    payload: { name: string; amount: number; color: string }
  ) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  account?: IBankAccountTRow;
}

export function AddBankAccountForm({
  onSaved,
  onAdd,
  onUpdate,
  onRemove,
  account,
}: AddBankAccountFormProps) {
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(account?.name ?? '');
  const [amount, setAmount] = useState(
    account ? formatCurrency(account.amount.toString()) : ''
  );
  const [color, setColor] = useState<string | null>(account?.color ?? null);
  const [isSaving, setIsSaving] = useState(false);

  const isDisabled =
    name.trim().length < 1 || !amount.trim() || !color || isSaving;

  async function handleSave() {
    if (isDisabled || !color) return;
    setIsSaving(true);
    const payload = {
      name: name.trim(),
      amount: Math.round(parseCurrency(amount) * 100),
      color,
    };
    if (account) {
      await onUpdate(account.id, payload);
    } else {
      await onAdd(payload);
    }
    setIsSaving(false);
    Keyboard.dismiss();
    await onSaved();
  }

  async function handleDelete() {
    if (!account) return;
    setIsSaving(true);
    await onRemove(account.id);
    setIsSaving(false);
    await onSaved();
  }

  const paddingBottom = useMemo(
    () => keyboardHeight + 16 + insets.bottom,
    [keyboardHeight, insets.bottom]
  );

  return (
    <View className="px-6 pt-2" style={{ paddingBottom }}>
      <View>
        <Input
          label="Nome do banco"
          value={name}
          onChangeText={setName}
          editable={!isSaving}
          placeholder="Ex.: Nubank, Itaú..."
          className={cn(isSaving && 'opacity-50')}
        />
      </View>

      <View className="mt-5">
        <Input
          label="Saldo"
          value={amount}
          onChangeText={(text) => setAmount(formatCurrency(text))}
          editable={!isSaving}
          placeholder="R$ 0,00"
          keyboardType="numeric"
          className={cn(isSaving && 'opacity-50')}
        />
      </View>

      <View className="mt-5">
        <Label label="Cor" uppercase={false} />
        <View className="mt-2 flex-row items-center gap-3">
          {COLOR_PALETTE.map((c) => {
            const selected = color === c;
            const needsInnerRing = c === '#FFFFFF' || c === '#000000';
            return (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                className={cn(
                  'h-9 w-9 items-center justify-center rounded-full border-[1.5px]',
                  selected ? 'border-brand' : 'border-transparent'
                )}
              >
                <View
                  className={cn(
                    'h-7 w-7 rounded-full',
                    needsInnerRing && 'border border-border-subtle'
                  )}
                  style={{ backgroundColor: c }}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      <Button
        text={account ? 'Atualizar' : 'Adicionar'}
        disabled={isDisabled}
        onPress={handleSave}
        className={cn('mt-6', isDisabled && 'opacity-50')}
      />

      {account && (
        <GhostButton
          onPress={handleDelete}
          disabled={isSaving}
          className="mt-3 border-[#3A1F24]"
        >
          <TrashIcon size={16} color="#FF4D4D" weight="bold" />
          <Text
            className="text-base text-outcome"
            style={{ fontFamily: 'Sora_600SemiBold' }}
          >
            Excluir conta
          </Text>
        </GhostButton>
      )}
    </View>
  );
}
