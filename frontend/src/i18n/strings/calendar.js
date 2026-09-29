/**
 * UI strings for the calendar area. Every entry has en, bn, ur, tr, id.
 */
export const calendarStrings = {
  // ── Calendar page ──────────────────────────────────────────────────────────
  cal_subtitle: { en: 'View the prayer times calendar', bn: 'সালাতের সময়ের ক্যালেন্ডার দেখুন', ur: 'نماز کے اوقات کا کیلنڈر دیکھیں', tr: 'Namaz vakitleri takvimini görüntüleyin', id: 'Lihat kalender waktu shalat' },
  cal_view_type: { en: 'View type', bn: 'দেখার ধরন', ur: 'دیکھنے کا انداز', tr: 'Görünüm türü', id: 'Jenis tampilan' },
  cal_view_monthly: { en: 'Monthly', bn: 'মাসিক', ur: 'ماہانہ', tr: 'Aylık', id: 'Bulanan' },
  cal_view_yearly: { en: 'Yearly', bn: 'বার্ষিক', ur: 'سالانہ', tr: 'Yıllık', id: 'Tahunan' },
  cal_view_date_range: { en: 'Date range', bn: 'তারিখ পরিসীমা', ur: 'تاریخوں کی حد', tr: 'Tarih aralığı', id: 'Rentang tanggal' },
  cal_year: { en: 'Year', bn: 'বছর', ur: 'سال', tr: 'Yıl', id: 'Tahun' },
  cal_month: { en: 'Month', bn: 'মাস', ur: 'مہینہ', tr: 'Ay', id: 'Bulan' },
  cal_this_month: { en: 'This month', bn: 'চলতি মাস', ur: 'رواں مہینہ', tr: 'Bu ay', id: 'Bulan ini' },
  cal_prev_month: { en: 'Previous month', bn: 'আগের মাস', ur: 'پچھلا مہینہ', tr: 'Önceki ay', id: 'Bulan sebelumnya' },
  cal_next_month: { en: 'Next month', bn: 'পরের মাস', ur: 'اگلا مہینہ', tr: 'Sonraki ay', id: 'Bulan berikutnya' },
  cal_start_date: { en: 'Start date', bn: 'শুরুর তারিখ', ur: 'آغاز کی تاریخ', tr: 'Başlangıç tarihi', id: 'Tanggal mulai' },
  cal_end_date: { en: 'End date', bn: 'শেষ তারিখ', ur: 'اختتام کی تاریخ', tr: 'Bitiş tarihi', id: 'Tanggal akhir' },

  // ── Calendar views ─────────────────────────────────────────────────────────
  cal_loading: { en: 'Loading calendar…', bn: 'ক্যালেন্ডার লোড হচ্ছে…', ur: 'کیلنڈر لوڈ ہو رہا ہے…', tr: 'Takvim yükleniyor…', id: 'Memuat kalender…' },
  cal_no_data: { en: 'No calendar data available.', bn: 'কোনো ক্যালেন্ডার তথ্য পাওয়া যায়নি।', ur: 'کیلنڈر کا کوئی ڈیٹا دستیاب نہیں۔', tr: 'Takvim verisi bulunamadı.', id: 'Data kalender tidak tersedia.' },
  cal_hijri_year: { en: '{year} AH', bn: '{year} হিজরি', ur: '{year} ہجری', tr: '{year} H.', id: '{year} H' },
  cal_days_count: { en: '{n} days', bn: '{n} দিন', ur: '{n} دن', tr: '{n} gün', id: '{n} hari' },
  cal_days_full_details: { en: '{n} days with full details', bn: 'পূর্ণ বিবরণসহ {n} দিন', ur: 'مکمل تفصیلات کے ساتھ {n} دن', tr: 'Tüm ayrıntılarıyla {n} gün', id: '{n} hari dengan detail lengkap' },
  cal_col_date: { en: 'Date', bn: 'তারিখ', ur: 'تاریخ', tr: 'Tarih', id: 'Tanggal' },

  // ── Export / print ─────────────────────────────────────────────────────────
  cal_download_csv: { en: 'Download CSV', bn: 'CSV ডাউনলোড', ur: 'CSV ڈاؤن لوڈ کریں', tr: 'CSV indir', id: 'Unduh CSV' },
  cal_download_json: { en: 'Download JSON', bn: 'JSON ডাউনলোড', ur: 'JSON ڈاؤن لوڈ کریں', tr: 'JSON indir', id: 'Unduh JSON' },
  cal_download_ical: { en: 'Download iCal', bn: 'iCal ডাউনলোড', ur: 'iCal ڈاؤن لوڈ کریں', tr: 'iCal indir', id: 'Unduh iCal' },
  cal_print: { en: 'Print', bn: 'প্রিন্ট', ur: 'پرنٹ کریں', tr: 'Yazdır', id: 'Cetak' },
  cal_exporting: { en: 'Exporting…', bn: 'রপ্তানি হচ্ছে…', ur: 'ایکسپورٹ ہو رہا ہے…', tr: 'Dışa aktarılıyor…', id: 'Mengekspor…' },
  cal_no_data_export: { en: 'No data to export yet.', bn: 'রপ্তানির জন্য এখনো কোনো তথ্য নেই।', ur: 'ایکسپورٹ کے لیے ابھی کوئی ڈیٹا نہیں۔', tr: 'Henüz dışa aktarılacak veri yok.', id: 'Belum ada data untuk diekspor.' },
  cal_no_data_print: { en: 'No data to print yet.', bn: 'প্রিন্ট করার জন্য এখনো কোনো তথ্য নেই।', ur: 'پرنٹ کے لیے ابھی کوئی ڈیٹا نہیں۔', tr: 'Henüz yazdırılacak veri yok.', id: 'Belum ada data untuk dicetak.' },
  cal_export_failed: { en: "Couldn't export the calendar. Please try again.", bn: 'ক্যালেন্ডার রপ্তানি করা যায়নি। আবার চেষ্টা করুন।', ur: 'کیلنڈر ایکسپورٹ نہیں ہو سکا۔ براہ کرم دوبارہ کوشش کریں۔', tr: 'Takvim dışa aktarılamadı. Lütfen tekrar deneyin.', id: 'Kalender tidak dapat diekspor. Silakan coba lagi.' },
  cal_popup_blocked: { en: 'Please allow pop-ups to print the calendar.', bn: 'ক্যালেন্ডার প্রিন্ট করতে পপ-আপ চালু করুন।', ur: 'کیلنڈر پرنٹ کرنے کے لیے براہ کرم پاپ اپ کی اجازت دیں۔', tr: 'Takvimi yazdırmak için lütfen açılır pencerelere izin verin.', id: 'Izinkan pop-up untuk mencetak kalender.' },
  cal_print_title: { en: 'Prayer times calendar – {location}', bn: 'সালাতের সময়সূচি – {location}', ur: 'نماز کے اوقات کا کیلنڈر – {location}', tr: 'Namaz vakitleri takvimi – {location}', id: 'Kalender waktu shalat – {location}' },
  cal_print_location: { en: 'Location: {location}', bn: 'অবস্থান: {location}', ur: 'مقام: {location}', tr: 'Konum: {location}', id: 'Lokasi: {location}' },
  cal_print_method: { en: 'Method: {method}', bn: 'পদ্ধতি: {method}', ur: 'طریقہ: {method}', tr: 'Yöntem: {method}', id: 'Metode: {method}' },
  cal_print_total_days: { en: 'Total days: {n}', bn: 'মোট দিন: {n}', ur: 'کل دن: {n}', tr: 'Toplam gün: {n}', id: 'Jumlah hari: {n}' },
  cal_not_available: { en: 'N/A', bn: 'প্রযোজ্য নয়', ur: 'دستیاب نہیں', tr: 'Yok', id: 'T/A' },
  cal_ical_prayer_time: { en: '{prayer} prayer time', bn: '{prayer} নামাজের সময়', ur: '{prayer} کی نماز کا وقت', tr: '{prayer} namazı vakti', id: 'Waktu shalat {prayer}' },
  cal_ical_prayer_time_at: { en: '{prayer} prayer time at {location}', bn: '{location}-এ {prayer} নামাজের সময়', ur: '{location} میں {prayer} کی نماز کا وقت', tr: '{location} için {prayer} namazı vakti', id: 'Waktu shalat {prayer} di {location}' },
};
