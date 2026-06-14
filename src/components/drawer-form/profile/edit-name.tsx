import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useKeyboardOffset } from '@/hooks/keyboard/use-keyboard-offset';
import { cn } from '@/libs/utils';
import { CameraIcon } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface EditProfileFormProps {
  initial: string;
  avatar: string | null;
  onSave: (next: string) => Promise<void>;
  /** Opens the OS image picker; resolves to the new saved URI (or null). */
  onPickAvatar: () => Promise<string | null>;
  onClose: () => void;
}

/** Drawer body for editing the user's photo and display name in one place. */
export function EditProfileNameForm({
  initial,
  avatar,
  onSave,
  onPickAvatar,
  onClose,
}: EditProfileFormProps) {
  const keyboardHeight = useKeyboardOffset();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(initial);
  const [preview, setPreview] = useState<string | null>(avatar);
  const [isSaving, setIsSaving] = useState(false);

  const isDisabled = name.trim().length < 1 || isSaving;

  async function handlePickAvatar() {
    const uri = await onPickAvatar();
    if (uri) setPreview(uri);
  }

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
      <View className="items-center pb-6 pt-2">
        <Pressable onPress={handlePickAvatar} className="relative">
          <Avatar name={name || initial} photo={preview} size={104} />
          <View className="absolute -bottom-0.5 -right-0.5 h-9 w-9 items-center justify-center rounded-full border-[3px] border-bg bg-brand">
            <CameraIcon size={17} color="#000000" weight="bold" />
          </View>
        </Pressable>
      </View>

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
