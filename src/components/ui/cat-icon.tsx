import {
  AirplaneTiltIcon,
  BookOpenIcon,
  CarIcon,
  ForkKnifeIcon,
  GameControllerIcon,
  GiftIcon,
  HeartIcon,
  HouseIcon,
  IconWeight,
  MoneyIcon,
  Icon as PhosphorIcon,
  ShoppingBagIcon,
  TelevisionIcon,
  TrendUpIcon,
} from 'phosphor-react-native';
import { View } from 'react-native';

export type CatKind =
  | 'food'
  | 'home'
  | 'trans'
  | 'shop'
  | 'health'
  | 'fun'
  | 'edu'
  | 'subs'
  | 'salary'
  | 'invest'
  | 'gift'
  | 'travel';

export const CAT_KINDS: CatKind[] = [
  'food',
  'home',
  'trans',
  'shop',
  'health',
  'fun',
  'edu',
  'subs',
  'salary',
  'invest',
  'gift',
  'travel',
];

const KIND_TO_ICON: Record<CatKind, PhosphorIcon> = {
  food: ForkKnifeIcon,
  home: HouseIcon,
  trans: CarIcon,
  shop: ShoppingBagIcon,
  health: HeartIcon,
  fun: GameControllerIcon,
  edu: BookOpenIcon,
  subs: TelevisionIcon,
  salary: MoneyIcon,
  invest: TrendUpIcon,
  gift: GiftIcon,
  travel: AirplaneTiltIcon,
};

const KIND_COLORS: Record<CatKind, { bg: string; fg: string }> = {
  food: { bg: '#1F1818', fg: '#FF8A8A' },
  home: { bg: '#161A21', fg: '#7AB4FF' },
  trans: { bg: '#181820', fg: '#9BA9FF' },
  shop: { bg: '#1F1A22', fg: '#C99AFF' },
  health: { bg: '#161E1B', fg: '#6FD8B0' },
  fun: { bg: '#221C16', fg: '#FFC07A' },
  edu: { bg: '#161E22', fg: '#7BD3F7' },
  subs: { bg: '#1A171F', fg: '#A99CFF' },
  salary: { bg: '#161E18', fg: '#7AE090' },
  invest: { bg: '#1A1A1D', fg: '#CCD2DE' },
  gift: { bg: '#221820', fg: '#FFAACB' },
  travel: { bg: '#161F22', fg: '#7AD8F7' },
};

export function isCatKind(value: string | null | undefined): value is CatKind {
  return !!value && (CAT_KINDS as string[]).includes(value);
}

interface CatIconProps {
  kind: CatKind;
  size?: number;
  weight?: IconWeight;
}

export function CatIcon({ kind, size = 40, weight = 'fill' }: CatIconProps) {
  const IconComponent = KIND_TO_ICON[kind] ?? ShoppingBagIcon;
  const { bg, fg } = KIND_COLORS[kind] ?? KIND_COLORS.shop;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.35,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconComponent size={size * 0.55} color={fg} weight={weight} />
    </View>
  );
}
