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

  backgroundColor: '#000000',

  android: {
    package: namespace,
    adaptiveIcon: {
      foregroundImage: './assets/android/icon.png',
    },
  },

  ios: {
    bundleIdentifier: namespace,
  },

  plugins: [
    'expo-router',
    'expo-sqlite',
    [
      'expo-image-picker',
      {
        photosPermission:
          'Polaris utiliza apenas sua foto de perfil, ela não é processada nem armazenada, sua foto permanece no seu dispositivo.',
        colors: {
          cropToolbarColor: '#000000',
        },
        dark: {
          colors: {
            cropToolbarColor: '#000000',
          },
        },
      },
    ],
    [
      'expo-file-system',
      {
        supportsOpeningDocumentsInPlace: true,
        enableFileSharing: true,
      },
    ],
  ],
  ...config,
});
