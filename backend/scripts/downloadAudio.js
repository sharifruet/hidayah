/**
 * Quran Audio Downloader
 *
 * Downloads per-ayah MP3 files from everyayah.com and stores them locally.
 * Run once: node scripts/downloadAudio.js
 *
 * Options:
 *   --reciters Alafasy_128kbps,Husary_128kbps,...  (defaults: all 4)
 *   --surahs 1-114                                  (default: all)
 *   --concurrency 3                                 (parallel downloads)
 *
 * Storage layout:
 *   backend/public/audio/{reciter}/{surah3}{ayah3}.mp3
 *   e.g. public/audio/Alafasy_128kbps/001001.mp3
 *
 * Disk estimate: ~100 KB/file × 6236 ayahs × 4 reciters ≈ 2.5 GB total.
 * Download one reciter at a time to manage storage.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'audio');

const ALL_RECITERS = [
  'Alafasy_128kbps',
  'Abdul_Basit_Murattal_64kbps',
  'Husary_128kbps',
  'Mohammad_al_Tablaway_128kbps',
];

// Surah ayah counts (1–114)
const SURAH_AYAH_COUNTS = [
  7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,
  112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,54,59,37,35,38,29,18,
  45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,
  56,40,31,50,45,6,29,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,
  9,5,4,7,3,6,3,5,4,5,6,
];

// ─── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

const recitersArg = args.find((a) => a.startsWith('--reciters='));
const reciters = recitersArg
  ? recitersArg.replace('--reciters=', '').split(',').map((s) => s.trim())
  : ALL_RECITERS;

const surahsArg = args.find((a) => a.startsWith('--surahs='));
let surahStart = 1, surahEnd = 114;
if (surahsArg) {
  const parts = surahsArg.replace('--surahs=', '').split('-');
  surahStart = parseInt(parts[0]) || 1;
  surahEnd   = parseInt(parts[1]) || parseInt(parts[0]) || 114;
}

const concurrencyArg = args.find((a) => a.startsWith('--concurrency='));
const CONCURRENCY = parseInt(concurrencyArg?.replace('--concurrency=', '') || '3');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pad3(n) {
  return String(n).padStart(3, '0');
}

function audioFilename(surahNum, ayahNum) {
  return `${pad3(surahNum)}${pad3(ayahNum)}.mp3`;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

async function runPool(tasks, concurrency) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function downloadReciter(reciterId) {
  const reciterDir = path.join(PUBLIC_DIR, reciterId);
  fs.mkdirSync(reciterDir, { recursive: true });

  const tasks = [];
  let skipped = 0, downloaded = 0, failed = 0;

  for (let s = surahStart; s <= surahEnd; s++) {
    const ayahCount = SURAH_AYAH_COUNTS[s - 1];
    for (let a = 1; a <= ayahCount; a++) {
      const filename = audioFilename(s, a);
      const destPath = path.join(reciterDir, filename);
      if (fs.existsSync(destPath)) { skipped++; continue; }

      const url = `https://everyayah.com/data/${reciterId}/${filename}`;
      tasks.push(async () => {
        try {
          await downloadFile(url, destPath);
          downloaded++;
        } catch (err) {
          console.warn(`    ⚠️  Failed ${filename}: ${err.message}`);
          failed++;
        }
      });
    }
  }

  console.log(`  ${skipped} already exist, downloading ${tasks.length} files...`);
  await runPool(tasks, CONCURRENCY);
  console.log(`  ✅ Done — ${downloaded} downloaded, ${failed} failed`);
}

async function run() {
  console.log('🎵 Quran Audio Downloader');
  console.log(`   Reciters: ${reciters.join(', ')}`);
  console.log(`   Surahs: ${surahStart}–${surahEnd}`);
  console.log(`   Concurrency: ${CONCURRENCY}`);
  console.log(`   Output: ${PUBLIC_DIR}`);

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  for (const reciterId of reciters) {
    console.log(`\n📥 Downloading: ${reciterId}`);
    await downloadReciter(reciterId);
  }

  console.log('\n🎉 All downloads complete!');
}

run().catch((err) => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
