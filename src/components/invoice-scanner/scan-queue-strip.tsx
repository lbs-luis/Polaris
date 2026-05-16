import { ScrollView, View } from 'react-native';
import { ScanQueueThumb } from './scan-queue-thumb';

interface ScanQueueStripProps {
  urls: string[];
}

export function ScanQueueStrip({ urls }: ScanQueueStripProps) {
  if (urls.length === 0) return <View style={{ height: 52 }} />;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {urls.map((url, i) => (
        <ScanQueueThumb key={`${url}-${i}`} status="done" />
      ))}
    </ScrollView>
  );
}
