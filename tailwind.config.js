/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // True-black canvas; cards are tone-lifted (One UI elevation-by-tone,
        // no borders) so they read on black without hairlines.
        bg: '#000000',
        surface: {
          DEFAULT: '#161618', // cards / list groups
          2: '#212124', // inner chips, inputs, nested blocks
          3: '#2E2E33', // tracks, pressed
        },
        border: {
          DEFAULT: '#34343A',
          subtle: '#242428', // hairline dividers only (inside groups)
        },
        text: {
          DEFAULT: '#FFFFFF',
          dim: '#9C9CA6',
          mute: '#62626B',
          inverse: '#000000',
        },
        brand: {
          DEFAULT: '#FFFFFF', // WHITE is the primary
          dark: '#E8E8EC', // pressed/hover
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
        card: '26px',
        sheet: '30px',
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
