import type PdfView from 'react-native-pdf';

// Web: react-native-pdf is native-only and can't be bundled for web at all, so this file
// (picked on web instead of pdfViewer.native.ts) never references it at runtime.
export const Pdf: typeof PdfView | null = null;
