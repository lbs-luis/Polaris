import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { cn } from '@/libs/utils';
import { useMemo, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface EditProfileNameFormProps {
  initial: string;
  onSave: (next: string) => Promise<void>;
  onClose: () => void;
}

/** Drawer body for editing the user's display name. */
export function EditProfileNameForm({
  initial,
  onSave,
  onClose,
}: EditProfileNameFormProps) {
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(initial);
  const [isSaving, setIsSaving] = useState(false);

  const isDisabled = name.trim().length < 1 || isSaving;

  async function handleSave() {
    if (isDisabled) return;
    setIsSaving(true);
    await onSave(name.trim());
    setIsSaving(false);
    Keyboard.dismiss();
    onClose();
  }

  const paddingBottom = useMemo(
    () => keyboardHeight + 16 + insets.bottom,
    [keyboardHeight, insets.bottom]
  );

  return (
    <View className="px-6 pt-2" style={{ paddingBottom }}>
      <Input
        label="Nome"
        value={name}
        onChangeText={setName}
        editable={!isSaving}
        autoFocus
        placeholder="Seu nome"
        className={cn(isSaving && 'opacity-50')}
      />
      <Button
        className="mt-6"
        onPress={handleSave}
        disabled={isDisabled}
        text={isSaving ? 'Salvando...' : 'Salvar'}
      />
    </View>
  );
}
