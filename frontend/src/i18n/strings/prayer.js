/**
 * UI strings for the prayer area. Every entry has en, bn, ur, tr, id.
 */
export const prayerStrings = {
  // ── Prayer times page ───────────────────────────────────────────────────────
  pr_title: { en: 'Prayer Times', bn: 'সালাতের সময়', ur: 'نماز کے اوقات', tr: 'Namaz Vakitleri', id: 'Waktu Shalat' },
  pr_subtitle: {
    en: 'Select a location and date to view prayer times',
    bn: 'অবস্থান এবং তারিখ নির্বাচন করুন',
    ur: 'نماز کے اوقات دیکھنے کے لیے مقام اور تاریخ منتخب کریں',
    tr: 'Namaz vakitlerini görmek için konum ve tarih seçin',
    id: 'Pilih lokasi dan tanggal untuk melihat waktu shalat',
  },
  pr_calendar_card_title: { en: 'View by month or date range', bn: 'মাসিক বা তারিখ অনুযায়ী দেখুন', ur: 'مہینے یا تاریخوں کی حد کے مطابق دیکھیں', tr: 'Aya veya tarih aralığına göre görüntüle', id: 'Lihat per bulan atau rentang tanggal' },
  pr_calendar_card_body: {
    en: 'To see prayer times for a full month or a custom date range, open the calendar view.',
    bn: 'সম্পূর্ণ মাস বা নির্দিষ্ট তারিখ পরিসীমার সালাতের সময় ক্যালেন্ডার আকারে দেখতে ক্যালেন্ডার পেজে যান।',
    ur: 'پورے مہینے یا منتخب تاریخوں کے نماز کے اوقات دیکھنے کے لیے کیلنڈر کھولیں۔',
    tr: 'Bir ayın tamamı veya belirli bir tarih aralığı için namaz vakitlerini görmek üzere takvimi açın.',
    id: 'Untuk melihat waktu shalat selama sebulan penuh atau rentang tanggal tertentu, buka tampilan kalender.',
  },
  pr_this_month_calendar: { en: "This month's calendar", bn: 'এই মাসের ক্যালেন্ডার', ur: 'اس مہینے کا کیلنڈر', tr: 'Bu ayın takvimi', id: 'Kalender bulan ini' },
  pr_calendar_for_date: { en: 'Calendar for this date', bn: 'এই তারিখের জন্য ক্যালেন্ডার', ur: 'اس تاریخ کا کیلنڈر', tr: 'Bu tarihin takvimi', id: 'Kalender untuk tanggal ini' },
  pr_select_date: { en: 'Select date', bn: 'তারিখ নির্বাচন করুন', ur: 'تاریخ منتخب کریں', tr: 'Tarih seçin', id: 'Pilih tanggal' },
  pr_use_current_location: { en: 'Use current location', bn: 'বর্তমান অবস্থান ব্যবহার করুন', ur: 'موجودہ مقام استعمال کریں', tr: 'Mevcut konumu kullan', id: 'Gunakan lokasi saat ini' },
  pr_getting_location: { en: 'Getting location…', bn: 'অবস্থান পাওয়া হচ্ছে…', ur: 'مقام حاصل کیا جا رہا ہے…', tr: 'Konum alınıyor…', id: 'Mendapatkan lokasi…' },
  pr_today_times: { en: "Today's prayer times", bn: 'আজকের সালাতের সময়', ur: 'آج کے نماز کے اوقات', tr: 'Bugünün namaz vakitleri', id: 'Waktu shalat hari ini' },
  pr_time_remaining: { en: 'Time remaining', bn: 'সময় বাকি', ur: 'باقی وقت', tr: 'Kalan süre', id: 'Sisa waktu' },
  pr_hijri_era: { en: 'AH', bn: 'হিজরি', ur: 'ہجری', tr: 'H.', id: 'H' },

  // ── Location search / geolocation ───────────────────────────────────────────
  pr_search_location: { en: 'Search location…', bn: 'অবস্থান খুঁজুন…', ur: 'مقام تلاش کریں…', tr: 'Konum ara…', id: 'Cari lokasi…' },
  pr_no_results: { en: 'No results found', bn: 'কোনো ফলাফল পাওয়া যায়নি', ur: 'کوئی نتیجہ نہیں ملا', tr: 'Sonuç bulunamadı', id: 'Tidak ada hasil' },
  pr_loc_search_failed: {
    en: "Couldn't search locations. Please try again.",
    bn: 'অবস্থান খোঁজা যায়নি। আবার চেষ্টা করুন।',
    ur: 'مقامات تلاش نہیں ہو سکے۔ براہ کرم دوبارہ کوشش کریں۔',
    tr: 'Konumlar aranamadı. Lütfen tekrar deneyin.',
    id: 'Tidak dapat mencari lokasi. Silakan coba lagi.',
  },
  pr_loc_lookup_failed: {
    en: "Couldn't get details for this location.",
    bn: 'এই অবস্থানের তথ্য পাওয়া যায়নি।',
    ur: 'اس مقام کی تفصیلات حاصل نہیں ہو سکیں۔',
    tr: 'Bu konumun bilgileri alınamadı.',
    id: 'Tidak dapat memperoleh detail lokasi ini.',
  },
  pr_loc_outside_bd: {
    en: 'Please choose a location inside Bangladesh.',
    bn: 'অনুগ্রহ করে বাংলাদেশের ভেতরে একটি অবস্থান নির্বাচন করুন।',
    ur: 'براہ کرم بنگلہ دیش کے اندر کوئی مقام منتخب کریں۔',
    tr: 'Lütfen Bangladeş içinde bir konum seçin.',
    id: 'Silakan pilih lokasi di dalam Bangladesh.',
  },
  pr_geo_unsupported: {
    en: "Your browser doesn't support location access.",
    bn: 'আপনার ব্রাউজারে অবস্থান শনাক্তকরণ সমর্থিত নয়।',
    ur: 'آپ کا براؤزر مقام تک رسائی کی سہولت نہیں دیتا۔',
    tr: 'Tarayıcınız konum erişimini desteklemiyor.',
    id: 'Browser Anda tidak mendukung akses lokasi.',
  },
  pr_geo_failed: {
    en: "Couldn't get your current location. Check the location permission and try again.",
    bn: 'আপনার বর্তমান অবস্থান পাওয়া যায়নি। লোকেশন অনুমতি দেখে আবার চেষ্টা করুন।',
    ur: 'آپ کا موجودہ مقام حاصل نہیں ہو سکا۔ مقام کی اجازت چیک کر کے دوبارہ کوشش کریں۔',
    tr: 'Mevcut konumunuz alınamadı. Konum iznini kontrol edip tekrar deneyin.',
    id: 'Tidak dapat memperoleh lokasi Anda saat ini. Periksa izin lokasi lalu coba lagi.',
  },
  pr_you_are_here: { en: 'You are here', bn: 'আপনি এখানে', ur: 'آپ یہاں ہیں', tr: 'Buradasınız', id: 'Anda di sini' },
  pr_latitude: { en: 'Latitude', bn: 'অক্ষাংশ', ur: 'عرض بلد', tr: 'Enlem', id: 'Lintang' },
  pr_longitude: { en: 'Longitude', bn: 'দ্রাঘিমাংশ', ur: 'طول بلد', tr: 'Boylam', id: 'Bujur' },

  // ── Masjids ─────────────────────────────────────────────────────────────────
  pr_distance_km: { en: '{n} km', bn: '{n} কিমি', ur: '{n} کلومیٹر', tr: '{n} km', id: '{n} km' },
  pr_distance_m: { en: '{n} m', bn: '{n} মিটার', ur: '{n} میٹر', tr: '{n} m', id: '{n} m' },
  pr_jamah_delay: { en: '+{n} min', bn: '+{n} মিনিট', ur: '+{n} منٹ', tr: '+{n} dk', id: '+{n} mnt' },
};
