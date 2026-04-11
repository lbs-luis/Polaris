/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#0F131C',
          'bg-foreground': '#3D5AFE',
          text: '#DFE2EF',
        },
        secondary: {
          bg: '#262a34',
          'bg-foreground': '#1c1f29',
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
