/**
 * UI translation strings.
 * Keys are semantic identifiers; values are per-language strings.
 * Languages: en (English), bn (Bengali), ur (Urdu), tr (Turkish), id (Indonesian)
 *
 * RTL languages: ur
 */

export const RTL_LANGUAGES = new Set(['ur']);

export const LANGUAGE_LABELS = {
  en: 'English',
  bn: 'বাংলা',
  ur: 'اردو',
  tr: 'Türkçe',
  id: 'Indonesia',
};

const t = {
  // ── App / Navigation ────────────────────────────────────────────────────────
  app_name: {
    en: 'Hidayah',
    bn: 'হিদায়াহ',
    ur: 'ہدایہ',
    tr: 'Hidayah',
    id: 'Hidayah',
  },
  nav_home: {
    en: 'Home',
    bn: 'হোম',
    ur: 'ہوم',
    tr: 'Ana Sayfa',
    id: 'Beranda',
  },
  nav_prayer: {
    en: 'Prayer Times',
    bn: 'সালাত',
    ur: 'نماز کے اوقات',
    tr: 'Namaz Vakitleri',
    id: 'Waktu Shalat',
  },
  nav_calendar: {
    en: 'Calendar',
    bn: 'ক্যালেন্ডার',
    ur: 'کیلنڈر',
    tr: 'Takvim',
    id: 'Kalender',
  },
  nav_quran: {
    en: "Qur'an",
    bn: 'কুরআন',
    ur: 'قرآن',
    tr: "Kur'an",
    id: "Qur'an",
  },
  nav_books: {
    en: 'Books',
    bn: 'বই',
    ur: 'کتب',
    tr: 'Kitaplar',
    id: 'Buku',
  },
  nav_duas: {
    en: "Du'a",
    bn: 'দু\'আ',
    ur: 'دعا',
    tr: "Du'a",
    id: 'Doa',
  },
  nav_settings: {
    en: 'Settings',
    bn: 'সেটিংস',
    ur: 'ترتیبات',
    tr: 'Ayarlar',
    id: 'Pengaturan',
  },

  // ── Settings page ────────────────────────────────────────────────────────────
  settings_title: {
    en: 'Settings',
    bn: 'সেটিংস',
    ur: 'ترتیبات',
    tr: 'Ayarlar',
    id: 'Pengaturan',
  },
  settings_subtitle: {
    en: 'Configure your preferences',
    bn: 'আপনার পছন্দ কনফিগার করুন',
    ur: 'اپنی ترجیحات ترتیب دیں',
    tr: 'Tercihlerinizi ayarlayın',
    id: 'Konfigurasikan preferensi Anda',
  },
  settings_language: {
    en: 'Language',
    bn: 'ভাষা',
    ur: 'زبان',
    tr: 'Dil',
    id: 'Bahasa',
  },
  settings_language_note: {
    en: 'Changes the UI language throughout the app',
    bn: 'অ্যাপ জুড়ে UI ভাষা পরিবর্তন করে',
    ur: 'پوری ایپ میں UI زبان تبدیل کرتا ہے',
    tr: "Uygulama genelinde arayüz dilini değiştirir",
    id: 'Mengubah bahasa antarmuka di seluruh aplikasi',
  },
  settings_calc_method: {
    en: 'Calculation Method',
    bn: 'গণনা পদ্ধতি',
    ur: 'حساب کا طریقہ',
    tr: 'Hesaplama Yöntemi',
    id: 'Metode Perhitungan',
  },
  settings_calc_note: {
    en: 'Select the calculation method for prayer times',
    bn: 'নামাজের সময়ের জন্য গণনা পদ্ধতি নির্বাচন করুন',
    ur: 'نماز کے اوقات کے لیے حساب کا طریقہ منتخب کریں',
    tr: 'Namaz vakitleri için hesaplama yöntemini seçin',
    id: 'Pilih metode perhitungan waktu shalat',
  },
  settings_location: {
    en: 'Current Location',
    bn: 'বর্তমান অবস্থান',
    ur: 'موجودہ مقام',
    tr: 'Mevcut Konum',
    id: 'Lokasi Saat Ini',
  },

  // ── Quran Reader ─────────────────────────────────────────────────────────────
  quran_loading: {
    en: 'Loading ayahs…',
    bn: 'আয়াত লোড হচ্ছে…',
    ur: 'آیات لوڈ ہو رہی ہیں…',
    tr: 'Ayetler yükleniyor…',
    id: 'Memuat ayat…',
  },
  quran_ayah: {
    en: 'Ayah',
    bn: 'আয়াত',
    ur: 'آیت',
    tr: 'Ayet',
    id: 'Ayat',
  },
  quran_ayahs: {
    en: 'ayahs',
    bn: 'আয়াত',
    ur: 'آیات',
    tr: 'ayet',
    id: 'ayat',
  },
  quran_mushaf: {
    en: 'Mushaf view',
    bn: 'মুসহাফ দৃশ্য',
    ur: 'مصحف ویو',
    tr: 'Mushaf görünümü',
    id: 'Tampilan Mushaf',
  },
  quran_search: {
    en: 'Search',
    bn: 'অনুসন্ধান',
    ur: 'تلاش',
    tr: 'Ara',
    id: 'Cari',
  },
  quran_select_ayahs: {
    en: 'Select ayahs',
    bn: 'আয়াত নির্বাচন করুন',
    ur: 'آیات منتخب کریں',
    tr: 'Ayetleri seç',
    id: 'Pilih ayat',
  },
  quran_tap_reveal: {
    en: 'Tap to reveal',
    bn: 'ট্যাপ করুন প্রকাশ করতে',
    ur: 'ظاہر کرنے کے لیے ٹیپ کریں',
    tr: 'Göstermek için dokunun',
    id: 'Ketuk untuk tampilkan',
  },
  quran_tafsir: {
    en: 'Tafsir / Commentary',
    bn: 'তাফসির',
    ur: 'تفسیر',
    tr: 'Tefsir',
    id: 'Tafsir',
  },

  // ── General ──────────────────────────────────────────────────────────────────
  loading: {
    en: 'Loading…',
    bn: 'লোড হচ্ছে…',
    ur: 'لوڈ ہو رہا ہے…',
    tr: 'Yükleniyor…',
    id: 'Memuat…',
  },
  error_generic: {
    en: 'Something went wrong.',
    bn: 'কিছু একটা ভুল হয়েছে।',
    ur: 'کچھ غلط ہو گیا۔',
    tr: 'Bir şeyler yanlış gitti.',
    id: 'Terjadi kesalahan.',
  },
  retry: {
    en: 'Try again',
    bn: 'আবার চেষ্টা করুন',
    ur: 'دوبارہ کوشش کریں',
    tr: 'Tekrar dene',
    id: 'Coba lagi',
  },
  cancel: {
    en: 'Cancel',
    bn: 'বাতিল',
    ur: 'منسوخ',
    tr: 'İptal',
    id: 'Batal',
  },
  copy: {
    en: 'Copy',
    bn: 'কপি করুন',
    ur: 'کاپی کریں',
    tr: 'Kopyala',
    id: 'Salin',
  },
  share: {
    en: 'Share',
    bn: 'শেয়ার করুন',
    ur: 'شیئر کریں',
    tr: 'Paylaş',
    id: 'Bagikan',
  },
  play: {
    en: 'Play',
    bn: 'চালান',
    ur: 'چلائیں',
    tr: 'Oynat',
    id: 'Putar',
  },
  offline_banner: {
    en: 'You are offline. Some content may be unavailable.',
    bn: 'আপনি অফলাইনে আছেন। কিছু কন্টেন্ট অনুপলব্ধ হতে পারে।',
    ur: 'آپ آف لائن ہیں۔ کچھ مواد دستیاب نہیں ہو سکتا۔',
    tr: 'Çevrimdışısınız. Bazı içerikler mevcut olmayabilir.',
    id: 'Anda sedang offline. Beberapa konten mungkin tidak tersedia.',
  },
};

/**
 * Returns a translated string for the given key and language.
 * Falls back to English if the language is not available.
 */
export function tr(key, language = 'en') {
  const entry = t[key];
  if (!entry) return key;
  return entry[language] ?? entry.en ?? key;
}

export default t;
