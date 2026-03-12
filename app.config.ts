import { ConfigContext, ExpoConfig } from 'expo/config';

const namespace = 'com.lbs.polaris';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'Polaris',
  slug: 'polaris',
  scheme: 'polaris',
  version: '1.0.0',

  orientation: 'portrait',
  userInterfaceStyle: 'dark',

  splash: {
    image: './assets/logo.png',
    backgroundColor: '#0A192F',
  },

  backgroundColor: '#0A192F',

  android: {
    package: namespace,
    adaptiveIcon: {
      foregroundImage: './assets/android/icon.png',
    },
  },

  ios: {
    bundleIdentifier: namespace,
  },

  plugins: ['expo-router', 'expo-sqlite'],
  ...config,
});
