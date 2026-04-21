import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { View } from 'react-native';

interface SelectProps {
  options: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
  placeholder?: string;
}

export function Select({
  options,
  disabled,
  placeholder = 'Selecione...',
}: SelectProps) {
  const [selecionado, setSelecionado] = useState<string | undefined>(undefined);

  return (
    <View
      style={{ opacity: disabled ? 0.5 : 1 }}
      className="w-full overflow-hidden rounded-lg bg-input-primary"
    >
      <View style={{ paddingHorizontal: 8 }}>
        <Picker
          selectedValue={selecionado}
          onValueChange={(valor) => setSelecionado(valor)}
          enabled={!disabled}
          style={{
            color: selecionado ? '#ffffff' : '#626262',
            height: 50,
          }}
          dropdownIconColor="#ffffff"
        >
          <Picker.Item
            label={placeholder}
            value={undefined}
            color="#626262"
            style={{ fontSize: 16 }}
          />
          {options.map((option, i) => (
            <Picker.Item
              key={i}
              label={option.label}
              value={option.value}
              color="#626262"
              style={{ fontSize: 16 }}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}
