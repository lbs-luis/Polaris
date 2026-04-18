import { ConfigContext, ExpoConfig } from 'expo/config';
import { version } from './package.json';

const APP_VERSION = version;
const BUILD_NUMBER = 1;

const NAMESPACE = 'com.lbs.polaris';
const APP_NAME = 'Polaris';

const IS_DEV = process.env.APP_ENV === 'development';
const IS_PREVIEW = process.env.APP_ENV === 'preview';

const getAppName = () => {
  if (IS_DEV) return `${APP_NAME} (Dev)`;
  if (IS_PREVIEW) return `${APP_NAME} (Preview)`;
  return APP_NAME;
};

const getPackageName = () => {
  if (IS_DEV) return `${NAMESPACE}.dev`;
  if (IS_PREVIEW) return `${NAMESPACE}.preview`;
  return NAMESPACE;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: getAppName(),
  slug: 'polaris',
  scheme: 'polaris',
  version: APP_VERSION,
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  backgroundColor: '#000000',

  icon: './assets/icon.png',
  splash: {
    image: './assets/logo.png',
    resizeMode: 'contain',
    backgroundColor: '#0A192F',
  },

  android: {
    package: getPackageName(),
    versionCode: BUILD_NUMBER,
    adaptiveIcon: {
      foregroundImage: './assets/android/icon.png',
      // monochromeImage: './assets/android/icon-monochrome.png',
      backgroundColor: '#0A192F',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_EXTERNAL_STORAGE',
    ],
    blockedPermissions: ['android.permission.RECORD_AUDIO'],
    allowBackup: false,
  },

  ios: {
    bundleIdentifier: getPackageName(),
    buildNumber: String(BUILD_NUMBER),
    supportsTablet: false,
    requireFullScreen: true,
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        'Polaris utiliza apenas sua foto de perfil. Ela não é processada nem armazenada — permanece no seu dispositivo.',
      NSCameraUsageDescription:
        'Utilize a câmera para tirar sua foto de perfil diretamente no app.',
      LSSupportsOpeningDocumentsInPlace: true,
      UIFileSharingEnabled: true,
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
      ],
    },
  },

  plugins: [
    'expo-router',
    'expo-sqlite',
    [
      'expo-image-picker',
      {
        photosPermission:
          'Polaris utiliza apenas sua foto de perfil. Ela não é processada nem armazenada — permanece no seu dispositivo.',
        cameraPermission:
          'Utilize a câmera para tirar sua foto de perfil diretamente no app.',
        colors: { cropToolbarColor: '#000000' },
        dark: { colors: { cropToolbarColor: '#000000' } },
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

  extra: {
    appEnv: process.env.APP_ENV ?? 'production',
  },
});
