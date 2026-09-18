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

  nav_masjids: {
    en: 'Masjids',
    bn: 'মসজিদ',
    ur: 'مساجد',
    tr: 'Camiler',
    id: 'Masjid',
  },

  // ── Masjids ──────────────────────────────────────────────────────────────────
  masjids_title: { en: 'Masjids Near You', bn: 'আপনার কাছের মসজিদ', ur: 'آپ کے قریب مساجد', tr: 'Yakınınızdaki Camiler', id: 'Masjid di Sekitar Anda' },
  masjids_subtitle: { en: 'Find nearby masjids and their jamah times — added and kept up to date by the community.', bn: 'কাছাকাছি মসজিদ ও তাদের জামাতের সময় খুঁজুন — কমিউনিটি দ্বারা যুক্ত ও হালনাগাদকৃত।', ur: 'قریبی مساجد اور ان کے جماعت کے اوقات تلاش کریں — کمیونٹی کی جانب سے شامل اور اپ ڈیٹ کردہ۔', tr: 'Yakındaki camileri ve cemaat vakitlerini bulun — topluluk tarafından eklenir ve güncellenir.', id: 'Temukan masjid terdekat dan waktu jamaahnya — ditambahkan dan diperbarui oleh komunitas.' },
  masjids_use_my_location: { en: 'Use my location', bn: 'আমার অবস্থান ব্যবহার করুন', ur: 'میرا مقام استعمال کریں', tr: 'Konumumu kullan', id: 'Gunakan lokasi saya' },
  masjids_locating: { en: 'Locating…', bn: 'অবস্থান খোঁজা হচ্ছে…', ur: 'مقام تلاش کیا جا رہا ہے…', tr: 'Konum bulunuyor…', id: 'Mencari lokasi…' },
  masjids_within: { en: 'Within', bn: 'সীমার মধ্যে', ur: 'کے اندر', tr: 'Mesafe', id: 'Dalam radius' },
  masjids_search_placeholder: { en: 'Search by masjid name or area…', bn: 'মসজিদের নাম বা এলাকা দিয়ে খুঁজুন…', ur: 'مسجد کے نام یا علاقے سے تلاش کریں…', tr: 'Cami adı veya bölge ile ara…', id: 'Cari nama masjid atau area…' },
  masjids_add: { en: 'Add a masjid', bn: 'মসজিদ যোগ করুন', ur: 'مسجد شامل کریں', tr: 'Cami ekle', id: 'Tambah masjid' },
  masjids_none_nearby: { en: 'No masjids found in this radius yet. Try a larger radius, or be the first to add one.', bn: 'এই সীমার মধ্যে এখনো কোনো মসজিদ পাওয়া যায়নি। বড় সীমা চেষ্টা করুন, অথবা প্রথম হয়ে একটি যোগ করুন।', ur: 'اس دائرے میں ابھی کوئی مسجد نہیں ملی۔ بڑا دائرہ آزمائیں، یا پہلے شخص بنیں جو ایک شامل کرے۔', tr: 'Bu mesafede henüz cami bulunamadı. Daha geniş bir mesafe deneyin veya ilk ekleyen siz olun.', id: 'Belum ada masjid dalam radius ini. Coba radius lebih besar, atau jadilah yang pertama menambahkannya.' },
  masjids_none_search: { en: 'No masjids match your search.', bn: 'আপনার অনুসন্ধানের সাথে কোনো মসজিদ মেলেনি।', ur: 'آپ کی تلاش سے کوئی مسجد میل نہیں کھاتی۔', tr: 'Aramanızla eşleşen cami yok.', id: 'Tidak ada masjid yang cocok dengan pencarian Anda.' },
  masjids_load_error: { en: "Couldn't load masjids.", bn: 'মসজিদ লোড করা যায়নি।', ur: 'مساجد لوڈ نہیں ہو سکیں۔', tr: 'Camiler yüklenemedi.', id: 'Tidak dapat memuat masjid.' },
  masjids_away: { en: 'away', bn: 'দূরে', ur: 'دور', tr: 'uzakta', id: 'jauhnya' },
  masjids_geo_error: { en: "Couldn't get your location. Showing results around your saved location instead.", bn: 'আপনার অবস্থান পাওয়া যায়নি। পরিবর্তে সংরক্ষিত অবস্থানের আশেপাশের ফলাফল দেখানো হচ্ছে।', ur: 'آپ کا مقام حاصل نہیں ہو سکا۔ اس کے بجائے محفوظ شدہ مقام کے ارد گرد نتائج دکھائے جا رہے ہیں۔', tr: 'Konumunuz alınamadı. Bunun yerine kayıtlı konumunuzun çevresi gösteriliyor.', id: 'Tidak dapat memperoleh lokasi Anda. Menampilkan hasil di sekitar lokasi tersimpan.' },

  masjid_jamah_times: { en: 'Jamah Times', bn: 'জামাতের সময়', ur: 'جماعت کے اوقات', tr: 'Cemaat Vakitleri', id: 'Waktu Jamaah' },
  masjid_jamah: { en: 'Jamah', bn: 'জামাত', ur: 'جماعت', tr: 'Cemaat', id: 'Jamaah' },
  masjid_adhan: { en: 'Adhan', bn: 'আযান', ur: 'اذان', tr: 'Ezan', id: 'Adzan' },
  masjid_prayer: { en: 'Prayer', bn: 'সালাত', ur: 'نماز', tr: 'Namaz', id: 'Shalat' },
  masjid_jumuah: { en: "Jumu'ah", bn: 'জুমু\'আ', ur: 'جمعہ', tr: 'Cuma', id: 'Jumat' },
  masjid_last_updated: { en: 'Last updated', bn: 'সর্বশেষ হালনাগাদ', ur: 'آخری اپ ڈیٹ', tr: 'Son güncelleme', id: 'Terakhir diperbarui' },
  masjid_added_on: { en: 'Added', bn: 'যোগ করা হয়েছে', ur: 'شامل کیا گیا', tr: 'Eklendi', id: 'Ditambahkan' },
  masjid_no_jamah: { en: 'No jamah times have been added for this masjid yet.', bn: 'এই মসজিদের জন্য এখনো কোনো জামাতের সময় যোগ করা হয়নি।', ur: 'اس مسجد کے لیے ابھی تک جماعت کے اوقات شامل نہیں کیے گئے۔', tr: 'Bu cami için henüz cemaat vakti eklenmedi.', id: 'Belum ada waktu jamaah yang ditambahkan untuk masjid ini.' },
  masjid_update_jamah: { en: 'Update jamah times', bn: 'জামাতের সময় হালনাগাদ করুন', ur: 'جماعت کے اوقات اپ ڈیٹ کریں', tr: 'Cemaat vakitlerini güncelle', id: 'Perbarui waktu jamaah' },
  masjid_add_jamah: { en: 'Add jamah times', bn: 'জামাতের সময় যোগ করুন', ur: 'جماعت کے اوقات شامل کریں', tr: 'Cemaat vakti ekle', id: 'Tambah waktu jamaah' },
  masjid_jamah_hint: { en: 'Leave a field blank to clear it. Times are 24-hour local time.', bn: 'কোনো ঘর মুছে ফেলতে ফাঁকা রাখুন। সময় ২৪-ঘণ্টা স্থানীয় সময়ে।', ur: 'کسی خانے کو صاف کرنے کے لیے خالی چھوڑ دیں۔ اوقات 24 گھنٹے کے مقامی وقت میں ہیں۔', tr: 'Bir alanı temizlemek için boş bırakın. Saatler 24 saatlik yerel saattir.', id: 'Kosongkan kolom untuk menghapusnya. Waktu dalam format 24 jam waktu setempat.' },
  masjid_save: { en: 'Save', bn: 'সংরক্ষণ করুন', ur: 'محفوظ کریں', tr: 'Kaydet', id: 'Simpan' },
  masjid_saving: { en: 'Saving…', bn: 'সংরক্ষণ হচ্ছে…', ur: 'محفوظ ہو رہا ہے…', tr: 'Kaydediliyor…', id: 'Menyimpan…' },
  masjid_saved: { en: 'Jamah times updated. Jazakallah khair!', bn: 'জামাতের সময় হালনাগাদ হয়েছে। জাযাকাল্লাহ খাইর!', ur: 'جماعت کے اوقات اپ ڈیٹ ہو گئے۔ جزاک اللہ خیر!', tr: 'Cemaat vakitleri güncellendi. Allah razı olsun!', id: 'Waktu jamaah diperbarui. Jazakallah khair!' },
  masjid_directions: { en: 'Directions', bn: 'দিকনির্দেশনা', ur: 'راستہ', tr: 'Yol tarifi', id: 'Petunjuk arah' },
  masjid_open_in_maps: { en: 'Open in Google Maps', bn: 'গুগল ম্যাপে খুলুন', ur: 'گوگل میپس میں کھولیں', tr: "Google Haritalar'da aç", id: 'Buka di Google Maps' },
  masjid_not_found: { en: 'Masjid not found.', bn: 'মসজিদ পাওয়া যায়নি।', ur: 'مسجد نہیں ملی۔', tr: 'Cami bulunamadı.', id: 'Masjid tidak ditemukan.' },
  masjid_back_to_list: { en: 'Back to masjids', bn: 'মসজিদ তালিকায় ফিরুন', ur: 'مساجد کی فہرست پر واپس', tr: 'Camilere dön', id: 'Kembali ke daftar masjid' },
  masjid_today_adhan_note: { en: "Adhan times are calculated for this masjid's coordinates using your selected method.", bn: 'আযানের সময় আপনার নির্বাচিত পদ্ধতি অনুযায়ী এই মসজিদের স্থানাঙ্কের জন্য গণনা করা।', ur: 'اذان کے اوقات آپ کے منتخب کردہ طریقہ کے مطابق اس مسجد کے محل وقوع کے لیے شمار کیے گئے ہیں۔', tr: 'Ezan vakitleri, seçtiğiniz yönteme göre bu caminin koordinatları için hesaplanmıştır.', id: 'Waktu adzan dihitung untuk koordinat masjid ini menggunakan metode yang Anda pilih.' },

  masjid_new_title: { en: 'Add a Masjid', bn: 'মসজিদ যোগ করুন', ur: 'مسجد شامل کریں', tr: 'Cami Ekle', id: 'Tambah Masjid' },
  masjid_new_subtitle: { en: 'Help others find this masjid. Tap the map or use your location to set the exact spot.', bn: 'অন্যদের এই মসজিদ খুঁজে পেতে সাহায্য করুন। সঠিক স্থান নির্ধারণে মানচিত্রে ট্যাপ করুন বা আপনার অবস্থান ব্যবহার করুন।', ur: 'دوسروں کو یہ مسجد تلاش کرنے میں مدد کریں۔ صحیح جگہ متعین کرنے کے لیے نقشے پر ٹیپ کریں یا اپنا مقام استعمال کریں۔', tr: 'Başkalarının bu camiyi bulmasına yardım edin. Tam konumu belirlemek için haritaya dokunun veya konumunuzu kullanın.', id: 'Bantu orang lain menemukan masjid ini. Ketuk peta atau gunakan lokasi Anda untuk menandai titik yang tepat.' },
  masjid_field_name: { en: 'Masjid name', bn: 'মসজিদের নাম', ur: 'مسجد کا نام', tr: 'Cami adı', id: 'Nama masjid' },
  masjid_field_name_bn: { en: 'Name in Bangla', bn: 'বাংলায় নাম', ur: 'بنگالی میں نام', tr: 'Bengalce adı', id: 'Nama dalam bahasa Bengali' },
  masjid_field_address: { en: 'Address / landmark', bn: 'ঠিকানা / ল্যান্ডমার্ক', ur: 'پتہ / نشانی', tr: 'Adres / işaret noktası', id: 'Alamat / penanda' },
  masjid_field_city: { en: 'City / area', bn: 'শহর / এলাকা', ur: 'شہر / علاقہ', tr: 'Şehir / bölge', id: 'Kota / area' },
  masjid_field_district: { en: 'District', bn: 'জেলা', ur: 'ضلع', tr: 'İlçe', id: 'Kabupaten' },
  masjid_field_phone: { en: 'Phone (optional)', bn: 'ফোন (ঐচ্ছিক)', ur: 'فون (اختیاری)', tr: 'Telefon (isteğe bağlı)', id: 'Telepon (opsional)' },
  masjid_field_description: { en: 'Notes (optional)', bn: 'নোট (ঐচ্ছিক)', ur: 'نوٹس (اختیاری)', tr: 'Notlar (isteğe bağlı)', id: 'Catatan (opsional)' },
  masjid_field_coords: { en: 'Location', bn: 'অবস্থান', ur: 'مقام', tr: 'Konum', id: 'Lokasi' },
  masjid_coords_hint: { en: 'Click the map to place the pin, or enter coordinates.', bn: 'পিন বসাতে মানচিত্রে ক্লিক করুন, অথবা স্থানাঙ্ক লিখুন।', ur: 'پن رکھنے کے لیے نقشے پر کلک کریں، یا محل وقوع درج کریں۔', tr: 'İşareti yerleştirmek için haritaya tıklayın veya koordinat girin.', id: 'Klik peta untuk meletakkan pin, atau masukkan koordinat.' },
  masjid_coords_required: { en: 'Please set the masjid location on the map.', bn: 'অনুগ্রহ করে মানচিত্রে মসজিদের অবস্থান নির্ধারণ করুন।', ur: 'براہ کرم نقشے پر مسجد کا مقام متعین کریں۔', tr: 'Lütfen haritada caminin konumunu belirleyin.', id: 'Silakan tentukan lokasi masjid di peta.' },
  masjid_jamah_optional: { en: 'Jamah times (optional — you can add these later)', bn: 'জামাতের সময় (ঐচ্ছিক — পরে যোগ করতে পারবেন)', ur: 'جماعت کے اوقات (اختیاری — آپ بعد میں شامل کر سکتے ہیں)', tr: 'Cemaat vakitleri (isteğe bağlı — daha sonra ekleyebilirsiniz)', id: 'Waktu jamaah (opsional — bisa ditambahkan nanti)' },
  masjid_submit: { en: 'Add masjid', bn: 'মসজিদ যোগ করুন', ur: 'مسجد شامل کریں', tr: 'Cami ekle', id: 'Tambah masjid' },
  masjid_submitting: { en: 'Adding…', bn: 'যোগ হচ্ছে…', ur: 'شامل کیا جا رہا ہے…', tr: 'Ekleniyor…', id: 'Menambahkan…' },
  masjid_nearby_link: { en: 'Nearby masjids', bn: 'কাছের মসজিদ', ur: 'قریبی مساجد', tr: 'Yakındaki camiler', id: 'Masjid terdekat' },
  masjid_nearby_link_sub: { en: 'Find masjids around you and see their jamah times.', bn: 'আপনার আশেপাশের মসজিদ খুঁজুন এবং জামাতের সময় দেখুন।', ur: 'اپنے آس پاس مساجد تلاش کریں اور ان کے جماعت کے اوقات دیکھیں۔', tr: 'Çevrenizdeki camileri bulun ve cemaat vakitlerini görün.', id: 'Temukan masjid di sekitar Anda dan lihat waktu jamaahnya.' },

  // ── Du'as ────────────────────────────────────────────────────────────────────
  dua_virtue: { en: 'Virtue', bn: 'ফজিলত', ur: 'فضیلت', tr: 'Fazilet', id: 'Keutamaan' },

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
