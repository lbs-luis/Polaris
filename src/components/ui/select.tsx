import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { useColorScheme, View } from 'react-native';

interface SelectProps {
  options: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: string | undefined) => void;
}

export function Select({
  options,
  disabled,
  placeholder = 'Selecione...',
  onChange,
}: SelectProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selecionado, setSelecionado] = useState<string | undefined>(undefined);

  const colors = {
    optionText: isDark ? '#ffffff' : '#000000',
    placeholder: isDark ? '#9a9a9a' : '#000000',
  };

  return (
    <View
      style={{ opacity: disabled ? 0.5 : 1 }}
      className="w-full overflow-hidden rounded-lg border border-border bg-surface-2"
    >
      <View className="px-2">
        <Picker
          selectedValue={selecionado}
          onValueChange={(valor) => {
            setSelecionado(valor);
            if (onChange) onChange(valor);
          }}
          enabled={!disabled}
          style={{
            color: selecionado ? '#ffffff' : '#626262',
            fontFamily: 'Sora_400Regular',
          }}
          dropdownIconColor="#ffffff"
        >
          <Picker.Item
            label={placeholder}
            value={undefined}
            color={colors.placeholder}
            style={{ fontSize: 14, fontFamily: 'Sora_400Regular' }}
          />
          {options.map((option, i) => (
            <Picker.Item
              key={i}
              label={option.label}
              value={option.value}
              color={colors.optionText}
              style={{ fontSize: 14, fontFamily: 'Sora_400Regular' }}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}
