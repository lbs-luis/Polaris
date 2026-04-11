import * as FileSystem from 'expo-file-system/legacy';

export default async function saveImageToApp(uri: string) {
  const fileName = uri.split('/').pop();

  const avatarDir = FileSystem.documentDirectory + 'avatars/';

  await FileSystem.makeDirectoryAsync(avatarDir, {
    intermediates: true,
  });

  const newPath = avatarDir + fileName;

  await FileSystem.copyAsync({
    from: uri,
    to: newPath,
  });

  return newPath;
}
