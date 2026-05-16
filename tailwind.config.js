/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: {
          DEFAULT: '#0E0E10',
          2: '#18181B',
          3: '#26262A',
        },
        border: {
          DEFAULT: '#2A2A2E',
          subtle: '#1B1B1F',
        },
        text: {
          DEFAULT: '#FFFFFF',
          dim: '#9A9AA2',
          mute: '#5E5E66',
          inverse: '#000000',
        },
        brand: {
          DEFAULT: '#FFFFFF',
          dark: '#E8E8EC',
        },
        income: '#3CC85F',
        outcome: '#FF4D4D',
        warning: '#FFB320',
        cat: {
          'food-bg': '#1F1818',
          'food-fg': '#FF8A8A',
          'home-bg': '#161A21',
          'home-fg': '#7AB4FF',
          'trans-bg': '#181820',
          'trans-fg': '#9BA9FF',
          'shop-bg': '#1F1A22',
          'shop-fg': '#C99AFF',
          'health-bg': '#161E1B',
          'health-fg': '#6FD8B0',
          'fun-bg': '#221C16',
          'fun-fg': '#FFC07A',
          'edu-bg': '#161E22',
          'edu-fg': '#7BD3F7',
          'subs-bg': '#1A171F',
          'subs-fg': '#A99CFF',
          'salary-bg': '#161E18',
          'salary-fg': '#7AE090',
          'invest-bg': '#1A1A1D',
          'invest-fg': '#CCD2DE',
        },
      },
      borderRadius: {
        card: '24px',
        sheet: '26px',
        tile: '14px',
      },
      fontFamily: {
        sora: ['Sora_400Regular'],
        'sora-semi': ['Sora_600SemiBold'],
        'sora-bold': ['Sora_700Bold'],
        mono: ['JetBrainsMono_500Medium'],
        'mono-bold': ['JetBrainsMono_700Bold'],
      },
      transitionProperty: {
        width: 'width',
        margin: 'margin',
      },
    },
  },
  plugins: [],
};
