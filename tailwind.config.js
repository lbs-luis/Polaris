/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0F131C',
        'primary-foreground': '#3D5AFE',
        secondary: '#31353F',
        'secondary-foreground': '#BBC3FF',
      },
      transitionProperty: {
        width: 'width',
        margin: 'margin',
      },
    },
  },
  plugins: [],
};
