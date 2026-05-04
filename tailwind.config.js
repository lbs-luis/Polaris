/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: 'rgba(255,255,255,0.05)', // cards, shells
        },
        button: {
          primary: '#ffffff',
          disabled: '#29292c',
        },
        input: {
          primary: '#1f1f22',
        },

        // usar com bg-opacity no RN
        glass: {
          light: 'rgba(255,255,255,0.06)', // inputs, back button
          card: 'rgba(255,255,255,0.05)', // calendário, cards
          row: 'rgba(255,255,255,0.04)', // transaction rows, log rows
        },

        border: {
          default: 'rgba(255,255,255,0.12)', // cards, inputs, chips
        },

        text: {
          primary: '#ffffff', // títulos, valores
          'primary-muted': '#0a0a0c',
          secondary: 'rgba(255,255,255,0.35)', // subtítulos, labels
          placeholder: 'rgba(255,255,255,0.25)', // placeholders, hints
          tertiary: 'rgba(255,255,255,0.30)', // section labels, datas
        },

        income: '#34d399', // entradas, valores positivos
        outcome: '#f87171', // saídas, valores negativos
        warning: '#ef9f27', // banner vencimento, alertas

        accent: {
          blue: '#3777e0', // CTA, avatar badge, chip add
          indigo: '#6366f1', // par do blue no gradiente CTA
          muted: '#60a5fa', // texto do chip add, ícones leves
        },

        glow: {
          blue: '#3b82f6', // bg-glow-blue/[0.18]
          purple: '#8b5cf6', // bg-glow-purple/[0.15]
          green: '#10b981', // bg-glow-green/[0.15]
          orange: '#f97316', // bg-glow-orange/[0.12]
        },

        app: {
          bg: '#111114',
        },
      },
      transitionProperty: {
        width: 'width',
        margin: 'margin',
      },
    },
  },
  plugins: [],
};
