import { useLocalSearchParams } from 'expo-router';
import { MushafScreen } from '../../../../components/quran/MushafScreen';

export default function MushafPageRoute() {
  const { pageNumber } = useLocalSearchParams<{ pageNumber: string }>();
  return <MushafScreen pageNumber={Number(pageNumber)} />;
}
