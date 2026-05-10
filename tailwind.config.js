/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: '#1d1d20',
          secondary: '#18181b',
        },
        button: {
          primary: '#ffffff',
          disabled: '#29292c',
        },
        input: {
          primary: '#1f1f22',
        },
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

        income: '#34d399',
        outcome: '#f87171',
        warning: '#ef9f27',

        accent: {
          blue: {
            text: '#60a5fa',
            surface: 'rgba(59,130,246,0.12)',
            border: 'rgba(59,130,246,0.25)',
          },
          indigo: {
            text: '#6366f1',
            surface: 'rgba(99,102,241,0.1)',
            border: 'rgba(99,102,241,0.25)',
          },

          muted: '#60a5fa',
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
