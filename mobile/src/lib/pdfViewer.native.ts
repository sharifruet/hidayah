import type PdfView from 'react-native-pdf';
import { isRunningInExpoGo } from 'expo';

// react-native-pdf isn't in Expo Go, and importing it there throws (its react-native-blob-util
// dependency reads native constants at module load).
export const Pdf: typeof PdfView | null = isRunningInExpoGo()
  ? null
  : // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native-pdf').default;
