/**
 * Static Juz (Para) metadata — 30 divisions of the Quran.
 * start/end are { surah, ayah } references (1-indexed, within-surah ayah numbers).
 */
export const JUZ_DATA = [
  { juz: 1,  name: 'Alif Lam Mim',         start: { surah: 1,  ayah: 1   }, end: { surah: 2,  ayah: 141  }, surahs: [1, 2] },
  { juz: 2,  name: 'Sayaqul',               start: { surah: 2,  ayah: 142 }, end: { surah: 2,  ayah: 252  }, surahs: [2] },
  { juz: 3,  name: 'Tilka\'r-Rusul',        start: { surah: 2,  ayah: 253 }, end: { surah: 3,  ayah: 92   }, surahs: [2, 3] },
  { juz: 4,  name: 'Lan Tana Lu',           start: { surah: 3,  ayah: 93  }, end: { surah: 4,  ayah: 23   }, surahs: [3, 4] },
  { juz: 5,  name: 'Wal Muhsanat',          start: { surah: 4,  ayah: 24  }, end: { surah: 4,  ayah: 147  }, surahs: [4] },
  { juz: 6,  name: 'La Yuhibbullah',        start: { surah: 4,  ayah: 148 }, end: { surah: 5,  ayah: 81   }, surahs: [4, 5] },
  { juz: 7,  name: 'Wa Idha Sami\'u',       start: { surah: 5,  ayah: 82  }, end: { surah: 6,  ayah: 110  }, surahs: [5, 6] },
  { juz: 8,  name: 'Wa Law Annana',         start: { surah: 6,  ayah: 111 }, end: { surah: 7,  ayah: 87   }, surahs: [6, 7] },
  { juz: 9,  name: 'Qalal Mala\'u',         start: { surah: 7,  ayah: 88  }, end: { surah: 8,  ayah: 40   }, surahs: [7, 8] },
  { juz: 10, name: 'Wa A\'lamu',            start: { surah: 8,  ayah: 41  }, end: { surah: 9,  ayah: 92   }, surahs: [8, 9] },
  { juz: 11, name: 'Ya\'tadhirun',          start: { surah: 9,  ayah: 93  }, end: { surah: 11, ayah: 5    }, surahs: [9, 10, 11] },
  { juz: 12, name: 'Wa Ma Min Dabbah',      start: { surah: 11, ayah: 6   }, end: { surah: 12, ayah: 52   }, surahs: [11, 12] },
  { juz: 13, name: 'Wa Ma Ubarri\'u',       start: { surah: 12, ayah: 53  }, end: { surah: 14, ayah: 52   }, surahs: [12, 13, 14] },
  { juz: 14, name: 'Rubama',                start: { surah: 15, ayah: 1   }, end: { surah: 16, ayah: 128  }, surahs: [15, 16] },
  { juz: 15, name: 'Subhana\'lladhi',       start: { surah: 17, ayah: 1   }, end: { surah: 18, ayah: 74   }, surahs: [17, 18] },
  { juz: 16, name: 'Qal Alam',              start: { surah: 18, ayah: 75  }, end: { surah: 20, ayah: 135  }, surahs: [18, 19, 20] },
  { juz: 17, name: 'Iqtaraba',              start: { surah: 21, ayah: 1   }, end: { surah: 22, ayah: 78   }, surahs: [21, 22] },
  { juz: 18, name: 'Qad Aflaha',            start: { surah: 23, ayah: 1   }, end: { surah: 25, ayah: 20   }, surahs: [23, 24, 25] },
  { juz: 19, name: 'Wa Qalallazina',        start: { surah: 25, ayah: 21  }, end: { surah: 27, ayah: 55   }, surahs: [25, 26, 27] },
  { juz: 20, name: 'A\'man Khalaqa',        start: { surah: 27, ayah: 56  }, end: { surah: 29, ayah: 45   }, surahs: [27, 28, 29] },
  { juz: 21, name: 'Utlu Ma Uhiya',         start: { surah: 29, ayah: 46  }, end: { surah: 33, ayah: 30   }, surahs: [29, 30, 31, 32, 33] },
  { juz: 22, name: 'Wa Man Yaqnut',         start: { surah: 33, ayah: 31  }, end: { surah: 36, ayah: 27   }, surahs: [33, 34, 35, 36] },
  { juz: 23, name: 'Wa Mali',               start: { surah: 36, ayah: 28  }, end: { surah: 39, ayah: 31   }, surahs: [36, 37, 38, 39] },
  { juz: 24, name: 'Fa Man Azlamu',         start: { surah: 39, ayah: 32  }, end: { surah: 41, ayah: 46   }, surahs: [39, 40, 41] },
  { juz: 25, name: 'Ilayhi Yuraddu',        start: { surah: 41, ayah: 47  }, end: { surah: 45, ayah: 37   }, surahs: [41, 42, 43, 44, 45] },
  { juz: 26, name: 'Ha Mim',                start: { surah: 46, ayah: 1   }, end: { surah: 51, ayah: 30   }, surahs: [46, 47, 48, 49, 50, 51] },
  { juz: 27, name: 'Qala Fa Ma Khatbukum',  start: { surah: 51, ayah: 31  }, end: { surah: 57, ayah: 29   }, surahs: [51, 52, 53, 54, 55, 56, 57] },
  { juz: 28, name: 'Qad Sami\'allah',       start: { surah: 58, ayah: 1   }, end: { surah: 66, ayah: 12   }, surahs: [58, 59, 60, 61, 62, 63, 64, 65, 66] },
  { juz: 29, name: 'Tabaraka\'lladhi',      start: { surah: 67, ayah: 1   }, end: { surah: 77, ayah: 50   }, surahs: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77] },
  { juz: 30, name: '\'Amma Yatasa\'alun',   start: { surah: 78, ayah: 1   }, end: { surah: 114, ayah: 6   }, surahs: [78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114] },
];

export function getJuzForSurah(surahNumber) {
  return JUZ_DATA.find((j) => j.surahs.includes(surahNumber));
}
