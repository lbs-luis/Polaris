import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import AppLayout from '../../layouts/AppLayout';

export default function FinanceScreen() {
  return (
    <AppLayout>
      <View className="flex-1">
        <ScrollView className="flex-1 p-6">
          <Text className="text-2xl font-bold text-slate-900">
            Gestão Financeira
          </Text>

          <View className="mt-6 space-y-4">
            {/* Saldo atual */}
            <View className="rounded-lg bg-blue-600 p-6">
              <Text className="text-sm text-blue-100">Saldo Atual</Text>
              <Text className="mt-2 text-3xl font-bold text-white">
                R$ 0,00
              </Text>
            </View>

            {/* Resumo do mês */}
            <View className="rounded-lg bg-white p-6 shadow-sm">
              <Text className="text-lg font-semibold text-slate-900">
                Este Mês
              </Text>
              <View className="mt-4 space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-slate-600">Receitas</Text>
                  <Text className="font-semibold text-green-600">R$ 0,00</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-600">Despesas</Text>
                  <Text className="font-semibold text-red-600">R$ 0,00</Text>
                </View>
                <View className="border-t border-slate-200 pt-3">
                  <View className="flex-row justify-between">
                    <Text className="font-semibold text-slate-900">Saldo</Text>
                    <Text className="font-bold text-slate-900">R$ 0,00</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Lista de transações */}
            <View className="rounded-lg bg-white p-6 shadow-sm">
              <Text className="text-lg font-semibold text-slate-900">
                Transações Recentes
              </Text>
              <Text className="mt-4 text-center text-slate-500">
                Nenhuma transação registrada
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botão flutuante */}
        <TouchableOpacity className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg">
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>
    </AppLayout>
  );
}
