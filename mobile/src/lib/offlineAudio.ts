import { Directory, File, Paths } from 'expo-file-system';

import { resolveAudioUrl } from './services/quran';

function reciterDir(reciterId: string): Directory {
  const dir = new Directory(Paths.document, 'audio', reciterId);
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  return dir;
}

function ayahFileName(surah: number, ayah: number): string {
  return `${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`;
}

/** Local file:// uri for an ayah's recitation if it's already been cached on-device, else null. */
export function getLocalAyahAudioUri(reciterId: string, surah: number, ayah: number): string | null {
  const file = new File(reciterDir(reciterId), ayahFileName(surah, ayah));
  return file.exists ? file.uri : null;
}

/**
 * Downloads every ayah's recitation for a surah that isn't already cached, one at a time,
 * so the chapter is available for offline playback after it's been opened once. Silently
 * skips ayahs that fail (network hiccup, missing CDN file) — playback falls back to
 * streaming for those. Pass `signal` to stop the sweep early (e.g. on screen unmount).
 */
export async function cacheSurahAudio(
  reciterId: string,
  audioUrlTemplate: string,
  surahNumber: number,
  ayahNumbers: number[],
  signal: AbortSignal
): Promise<void> {
  const dir = reciterDir(reciterId);
  for (const ayahNumber of ayahNumbers) {
    if (signal.aborted) return;
    const file = new File(dir, ayahFileName(surahNumber, ayahNumber));
    if (file.exists) continue;
    try {
      await File.downloadFileAsync(resolveAudioUrl(audioUrlTemplate, surahNumber, ayahNumber), file, {
        idempotent: true,
        signal,
      });
    } catch {
      // Skip and move on — a partial cache is still useful.
    }
  }
}
