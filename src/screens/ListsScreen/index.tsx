import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, CheckSquare, ShoppingCart } from 'lucide-react-native';
import AppLayout from '../../layouts/AppLayout';

export default function ListsScreen() {
  return (
    <AppLayout>
      <View className="flex-1">
        <ScrollView className="flex-1 p-6">
          <Text className="text-2xl font-bold text-slate-900">
            Minhas Listas
          </Text>

          <View className="mt-6 space-y-4">
            {/* Tipo de listas */}
            <View className="flex-row gap-4">
              <TouchableOpacity className="flex-1 items-center rounded-lg bg-white p-6 shadow-sm">
                <CheckSquare color="#3b82f6" size={32} />
                <Text className="mt-2 font-semibold text-slate-900">
                  Tarefas
                </Text>
                <Text className="text-sm text-slate-500">0 listas</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-1 items-center rounded-lg bg-white p-6 shadow-sm">
                <ShoppingCart color="#10b981" size={32} />
                <Text className="mt-2 font-semibold text-slate-900">
                  Compras
                </Text>
                <Text className="text-sm text-slate-500">0 listas</Text>
              </TouchableOpacity>
            </View>

            {/* Estado vazio */}
            <View className="mt-8 items-center justify-center rounded-lg bg-white p-12">
              <Text className="text-center text-lg text-slate-500">
                Nenhuma lista criada ainda
              </Text>
              <Text className="mt-2 text-center text-sm text-slate-400">
                Toque no botão + para começar
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
