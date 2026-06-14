import { AddBankAccountForm } from '@/components/drawer-form/bank-account/add';
import { EditProfileNameForm } from '@/components/drawer-form/profile/edit-name';
import { BottomNav } from '@/components/layout/bottom-nav';
import { NavHeader } from '@/components/layout/nav-header';
import { Avatar } from '@/components/ui/avatar';
import { IconTile } from '@/components/ui/icon-tile';
import { ListGroup, ListRow, Section } from '@/components/ui/list';
import { Money } from '@/components/ui/money';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { IBankAccountTRow } from '@/database/tables/bank-accounts.table';
import { useBankAccounts } from '@/hooks/view-models/use-bank-accounts';
import { useFloatingNavRouter } from '@/hooks/use-floating-nav-router';
import { useProfileScreen } from '@/hooks/view-models/use-profile-screen';
import { useFocusEffect } from 'expo-router';
import { PlusIcon } from 'phosphor-react-native';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';

function AccountBadge({ color, letter }: { color: string; letter: string }) {
  const fg = color.toUpperCase() === '#FFFFFF' ? '#000000' : '#FFFFFF';
  return (
    <View
      className="h-11 w-11 items-center justify-center rounded-tile"
      style={{ backgroundColor: color }}
    >
      <Text style={{ fontFamily: 'Sora_700Bold', fontSize: 16, color: fg }}>
        {letter}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { onTabPress } = useFloatingNavRouter();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const { name, avatar, updateName, pickAvatar, refreshProfile } =
    useProfileScreen();
  const {
    accounts,
    total,
    addAccount,
    updateAccount,
    removeAccount,
    refreshAccounts,
  } = useBankAccounts();

  useFocusEffect(
    useCallback(() => {
      void refreshProfile();
      void refreshAccounts();
    }, [refreshProfile, refreshAccounts])
  );

  function openEditProfileSheet() {
    openBottomSheet(
      <EditProfileNameForm
        initial={name}
        avatar={avatar}
        onSave={updateName}
        onPickAvatar={pickAvatar}
        onClose={closeBottomSheet}
      />,
      { title: 'Editar perfil' }
    );
  }

  async function handleAccountSaved() {
    closeBottomSheet();
    await refreshAccounts();
  }

  function openAddAccountSheet() {
    openBottomSheet(
      <AddBankAccountForm
        onSaved={handleAccountSaved}
        onAdd={addAccount}
        onUpdate={updateAccount}
        onRemove={removeAccount}
      />,
      { title: 'Nova conta' }
    );
  }

  function openEditAccountSheet(account: IBankAccountTRow) {
    openBottomSheet(
      <AddBankAccountForm
        account={account}
        onSaved={handleAccountSaved}
        onAdd={addAccount}
        onUpdate={updateAccount}
        onRemove={removeAccount}
      />,
      { title: 'Editar conta' }
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <NavHeader title="Perfil" />

      <ScrollView
        className="flex-1 py-2"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity */}
        <ListGroup>
          <ListRow
            left={<Avatar name={name} photo={avatar} size={56} />}
            leftInset={86}
            title={name || 'Adicionar nome'}
            sub="Editar nome e foto"
            chevron
            onPress={openEditProfileSheet}
          />
        </ListGroup>

        {/* Accounts — managed here, summed into the Início balance */}
        <Section
          className="mt-6"
          right={`Saldo ${total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`}
        >
          Contas conectadas
        </Section>
        <ListGroup>
          {accounts.map((a, i) => (
            <ListRow
              key={a.id}
              divider={i > 0}
              left={<AccountBadge color={a.color} letter={a.name[0] ?? '?'} />}
              title={a.name}
              right={
                <Money
                  value={a.amount / 100}
                  bold
                  className="text-[15px] text-text"
                />
              }
              onPress={() => openEditAccountSheet(a)}
            />
          ))}
          <ListRow
            divider={accounts.length > 0}
            left={<IconTile icon={PlusIcon} />}
            title="Adicionar conta"
            onPress={openAddAccountSheet}
          />
        </ListGroup>
      </ScrollView>

      <BottomNav active="me" onTabPress={onTabPress} />
    </View>
  );
}
