import { View, Text, ScrollView } from 'react-native';
import AppLayout from '../../layouts/AppLayout';

export default function HomeScreen() {
  return (
    <AppLayout>
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-3xl font-bold text-slate-900">
            ⭐ Bem-vindo ao Polaris
          </Text>
          <Text className="mt-2 text-base text-slate-600">
            Sua estrela guia para finanças e tarefas
          </Text>

          <View className="mt-8 space-y-4">
            {/* Card de resumo financeiro */}
            <View className="rounded-lg bg-white p-6 shadow-sm">
              <Text className="text-lg font-semibold text-slate-900">
                Resumo Financeiro
              </Text>
              <View className="mt-4 flex-row justify-between">
                <View>
                  <Text className="text-sm text-slate-500">Receitas</Text>
                  <Text className="text-2xl font-bold text-green-600">
                    R$ 0,00
                  </Text>
                </View>
                <View>
                  <Text className="text-sm text-slate-500">Despesas</Text>
                  <Text className="text-2xl font-bold text-red-600">
                    R$ 0,00
                  </Text>
                </View>
              </View>
            </View>

            {/* Card de tarefas */}
            <View className="rounded-lg bg-white p-6 shadow-sm">
              <Text className="text-lg font-semibold text-slate-900">
                Tarefas Hoje
              </Text>
              <Text className="mt-2 text-slate-600">
                Nenhuma tarefa agendada
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
}
