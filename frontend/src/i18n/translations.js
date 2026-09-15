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
  nav_hadith: {
    en: 'Hadith',
    bn: 'হাদিস',
    ur: 'حدیث',
    tr: 'Hadis',
    id: 'Hadis',
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
  settings_view_methods: {
    en: 'View all calculation methods →',
    bn: 'সব গণনা পদ্ধতি দেখুন →',
    ur: 'تمام حساب کے طریقے دیکھیں ←',
    tr: 'Tüm hesaplama yöntemlerini görüntüle →',
    id: 'Lihat semua metode perhitungan →',
  },

  // ── Calculation Methods page ─────────────────────────────────────────────────
  methods_title: {
    en: 'Calculation Methods',
    bn: 'গণনা পদ্ধতি',
    ur: 'حساب کے طریقے',
    tr: 'Hesaplama Yöntemleri',
    id: 'Metode Perhitungan',
  },
  methods_subtitle: {
    en: 'Compare how each method defines Fajr, Isha, and Asr, and pick the one you follow.',
    bn: 'প্রতিটি পদ্ধতি কীভাবে ফজর, ইশা এবং আসর নির্ধারণ করে তা তুলনা করুন এবং আপনি যেটি অনুসরণ করেন তা বেছে নিন।',
    ur: 'موازنہ کریں کہ ہر طریقہ فجر، عشاء اور عصر کا تعین کیسے کرتا ہے، اور وہ طریقہ منتخب کریں جس کی آپ پیروی کرتے ہیں۔',
    tr: 'Her yöntemin İmsak, Yatsı ve İkindi vakitlerini nasıl tanımladığını karşılaştırın ve takip ettiğiniz yöntemi seçin.',
    id: 'Bandingkan bagaimana setiap metode menentukan Subuh, Isya, dan Ashar, lalu pilih yang Anda ikuti.',
  },
  methods_group_organizational: {
    en: 'Organizational Methods',
    bn: 'প্রাতিষ্ঠানিক পদ্ধতি',
    ur: 'تنظیمی طریقے',
    tr: 'Kurumsal Yöntemler',
    id: 'Metode Organisasi',
  },
  methods_group_madhab: {
    en: 'Traditional Madhab Methods',
    bn: 'ঐতিহ্যবাহী মাযহাব পদ্ধতি',
    ur: 'روایتی مذہبی طریقے',
    tr: 'Geleneksel Mezhep Yöntemleri',
    id: 'Metode Mazhab Tradisional',
  },
  methods_group_custom: {
    en: 'Custom Methods',
    bn: 'কাস্টম পদ্ধতি',
    ur: 'حسب ضرورت طریقے',
    tr: 'Özel Yöntemler',
    id: 'Metode Kustom',
  },
  methods_fajr_angle: {
    en: 'Fajr angle',
    bn: 'ফজরের কোণ',
    ur: 'فجر کا زاویہ',
    tr: 'İmsak açısı',
    id: 'Sudut Subuh',
  },
  methods_isha_angle: {
    en: 'Isha angle',
    bn: 'ইশার কোণ',
    ur: 'عشاء کا زاویہ',
    tr: 'Yatsı açısı',
    id: 'Sudut Isya',
  },
  methods_isha_label: {
    en: 'Isha',
    bn: 'ইশা',
    ur: 'عشاء',
    tr: 'Yatsı',
    id: 'Isya',
  },
  methods_isha_after_maghrib: {
    en: 'minutes after Maghrib',
    bn: 'মিনিট মাগরিবের পর',
    ur: 'منٹ مغرب کے بعد',
    tr: 'dakika Akşam\'dan sonra',
    id: 'menit setelah Maghrib',
  },
  methods_asr_method: {
    en: 'Asr (Jurisprudence)',
    bn: 'আসর (ফিকহ)',
    ur: 'عصر (فقہ)',
    tr: 'İkindi (Fıkıh)',
    id: 'Ashar (Fikih)',
  },
  methods_asr_standard: {
    en: 'Single shadow — Shafi, Maliki, Hanbali',
    bn: 'একক ছায়া — শাফি, মালিকি, হাম্বলি',
    ur: 'واحد سایہ — شافعی، مالکی، حنبلی',
    tr: 'Tek gölge — Şafii, Maliki, Hanbeli',
    id: 'Bayangan tunggal — Syafi\'i, Maliki, Hambali',
  },
  methods_asr_hanafi: {
    en: 'Double shadow — Hanafi',
    bn: 'দ্বিগুণ ছায়া — হানাফি',
    ur: 'دوہرا سایہ — حنفی',
    tr: 'Çift gölge — Hanefi',
    id: 'Bayangan ganda — Hanafi',
  },
  methods_dhuhr_adjustment: {
    en: 'Dhuhr',
    bn: 'যোহর',
    ur: 'ظہر',
    tr: 'Öğle',
    id: 'Zuhur',
  },
  methods_dhuhr_after_noon: {
    en: 'min after solar noon',
    bn: 'মিনিট সৌর দুপুরের পর',
    ur: 'منٹ نصف النہار کے بعد',
    tr: 'dakika güneş öğleninden sonra',
    id: 'menit setelah tengah hari matahari',
  },
  methods_maghrib_adjustment: {
    en: 'Maghrib',
    bn: 'মাগরিব',
    ur: 'مغرب',
    tr: 'Akşam',
    id: 'Maghrib',
  },
  methods_maghrib_after_sunset: {
    en: 'min after sunset',
    bn: 'মিনিট সূর্যাস্তের পর',
    ur: 'منٹ غروب آفتاب کے بعد',
    tr: 'dakika gün batımından sonra',
    id: 'menit setelah matahari terbenam',
  },
  methods_default_badge: {
    en: 'Default',
    bn: 'ডিফল্ট',
    ur: 'پہلے سے طے شدہ',
    tr: 'Varsayılan',
    id: 'Default',
  },
  methods_current_badge: {
    en: 'Currently Selected',
    bn: 'বর্তমানে নির্বাচিত',
    ur: 'فی الحال منتخب',
    tr: 'Şu Anda Seçili',
    id: 'Saat Ini Dipilih',
  },
  methods_use_button: {
    en: 'Use this method',
    bn: 'এই পদ্ধতি ব্যবহার করুন',
    ur: 'یہ طریقہ استعمال کریں',
    tr: 'Bu yöntemi kullan',
    id: 'Gunakan metode ini',
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
