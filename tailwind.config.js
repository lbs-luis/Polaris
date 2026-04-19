/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        text: {
          primary: '#FFFFFF',
          secondary: '#BABABA',
          accent: '#D6E3FF',
        },
        surface: {
          primary: '#131313',
          secondary: '#1c1b1b',
          tertiary: '#353534',
        },
        input: {
          primary: '#0E0E0E',
        },
        app: {
          bg: '#131313',
          accent: '#a9c7ff',
          'accent-muted': '#0A305F',
        },

        primary: {
          bg: '#0F131C',
          'bg-foreground': '#3D5AFE',
          text: '#DFE2EF',
        },
        secondary: {
          bg: '#262a34',
          'bg-foreground': '#0a0e17',
          text: '#8E8FA2',
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
