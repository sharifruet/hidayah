import { Directory, File, Paths } from 'expo-file-system';

function booksDir(): Directory {
  const dir = new Directory(Paths.document, 'books');
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  return dir;
}

function localPdfFile(slug: string): File {
  return new File(booksDir(), `${slug}.pdf`);
}

/** Local file:// uri for a book's PDF if it's already been downloaded, else null. */
export function getLocalBookUri(slug: string): string | null {
  const file = localPdfFile(slug);
  return file.exists ? file.uri : null;
}

/** Downloads a book's PDF to permanent on-device storage the first time it's opened;
 * later reads (including offline) are served from disk instead of re-downloading. */
export async function ensureBookDownloaded(slug: string, pdfUrl: string): Promise<string> {
  const file = localPdfFile(slug);
  if (file.exists) return file.uri;
  const downloaded = await File.downloadFileAsync(pdfUrl, file, { idempotent: true });
  return downloaded.uri;
}
