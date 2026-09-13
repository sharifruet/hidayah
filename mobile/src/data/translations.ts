/**
 * UI translation strings.
 * Keys are semantic identifiers; values are per-language strings.
 * Languages: en (English), bn (Bengali), ur (Urdu), tr (Turkish), id (Indonesian)
 * RTL languages: ur
 */
import type { LanguageCode } from '../lib/constants';

export const RTL_LANGUAGES = new Set<LanguageCode>(['ur']);

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  bn: 'বাংলা',
  ur: 'اردو',
  tr: 'Türkçe',
  id: 'Indonesia',
};

type Entry = Record<LanguageCode, string>;

const t: Record<string, Entry> = {
  app_name: { en: 'Hidayah', bn: 'হিদায়াহ', ur: 'ہدایہ', tr: 'Hidayah', id: 'Hidayah' },
  nav_home: { en: 'Home', bn: 'হোম', ur: 'ہوم', tr: 'Ana Sayfa', id: 'Beranda' },
  nav_prayer: { en: 'Prayer', bn: 'সালাত', ur: 'نماز', tr: 'Namaz', id: 'Shalat' },
  nav_calendar: { en: 'Calendar', bn: 'ক্যালেন্ডার', ur: 'کیلنڈر', tr: 'Takvim', id: 'Kalender' },
  nav_quran: { en: "Qur'an", bn: 'কুরআন', ur: 'قرآن', tr: "Kur'an", id: "Qur'an" },
  nav_books: { en: 'Books', bn: 'বই', ur: 'کتب', tr: 'Kitaplar', id: 'Buku' },
  nav_duas: { en: "Du'a", bn: "দু'আ", ur: 'دعا', tr: "Du'a", id: 'Doa' },
  nav_settings: { en: 'Settings', bn: 'সেটিংস', ur: 'ترتیبات', tr: 'Ayarlar', id: 'Pengaturan' },
  nav_more: { en: 'More', bn: 'আরও', ur: 'مزید', tr: 'Diğer', id: 'Lainnya' },

  settings_title: { en: 'Settings', bn: 'সেটিংস', ur: 'ترتیبات', tr: 'Ayarlar', id: 'Pengaturan' },
  settings_subtitle: {
    en: 'Configure your preferences',
    bn: 'আপনার পছন্দ কনফিগার করুন',
    ur: 'اپنی ترجیحات ترتیب دیں',
    tr: 'Tercihlerinizi ayarlayın',
    id: 'Konfigurasikan preferensi Anda',
  },
  settings_language: { en: 'Language', bn: 'ভাষা', ur: 'زبان', tr: 'Dil', id: 'Bahasa' },
  settings_language_note: {
    en: 'Changes the UI language throughout the app',
    bn: 'অ্যাপ জুড়ে UI ভাষা পরিবর্তন করে',
    ur: 'پوری ایپ میں UI زبان تبدیل کرتا ہے',
    tr: 'Uygulama genelinde arayüz dilini değiştirir',
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
  settings_location: { en: 'Current Location', bn: 'বর্তমান অবস্থান', ur: 'موجودہ مقام', tr: 'Mevcut Konum', id: 'Lokasi Saat Ini' },
  settings_view_methods: {
    en: 'View all calculation methods →',
    bn: 'সব গণনা পদ্ধতি দেখুন →',
    ur: 'تمام حساب کے طریقے دیکھیں ←',
    tr: 'Tüm hesaplama yöntemlerini görüntüle →',
    id: 'Lihat semua metode perhitungan →',
  },
  settings_notifications: { en: 'Prayer Notifications', bn: 'নামাজের বিজ্ঞপ্তি', ur: 'نماز کی اطلاعات', tr: 'Namaz Bildirimleri', id: 'Notifikasi Shalat' },
  settings_notifications_note: {
    en: 'Get a reminder when each prayer time begins',
    bn: 'প্রতিটি নামাজের সময় শুরু হলে একটি অনুস্মারক পান',
    ur: 'ہر نماز کا وقت شروع ہونے پر یاد دہانی حاصل کریں',
    tr: 'Her namaz vakti girdiğinde hatırlatma alın',
    id: 'Dapatkan pengingat saat setiap waktu shalat tiba',
  },
  settings_dark_mode: { en: 'Dark Mode', bn: 'ডার্ক মোড', ur: 'ڈارک موڈ', tr: 'Karanlık Mod', id: 'Mode Gelap' },
  settings_dark_mode_note: {
    en: 'Easy on the eyes at night',
    bn: 'রাতের জন্য উপযুক্ত থিম',
    ur: 'رات کے وقت آنکھوں کے لیے آرام دہ',
    tr: 'Gece göz için rahat',
    id: 'Nyaman untuk mata di malam hari',
  },

  methods_title: { en: 'Calculation Methods', bn: 'গণনা পদ্ধতি', ur: 'حساب کے طریقے', tr: 'Hesaplama Yöntemleri', id: 'Metode Perhitungan' },
  methods_subtitle: {
    en: 'Compare how each method defines Fajr, Isha, and Asr, and pick the one you follow.',
    bn: 'প্রতিটি পদ্ধতি কীভাবে ফজর, ইশা এবং আসর নির্ধারণ করে তা তুলনা করুন এবং আপনি যেটি অনুসরণ করেন তা বেছে নিন।',
    ur: 'موازنہ کریں کہ ہر طریقہ فجر، عشاء اور عصر کا تعین کیسے کرتا ہے، اور وہ طریقہ منتخب کریں جس کی آپ پیروی کرتے ہیں۔',
    tr: 'Her yöntemin İmsak, Yatsı ve İkindi vakitlerini nasıl tanımladığını karşılaştırın ve takip ettiğiniz yöntemi seçin.',
    id: 'Bandingkan bagaimana setiap metode menentukan Subuh, Isya, dan Ashar, lalu pilih yang Anda ikuti.',
  },
  methods_default_badge: { en: 'Default', bn: 'ডিফল্ট', ur: 'پہلے سے طے شدہ', tr: 'Varsayılan', id: 'Default' },
  methods_current_badge: { en: 'Currently Selected', bn: 'বর্তমানে নির্বাচিত', ur: 'فی الحال منتخب', tr: 'Şu Anda Seçili', id: 'Saat Ini Dipilih' },
  methods_use_button: { en: 'Use this method', bn: 'এই পদ্ধতি ব্যবহার করুন', ur: 'یہ طریقہ استعمال کریں', tr: 'Bu yöntemi kullan', id: 'Gunakan metode ini' },

  home_greeting_morning: { en: 'Good morning', bn: 'শুভ সকাল', ur: 'صبح بخیر', tr: 'Günaydın', id: 'Selamat pagi' },
  home_greeting_afternoon: { en: 'Good afternoon', bn: 'শুভ অপরাহ্ন', ur: 'خوش آمدید', tr: 'İyi günler', id: 'Selamat siang' },
  home_greeting_evening: { en: 'Good evening', bn: 'শুভ সন্ধ্যা', ur: 'شام بخیر', tr: 'İyi akşamlar', id: 'Selamat malam' },
  home_next_prayer: { en: 'Next Prayer', bn: 'পরবর্তী নামাজ', ur: 'اگلی نماز', tr: 'Sıradaki Namaz', id: 'Shalat Berikutnya' },
  home_continue_reading: { en: 'Continue Reading', bn: 'পড়া চালিয়ে যান', ur: 'پڑھنا جاری رکھیں', tr: 'Okumaya Devam Et', id: 'Lanjutkan Membaca' },
  home_daily_ayah: { en: 'Ayah of the Day', bn: 'আজকের আয়াত', ur: 'آج کی آیت', tr: 'Günün Ayeti', id: 'Ayat Hari Ini' },

  quran_loading: { en: 'Loading ayahs…', bn: 'আয়াত লোড হচ্ছে…', ur: 'آیات لوڈ ہو رہی ہیں…', tr: 'Ayetler yükleniyor…', id: 'Memuat ayat…' },
  quran_ayah: { en: 'Ayah', bn: 'আয়াত', ur: 'آیت', tr: 'Ayet', id: 'Ayat' },
  quran_ayahs: { en: 'ayahs', bn: 'আয়াত', ur: 'آیات', tr: 'ayet', id: 'ayat' },
  quran_mushaf: { en: 'Mushaf view', bn: 'মুসহাফ দৃশ্য', ur: 'مصحف ویو', tr: 'Mushaf görünümü', id: 'Tampilan Mushaf' },
  quran_search: { en: 'Search', bn: 'অনুসন্ধান', ur: 'تلاش', tr: 'Ara', id: 'Cari' },
  quran_tafsir: { en: 'Tafsir / Commentary', bn: 'তাফসির', ur: 'تفسیر', tr: 'Tefsir', id: 'Tafsir' },

  loading: { en: 'Loading…', bn: 'লোড হচ্ছে…', ur: 'لوڈ ہو رہا ہے…', tr: 'Yükleniyor…', id: 'Memuat…' },
  error_generic: { en: 'Something went wrong.', bn: 'কিছু একটা ভুল হয়েছে।', ur: 'کچھ غلط ہو گیا۔', tr: 'Bir şeyler yanlış gitti.', id: 'Terjadi kesalahan.' },
  retry: { en: 'Try again', bn: 'আবার চেষ্টা করুন', ur: 'دوبارہ کوشش کریں', tr: 'Tekrar dene', id: 'Coba lagi' },
  cancel: { en: 'Cancel', bn: 'বাতিল', ur: 'منسوخ', tr: 'İptal', id: 'Batal' },
  copy: { en: 'Copy', bn: 'কপি করুন', ur: 'کاپی کریں', tr: 'Kopyala', id: 'Salin' },
  copied: { en: 'Copied!', bn: 'কপি হয়েছে!', ur: 'کاپی ہو گیا!', tr: 'Kopyalandı!', id: 'Disalin!' },
  share: { en: 'Share', bn: 'শেয়ার করুন', ur: 'شیئر کریں', tr: 'Paylaş', id: 'Bagikan' },
  play: { en: 'Play', bn: 'চালান', ur: 'چلائیں', tr: 'Oynat', id: 'Putar' },

  // ── Home ─────────────────────────────────────────────────────────────────────
  home_currently: { en: 'Currently', bn: 'বর্তমানে', ur: 'اس وقت', tr: 'Şu anda', id: 'Saat ini' },
  home_until: { en: 'until', bn: 'পর্যন্ত', ur: 'تک', tr: 'kalan süre', id: 'sampai' },
  home_quick_actions: { en: 'Quick Actions', bn: 'দ্রুত পদক্ষেপ', ur: 'فوری اقدامات', tr: 'Hızlı İşlemler', id: 'Aksi Cepat' },
  home_start_reading: { en: 'Start reading', bn: 'পড়া শুরু করুন', ur: 'پڑھنا شروع کریں', tr: 'Okumaya başla', id: 'Mulai membaca' },
  home_adhkar: { en: 'Adhkar', bn: 'আযকার', ur: 'اذکار', tr: 'Zikirler', id: 'Dzikir' },
  home_library: { en: 'Library', bn: 'লাইব্রেরি', ur: 'لائبریری', tr: 'Kütüphane', id: 'Perpustakaan' },
  home_compass: { en: 'Compass', bn: 'কম্পাস', ur: 'قطب نما', tr: 'Pusula', id: 'Kompas' },
  home_ramadan_mubarak: { en: 'Ramadan Mubarak', bn: 'রমজান মোবারক', ur: 'رمضان مبارک', tr: 'Ramazan Mübarek', id: 'Ramadhan Mubarak' },
  home_day_of_ramadan: { en: 'day of Ramadan', bn: 'রমজানের দিন', ur: 'رمضان کا دن', tr: 'Ramazan günü', id: 'hari Ramadhan' },
  home_eid_in: { en: 'Eid in ~', bn: 'ঈদ আনুমানিক', ur: 'عید تقریباً', tr: 'Bayrama yaklaşık', id: 'Idul Fitri sekitar' },
  home_days: { en: 'days', bn: 'দিন', ur: 'دن', tr: 'gün', id: 'hari' },
  home_until_ramadan: { en: 'days until Ramadan', bn: 'রমজান শুরু হতে দিন বাকি', ur: 'رمضان تک دن', tr: 'Ramazan\'a kalan gün', id: 'hari menuju Ramadhan' },
  home_read: { en: 'Read', bn: 'পড়ুন', ur: 'پڑھیں', tr: 'Oku', id: 'Baca' },

  // ── Prayer ───────────────────────────────────────────────────────────────────
  prayer_title: { en: 'Prayer Times', bn: 'নামাজের সময়', ur: 'اوقات نماز', tr: 'Namaz Vakitleri', id: 'Waktu Shalat' },
  prayer_methods_tab: { en: 'Methods', bn: 'পদ্ধতি', ur: 'طریقے', tr: 'Yöntemler', id: 'Metode' },
  prayer_calendar_tab: { en: 'Calendar', bn: 'ক্যালেন্ডার', ur: 'کیلنڈر', tr: 'Takvim', id: 'Kalender' },
  prayer_load_error: { en: "Couldn't load prayer times. Check your connection.", bn: 'নামাজের সময় লোড করা যায়নি। আপনার সংযোগ পরীক্ষা করুন।', ur: 'نماز کے اوقات لوڈ نہیں ہو سکے۔ اپنا کنکشن چیک کریں۔', tr: 'Namaz vakitleri yüklenemedi. Bağlantınızı kontrol edin.', id: 'Waktu shalat tidak dapat dimuat. Periksa koneksi Anda.' },
  prayer_fajr: { en: 'Fajr', bn: 'ফজর', ur: 'فجر', tr: 'İmsak', id: 'Subuh' },
  prayer_sunrise: { en: 'Sunrise', bn: 'সূর্যোদয়', ur: 'طلوع آفتاب', tr: 'Güneş Doğuşu', id: 'Terbit' },
  prayer_dhuhr: { en: 'Dhuhr', bn: 'যোহর', ur: 'ظہر', tr: 'Öğle', id: 'Zuhur' },
  prayer_asr: { en: 'Asr', bn: 'আসর', ur: 'عصر', tr: 'İkindi', id: 'Ashar' },
  prayer_maghrib: { en: 'Maghrib', bn: 'মাগরিব', ur: 'مغرب', tr: 'Akşam', id: 'Maghrib' },
  prayer_sunset: { en: 'Sunset', bn: 'সূর্যাস্ত', ur: 'غروب آفتاب', tr: 'Gün Batımı', id: 'Terbenam' },
  prayer_isha: { en: 'Isha', bn: 'ইশা', ur: 'عشاء', tr: 'Yatsı', id: 'Isya' },
  prayer_change_location: { en: 'Change Location', bn: 'অবস্থান পরিবর্তন করুন', ur: 'مقام تبدیل کریں', tr: 'Konumu Değiştir', id: 'Ubah Lokasi' },
  prayer_search_place: { en: 'Search city or place…', bn: 'শহর বা স্থান খুঁজুন…', ur: 'شہر یا مقام تلاش کریں…', tr: 'Şehir veya yer ara…', id: 'Cari kota atau tempat…' },
  prayer_use_current_location: { en: 'Use current location', bn: 'বর্তমান অবস্থান ব্যবহার করুন', ur: 'موجودہ مقام استعمال کریں', tr: 'Mevcut konumu kullan', id: 'Gunakan lokasi saat ini' },

  // ── Calendar ─────────────────────────────────────────────────────────────────
  calendar_title: { en: 'Calendar', bn: 'ক্যালেন্ডার', ur: 'کیلنڈر', tr: 'Takvim', id: 'Kalender' },
  calendar_hijri_months: { en: 'Hijri months this Gregorian year', bn: 'এই খ্রিস্টীয় বছরের হিজরি মাসসমূহ', ur: 'اس عیسوی سال کے ہجری مہینے', tr: 'Bu miladi yıldaki hicri aylar', id: 'Bulan Hijriah tahun Masehi ini' },
  calendar_view_month: { en: 'Month', bn: 'মাস', ur: 'مہینہ', tr: 'Ay', id: 'Bulan' },
  calendar_view_year: { en: 'Year', bn: 'বছর', ur: 'سال', tr: 'Yıl', id: 'Tahun' },
  calendar_view_range: { en: 'Range', bn: 'পরিসীমা', ur: 'رینج', tr: 'Aralık', id: 'Rentang' },
  calendar_range_from: { en: 'From', bn: 'থেকে', ur: 'سے', tr: 'Başlangıç', id: 'Dari' },
  calendar_range_to: { en: 'To', bn: 'পর্যন্ত', ur: 'تک', tr: 'Bitiş', id: 'Sampai' },
  calendar_range_show: { en: 'Show', bn: 'দেখান', ur: 'دکھائیں', tr: 'Göster', id: 'Tampilkan' },
  calendar_range_loading: { en: 'Loading range…', bn: 'পরিসীমা লোড হচ্ছে…', ur: 'رینج لوڈ ہو رہی ہے…', tr: 'Aralık yükleniyor…', id: 'Memuat rentang…' },
  calendar_range_empty: { en: 'Pick a start and end date to see prayer times.', bn: 'নামাজের সময় দেখতে শুরু ও শেষ তারিখ নির্বাচন করুন।', ur: 'نماز کے اوقات دیکھنے کے لیے آغاز اور اختتامی تاریخ منتخب کریں۔', tr: 'Namaz vakitlerini görmek için başlangıç ve bitiş tarihi seçin.', id: 'Pilih tanggal mulai dan selesai untuk melihat waktu shalat.' },
  calendar_range_too_long: { en: 'Please pick a range of 365 days or fewer.', bn: 'অনুগ্রহ করে ৩৬৫ দিন বা তার কম পরিসীমা নির্বাচন করুন।', ur: 'براہ کرم 365 دن یا اس سے کم کی رینج منتخب کریں۔', tr: 'Lütfen 365 gün veya daha kısa bir aralık seçin.', id: 'Silakan pilih rentang 365 hari atau kurang.' },
  calendar_year_hijri_start: { en: 'starts', bn: 'শুরু', ur: 'شروع', tr: 'başlıyor', id: 'mulai' },
  calendar_range_next_7: { en: 'Next 7 days', bn: 'পরবর্তী ৭ দিন', ur: 'اگلے 7 دن', tr: 'Sonraki 7 gün', id: '7 hari ke depan' },
  calendar_range_next_14: { en: 'Next 14 days', bn: 'পরবর্তী ১৪ দিন', ur: 'اگلے 14 دن', tr: 'Sonraki 14 gün', id: '14 hari ke depan' },
  calendar_range_next_30: { en: 'Next 30 days', bn: 'পরবর্তী ৩০ দিন', ur: 'اگلے 30 دن', tr: 'Sonraki 30 gün', id: '30 hari ke depan' },
  calendar_range_this_month: { en: 'This month', bn: 'এই মাস', ur: 'اس مہینے', tr: 'Bu ay', id: 'Bulan ini' },
  calendar_range_custom: { en: 'Custom', bn: 'কাস্টম', ur: 'اپنی مرضی', tr: 'Özel', id: 'Kustom' },
  calendar_range_tap_start: { en: 'Tap a start date', bn: 'শুরুর তারিখ নির্বাচন করুন', ur: 'شروع کی تاریخ منتخب کریں', tr: 'Bir başlangıç tarihi seçin', id: 'Ketuk tanggal mulai' },
  calendar_range_tap_end: { en: 'Tap an end date', bn: 'শেষের তারিখ নির্বাচন করুন', ur: 'اختتامی تاریخ منتخب کریں', tr: 'Bir bitiş tarihi seçin', id: 'Ketuk tanggal selesai' },

  // ── Calculation Methods ──────────────────────────────────────────────────────
  methods_org: { en: 'Organizational Methods', bn: 'প্রাতিষ্ঠানিক পদ্ধতি', ur: 'تنظیمی طریقے', tr: 'Kurumsal Yöntemler', id: 'Metode Organisasi' },
  methods_madhab: { en: 'Traditional Madhab Methods', bn: 'ঐতিহ্যবাহী মাযহাব পদ্ধতি', ur: 'روایتی مذہبی طریقے', tr: 'Geleneksel Mezhep Yöntemleri', id: 'Metode Mazhab Tradisional' },
  methods_custom: { en: 'Custom Methods', bn: 'কাস্টম পদ্ধতি', ur: 'حسب ضرورت طریقے', tr: 'Özel Yöntemler', id: 'Metode Kustom' },
  methods_fajr_angle: { en: 'Fajr angle', bn: 'ফজরের কোণ', ur: 'فجر کا زاویہ', tr: 'İmsak açısı', id: 'Sudut Subuh' },
  methods_isha_angle: { en: 'Isha angle', bn: 'ইশার কোণ', ur: 'عشاء کا زاویہ', tr: 'Yatsı açısı', id: 'Sudut Isya' },
  methods_isha_after_maghrib: { en: 'min after Maghrib', bn: 'মিনিট মাগরিবের পর', ur: 'منٹ مغرب کے بعد', tr: 'dakika Akşam\'dan sonra', id: 'menit setelah Maghrib' },
  methods_asr: { en: 'Asr', bn: 'আসর', ur: 'عصر', tr: 'İkindi', id: 'Ashar' },

  // ── Qur'an ───────────────────────────────────────────────────────────────────
  quran_title: { en: "Al-Qur'an", bn: 'আল-কুরআন', ur: 'القرآن', tr: "Kur'an-ı Kerim", id: "Al-Qur'an" },
  quran_surah_count: { en: '114 Surahs', bn: '১১৪টি সূরা', ur: '114 سورتیں', tr: '114 Sure', id: '114 Surah' },
  quran_surah_tab: { en: 'Surah', bn: 'সূরা', ur: 'سورہ', tr: 'Sure', id: 'Surah' },
  quran_juz_tab: { en: 'Juz', bn: 'পারা', ur: 'پارہ', tr: 'Cüz', id: 'Juz' },
  quran_search_ayahs: { en: 'Search ayahs', bn: 'আয়াত অনুসন্ধান', ur: 'آیات تلاش کریں', tr: 'Ayetlerde ara', id: 'Cari ayat' },
  quran_search_surah: { en: 'Search surah…', bn: 'সূরা খুঁজুন…', ur: 'سورہ تلاش کریں…', tr: 'Sure ara…', id: 'Cari surah…' },
  quran_load_error: { en: "Couldn't load surahs.", bn: 'সূরা লোড করা যায়নি।', ur: 'سورتیں لوڈ نہیں ہو سکیں۔', tr: 'Sureler yüklenemedi.', id: 'Surah tidak dapat dimuat.' },
  quran_bookmarks_title: { en: 'Bookmarks', bn: 'বুকমার্ক', ur: 'بک مارکس', tr: 'Yer İşaretleri', id: 'Markah' },
  quran_no_bookmarks: { en: 'No bookmarks yet.', bn: 'এখনো কোনো বুকমার্ক নেই।', ur: 'ابھی تک کوئی بک مارک نہیں۔', tr: 'Henüz yer işareti yok.', id: 'Belum ada markah.' },
  quran_search_placeholder: { en: 'Search translation text…', bn: 'অনুবাদ টেক্সট খুঁজুন…', ur: 'ترجمہ متن تلاش کریں…', tr: 'Çeviri metninde ara…', id: 'Cari teks terjemahan…' },
  quran_no_results: { en: 'No results for', bn: 'এর জন্য কোনো ফলাফল নেই', ur: 'کے لیے کوئی نتیجہ نہیں', tr: 'için sonuç yok', id: 'Tidak ada hasil untuk' },
  quran_reveal_translation: { en: 'Tap to reveal translation', bn: 'অনুবাদ দেখতে ট্যাপ করুন', ur: 'ترجمہ دیکھنے کے لیے ٹیپ کریں', tr: 'Çeviriyi görmek için dokun', id: 'Ketuk untuk menampilkan terjemahan' },
  quran_tafsir_loading: { en: 'Loading tafsir…', bn: 'তাফসির লোড হচ্ছে…', ur: 'تفسیر لوڈ ہو رہی ہے…', tr: 'Tefsir yükleniyor…', id: 'Memuat tafsir…' },
  quran_tafsir_unavailable: { en: 'Tafsir unavailable.', bn: 'তাফসির উপলব্ধ নেই।', ur: 'تفسیر دستیاب نہیں۔', tr: 'Tefsir mevcut değil.', id: 'Tafsir tidak tersedia.' },
  quran_reader_settings: { en: 'Reader Settings', bn: 'পাঠক সেটিংস', ur: 'ریڈر ترتیبات', tr: 'Okuyucu Ayarları', id: 'Pengaturan Pembaca' },
  quran_show_bengali: { en: 'Show Bengali translation', bn: 'বাংলা অনুবাদ দেখান', ur: 'بنگالی ترجمہ دکھائیں', tr: 'Bengalce çeviriyi göster', id: 'Tampilkan terjemahan Bengali' },
  quran_hide_translation: { en: 'Hide translation', bn: 'অনুবাদ লুকান', ur: 'ترجمہ چھپائیں', tr: 'Çeviriyi gizle', id: 'Sembunyikan terjemahan' },
  quran_hide_translation_note: { en: 'Hide translation until tapped', bn: 'ট্যাপ না করা পর্যন্ত অনুবাদ লুকান', ur: 'ٹیپ ہونے تک ترجمہ چھپائیں', tr: 'Dokunulana kadar çeviriyi gizle', id: 'Sembunyikan terjemahan sampai diketuk' },
  quran_memorisation_mode: { en: 'Memorisation mode', bn: 'মুখস্থকরণ মোড', ur: 'حفظ موڈ', tr: 'Ezber modu', id: 'Mode hafalan' },
  quran_memorisation_note: { en: 'Hide ayah & repeat audio before advancing', bn: 'আয়াত লুকান এবং এগিয়ে যাওয়ার আগে অডিও পুনরাবৃত্তি করুন', ur: 'آیت چھپائیں اور آگے بڑھنے سے پہلے آڈیو دہرائیں', tr: 'Ayeti gizle ve ilerlemeden önce sesi tekrarla', id: 'Sembunyikan ayat & ulangi audio sebelum lanjut' },
  quran_repeat_count: { en: 'Repeat each ayah', bn: 'প্রতিটি আয়াত পুনরাবৃত্তি', ur: 'ہر آیت کو دہرائیں', tr: 'Her ayeti tekrarla', id: 'Ulangi setiap ayat' },
  quran_tap_to_reveal: { en: 'Tap to reveal', bn: 'প্রকাশ করতে ট্যাপ করুন', ur: 'ظاہر کرنے کے لیے ٹیپ کریں', tr: 'Göstermek için dokun', id: 'Ketuk untuk menampilkan' },
  quran_playback_speed: { en: 'Playback speed', bn: 'প্লেব্যাক গতি', ur: 'پلے بیک کی رفتار', tr: 'Oynatma hızı', id: 'Kecepatan putar' },
  quran_sleep_timer: { en: 'Sleep timer', bn: 'স্লিপ টাইমার', ur: 'سلیپ ٹائمر', tr: 'Uyku zamanlayıcısı', id: 'Pengatur waktu tidur' },
  quran_sleep_off: { en: 'Off', bn: 'বন্ধ', ur: 'بند', tr: 'Kapalı', id: 'Mati' },
  quran_view_in_quran: { en: "View in Qur'an", bn: 'কুরআনে দেখুন', ur: 'قرآن میں دیکھیں', tr: "Kur'an'da görüntüle", id: "Lihat di Qur'an" },

  quran_mushaf_tab: { en: 'Mushaf', bn: 'মুসহাফ', ur: 'مصحف', tr: 'Mushaf', id: 'Mushaf' },
  quran_mushaf_page: { en: 'Page', bn: 'পৃষ্ঠা', ur: 'صفحہ', tr: 'Sayfa', id: 'Halaman' },
  quran_mushaf_juz: { en: 'Juz', bn: 'জুজ', ur: 'جز', tr: 'Cüz', id: 'Juz' },
  quran_mushaf_jump_placeholder: { en: 'Page', bn: 'পৃষ্ঠা', ur: 'صفحہ', tr: 'Sayfa', id: 'Halaman' },
  quran_mushaf_go: { en: 'Go', bn: 'যান', ur: 'جائیں', tr: 'Git', id: 'Pergi' },
  quran_mushaf_invalid: { en: "Invalid page number (1–604)", bn: 'অবৈধ পৃষ্ঠা নম্বর (১–৬০৪)', ur: 'غلط صفحہ نمبر (1–604)', tr: 'Geçersiz sayfa numarası (1–604)', id: 'Nomor halaman tidak valid (1–604)' },
  quran_mushaf_prev: { en: 'Previous', bn: 'আগের', ur: 'پچھلا', tr: 'Önceki', id: 'Sebelumnya' },
  quran_mushaf_next: { en: 'Next', bn: 'পরের', ur: 'اگلا', tr: 'Sonraki', id: 'Berikutnya' },

  // ── Du'as ────────────────────────────────────────────────────────────────────
  duas_title: { en: "Du'a & Adhkar", bn: "দু'আ ও আযকার", ur: 'دعا و اذکار', tr: "Dua ve Zikirler", id: 'Doa & Dzikir' },
  duas_subtitle: {
    en: "Authentic supplications from the Qur'an & Sunnah",
    bn: "কুরআন ও সুন্নাহ থেকে প্রামাণিক দু'আসমূহ",
    ur: 'قرآن و سنت سے مستند دعائیں',
    tr: "Kur'an ve Sünnet'ten sahih dualar",
    id: "Doa autentik dari Qur'an & Sunnah",
  },

  // ── More menu ────────────────────────────────────────────────────────────────
  more_title: { en: 'More', bn: 'আরও', ur: 'مزید', tr: 'Diğer', id: 'Lainnya' },
  more_books: { en: 'Books', bn: 'বই', ur: 'کتب', tr: 'Kitaplar', id: 'Buku' },
  more_books_sub: { en: 'Islamic library', bn: 'ইসলামিক লাইব্রেরি', ur: 'اسلامی لائبریری', tr: 'İslami kütüphane', id: 'Perpustakaan Islam' },
  more_bookmarks: { en: 'Bookmarks', bn: 'বুকমার্ক', ur: 'بک مارکس', tr: 'Yer İşaretleri', id: 'Markah' },
  more_bookmarks_sub: { en: 'Saved ayahs', bn: 'সংরক্ষিত আয়াত', ur: 'محفوظ شدہ آیات', tr: 'Kaydedilen ayetler', id: 'Ayat tersimpan' },
  more_qibla: { en: 'Qibla', bn: 'কিবলা', ur: 'قبلہ', tr: 'Kıble', id: 'Kiblat' },
  more_qibla_sub: { en: 'Compass direction', bn: 'কম্পাস দিক', ur: 'قطب نما کی سمت', tr: 'Pusula yönü', id: 'Arah kompas' },
  more_calendar_sub: { en: 'Hijri & Gregorian', bn: 'হিজরি ও গ্রেগরিয়ান', ur: 'ہجری اور عیسوی', tr: 'Hicri ve Miladi', id: 'Hijriah & Masehi' },
  more_methods_sub: { en: 'Fajr / Isha angles', bn: 'ফজর / ইশার কোণ', ur: 'فجر / عشاء کے زاویے', tr: 'İmsak / Yatsı açıları', id: 'Sudut Subuh / Isya' },
  more_settings_sub: { en: 'Language, theme, notifications', bn: 'ভাষা, থিম, বিজ্ঞপ্তি', ur: 'زبان، تھیم، اطلاعات', tr: 'Dil, tema, bildirimler', id: 'Bahasa, tema, notifikasi' },

  // ── Books ────────────────────────────────────────────────────────────────────
  books_title: { en: 'Books', bn: 'বই', ur: 'کتب', tr: 'Kitaplar', id: 'Buku' },
  books_search: { en: 'Search books, authors…', bn: 'বই, লেখক খুঁজুন…', ur: 'کتابیں، مصنفین تلاش کریں…', tr: 'Kitap, yazar ara…', id: 'Cari buku, penulis…' },
  books_load_error: { en: "Couldn't load books.", bn: 'বই লোড করা যায়নি।', ur: 'کتابیں لوڈ نہیں ہو سکیں۔', tr: 'Kitaplar yüklenemedi.', id: 'Buku tidak dapat dimuat.' },
  books_by: { en: 'by', bn: 'লেখক', ur: 'مصنف', tr: 'yazar:', id: 'oleh' },
  books_read_now: { en: 'Read Now', bn: 'এখনই পড়ুন', ur: 'ابھی پڑھیں', tr: 'Şimdi Oku', id: 'Baca Sekarang' },
  books_translated_by: { en: 'Translated by', bn: 'অনুবাদক', ur: 'مترجم', tr: 'Çeviren', id: 'Diterjemahkan oleh' },
  books_no_content: { en: 'No readable content available.', bn: 'কোনো পঠনযোগ্য বিষয়বস্তু উপলব্ধ নেই।', ur: 'کوئی پڑھنے کے قابل مواد دستیاب نہیں۔', tr: 'Okunabilir içerik yok.', id: 'Tidak ada konten yang dapat dibaca.' },
  books_contents: { en: 'Contents', bn: 'বিষয়সূচি', ur: 'فہرست', tr: 'İçindekiler', id: 'Daftar Isi' },
  books_loading_chapter: { en: 'Loading chapter…', bn: 'অধ্যায় লোড হচ্ছে…', ur: 'باب لوڈ ہو رہا ہے…', tr: 'Bölüm yükleniyor…', id: 'Memuat bab…' },
  books_prev: { en: 'Prev', bn: 'পূর্ববর্তী', ur: 'پچھلا', tr: 'Önceki', id: 'Sebelumnya' },
  books_next: { en: 'Next', bn: 'পরবর্তী', ur: 'اگلا', tr: 'Sonraki', id: 'Berikutnya' },
  books_pages: { en: 'pages', bn: 'পৃষ্ঠা', ur: 'صفحات', tr: 'sayfa', id: 'halaman' },
  books_file_error: {
    en: "This book's file couldn't be loaded. It may have moved or been removed from its source.",
    bn: 'এই বইয়ের ফাইলটি লোড করা যায়নি। এটি সরানো বা এর উৎস থেকে সরিয়ে ফেলা হতে পারে।',
    ur: 'اس کتاب کی فائل لوڈ نہیں ہو سکی۔ یہ منتقل یا ماخذ سے ہٹا دی گئی ہو سکتی ہے۔',
    tr: 'Bu kitabın dosyası yüklenemedi. Kaynağından taşınmış veya kaldırılmış olabilir.',
    id: 'File buku ini tidak dapat dimuat. Mungkin telah dipindahkan atau dihapus dari sumbernya.',
  },

  // ── Qibla ────────────────────────────────────────────────────────────────────
  qibla_title: { en: 'Qibla', bn: 'কিবলা', ur: 'قبلہ', tr: 'Kıble', id: 'Kiblat' },
  qibla_permission_note: {
    en: 'Location permission is needed to determine the Qibla direction.',
    bn: 'কিবলার দিক নির্ধারণ করতে অবস্থানের অনুমতি প্রয়োজন।',
    ur: 'قبلہ کی سمت معلوم کرنے کے لیے مقام کی اجازت درکار ہے۔',
    tr: 'Kıble yönünü belirlemek için konum izni gerekir.',
    id: 'Izin lokasi diperlukan untuk menentukan arah kiblat.',
  },
  qibla_facing: { en: 'Facing the Qibla', bn: 'কিবলামুখী', ur: 'قبلہ رخ', tr: 'Kıbleye dönük', id: 'Menghadap Kiblat' },
  qibla_rotate: { en: 'Rotate to align', bn: 'সারিবদ্ধ করতে ঘোরান', ur: 'ترتیب دینے کے لیے گھمائیں', tr: 'Hizalamak için döndürün', id: 'Putar untuk menyelaraskan' },
  qibla_bearing: { en: 'Qibla bearing', bn: 'কিবলার দিকনির্দেশ', ur: 'قبلہ کی سمت', tr: 'Kıble açısı', id: 'Arah kiblat' },
  qibla_from_north: { en: 'from true north', bn: 'প্রকৃত উত্তর থেকে', ur: 'حقیقی شمال سے', tr: 'gerçek kuzeyden', id: 'dari utara sejati' },
  qibla_calibrating: { en: 'Calibrating compass…', bn: 'কম্পাস ক্যালিব্রেট হচ্ছে…', ur: 'قطب نما کیلیبریٹ ہو رہا ہے…', tr: 'Pusula kalibre ediliyor…', id: 'Mengkalibrasi kompas…' },

  // ── Settings restart notice ──────────────────────────────────────────────────
  settings_restart_title: { en: 'Restart needed', bn: 'রিস্টার্ট প্রয়োজন', ur: 'دوبارہ شروع کرنا ضروری ہے', tr: 'Yeniden başlatma gerekli', id: 'Perlu memulai ulang' },
  settings_restart_note: {
    en: 'Switching to/from a right-to-left language needs an app restart to lay out correctly. Please close and reopen Hidayah.',
    bn: 'ডান-থেকে-বাম ভাষায় স্যুইচ করতে সঠিকভাবে লেআউট করার জন্য অ্যাপ রিস্টার্ট প্রয়োজন। অনুগ্রহ করে হিদায়াহ বন্ধ করে আবার খুলুন।',
    ur: 'دائیں سے بائیں زبان میں تبدیل ہونے کے لیے صحیح ترتیب کے لیے ایپ کو دوبارہ شروع کرنا ضروری ہے۔ براہ کرم ہدایہ بند کر کے دوبارہ کھولیں۔',
    tr: 'Sağdan sola bir dile geçiş yapmak için düzenin doğru görünmesi adına uygulamanın yeniden başlatılması gerekir. Lütfen Hidayah\'ı kapatıp tekrar açın.',
    id: 'Beralih ke/dari bahasa kanan-ke-kiri memerlukan mulai ulang aplikasi agar tata letak benar. Silakan tutup dan buka kembali Hidayah.',
  },
  settings_permission_needed: { en: 'Permission needed', bn: 'অনুমতি প্রয়োজন', ur: 'اجازت درکار ہے', tr: 'İzin gerekli', id: 'Izin diperlukan' },
  settings_permission_note: {
    en: 'Enable notifications in system settings to get prayer reminders.',
    bn: 'নামাজের অনুস্মারক পেতে সিস্টেম সেটিংসে বিজ্ঞপ্তি সক্রিয় করুন।',
    ur: 'نماز کی یاد دہانی حاصل کرنے کے لیے سسٹم کی ترتیبات میں اطلاعات فعال کریں۔',
    tr: 'Namaz hatırlatmaları almak için sistem ayarlarından bildirimleri etkinleştirin.',
    id: 'Aktifkan notifikasi di pengaturan sistem untuk mendapatkan pengingat shalat.',
  },
};

export function tr(key: string, language: LanguageCode = 'en'): string {
  const entry = t[key];
  if (!entry) return key;
  return entry[language] ?? entry.en ?? key;
}

export default t;
