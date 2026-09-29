/**
 * UI strings for the quranReader area. Every entry has en, bn, ur, tr, id.
 */
export const quranReaderStrings = {
  // Page / top bar
  qr_invalid_surah: { en: 'Invalid surah number', bn: 'সূরা নম্বরটি সঠিক নয়', ur: 'سورہ نمبر درست نہیں', tr: 'Geçersiz sure numarası', id: 'Nomor surah tidak valid' },
  qr_back_to_quran: { en: 'Back to Qur\'an', bn: 'কুরআনে ফিরে যান', ur: 'قرآن پر واپس جائیں', tr: 'Kur\'an\'a dön', id: 'Kembali ke Al-Qur\'an' },
  qr_back: { en: 'Back', bn: 'পেছনে', ur: 'واپس', tr: 'Geri', id: 'Kembali' },
  qr_reader_settings: { en: 'Reader settings', bn: 'পাঠ সেটিংস', ur: 'ریڈر کی ترتیبات', tr: 'Okuma ayarları', id: 'Pengaturan pembaca' },
  qr_keyboard_hint: { en: 'Keyboard: ↑↓ navigate · Space play · M reveal · Esc stop', bn: 'কীবোর্ড: ↑↓ আয়াত বদলান · Space চালান · M প্রকাশ করুন · Esc থামান', ur: 'کی بورڈ: ↑↓ آیات بدلیں · Space چلائیں · M ظاہر کریں · Esc روکیں', tr: 'Klavye: ↑↓ gezin · Space oynat · M göster · Esc durdur', id: 'Keyboard: ↑↓ navigasi · Space putar · M tampilkan · Esc berhenti' },
  qr_surah_n: { en: 'Surah {n}', bn: 'সূরা {n}', ur: 'سورہ {n}', tr: 'Sure {n}', id: 'Surah {n}' },
  qr_ayah_n: { en: 'Ayah {n}', bn: 'আয়াত {n}', ur: 'آیت {n}', tr: 'Ayet {n}', id: 'Ayat {n}' },
  qr_ayah_count: { en: '{n} ayahs', bn: '{n} আয়াত', ur: '{n} آیات', tr: '{n} ayet', id: '{n} ayat' },
  qr_meccan: { en: 'Meccan', bn: 'মাক্কী', ur: 'مکی', tr: 'Mekki', id: 'Makkiyah' },
  qr_medinan: { en: 'Medinan', bn: 'মাদানী', ur: 'مدنی', tr: 'Medeni', id: 'Madaniyah' },
  qr_bismillah: { en: 'Bismillah', bn: 'বিসমিল্লাহ', ur: 'بسم اللہ', tr: 'Besmele', id: 'Basmalah' },
  qr_jump_placeholder: { en: 'Jump to ayah…', bn: 'আয়াত নম্বর…', ur: 'آیت نمبر پر جائیں…', tr: 'Ayete git…', id: 'Lompat ke ayat…' },
  qr_go: { en: 'Go', bn: 'যান', ur: 'جائیں', tr: 'Git', id: 'Buka' },

  // Active mode badges
  qr_word_by_word: { en: 'Word by Word', bn: 'শব্দে শব্দে', ur: 'لفظ بہ لفظ', tr: 'Kelime kelime', id: 'Per kata' },
  qr_transliteration: { en: 'Transliteration', bn: 'প্রতিবর্ণীকরণ', ur: 'رومن تلفظ', tr: 'Transliterasyon', id: 'Transliterasi' },
  qr_tafsir: { en: 'Tafsir', bn: 'তাফসির', ur: 'تفسیر', tr: 'Tefsir', id: 'Tafsir' },
  qr_memorisation: { en: 'Memorisation', bn: 'মুখস্থ মোড', ur: 'حفظ موڈ', tr: 'Ezber modu', id: 'Mode hafalan' },
  qr_selection_mode: { en: 'Selection mode', bn: 'নির্বাচন মোড', ur: 'انتخاب موڈ', tr: 'Seçim modu', id: 'Mode pilih' },

  // Range selection bar
  qr_selected_one: { en: '{n} ayah selected', bn: '{n}টি আয়াত নির্বাচিত', ur: '{n} آیت منتخب', tr: '{n} ayet seçildi', id: '{n} ayat dipilih' },
  qr_selected_many: { en: '{n} ayahs selected', bn: '{n}টি আয়াত নির্বাচিত', ur: '{n} آیات منتخب', tr: '{n} ayet seçildi', id: '{n} ayat dipilih' },
  qr_select_all: { en: 'Select all', bn: 'সব নির্বাচন', ur: 'سب منتخب کریں', tr: 'Tümünü seç', id: 'Pilih semua' },
  qr_copy_range: { en: 'Copy range', bn: 'কপি করুন', ur: 'منتخب آیات کاپی کریں', tr: 'Seçileni kopyala', id: 'Salin pilihan' },
  qr_share_range: { en: 'Share range', bn: 'শেয়ার করুন', ur: 'منتخب آیات شیئر کریں', tr: 'Seçileni paylaş', id: 'Bagikan pilihan' },
  qr_copied: { en: 'Copied!', bn: 'কপি হয়েছে!', ur: 'کاپی ہو گیا!', tr: 'Kopyalandı!', id: 'Disalin!' },
  qr_copy_failed: { en: 'Couldn\'t copy', bn: 'কপি করা যায়নি', ur: 'کاپی نہیں ہو سکا', tr: 'Kopyalanamadı', id: 'Gagal menyalin' },
  qr_link_copied: { en: 'Link copied!', bn: 'লিংক কপি হয়েছে!', ur: 'لنک کاپی ہو گیا!', tr: 'Bağlantı kopyalandı!', id: 'Tautan disalin!' },

  // Ayah row
  qr_bookmark: { en: 'Bookmark', bn: 'বুকমার্ক করুন', ur: 'بک مارک کریں', tr: 'Yer imi ekle', id: 'Tandai' },
  qr_remove_bookmark: { en: 'Remove bookmark', bn: 'বুকমার্ক সরান', ur: 'بک مارک ہٹائیں', tr: 'Yer imini kaldır', id: 'Hapus tanda' },
  qr_bookmark_ayah: { en: 'Bookmark ayah {n}', bn: 'আয়াত {n} বুকমার্ক করুন', ur: 'آیت {n} بک مارک کریں', tr: '{n}. ayeti yer imlerine ekle', id: 'Tandai ayat {n}' },
  qr_remove_bookmark_ayah: { en: 'Remove bookmark for ayah {n}', bn: 'আয়াত {n}-এর বুকমার্ক সরান', ur: 'آیت {n} کا بک مارک ہٹائیں', tr: '{n}. ayetin yer imini kaldır', id: 'Hapus tanda ayat {n}' },
  qr_pause: { en: 'Pause', bn: 'বিরতি', ur: 'روکیں', tr: 'Duraklat', id: 'Jeda' },
  qr_play_ayah: { en: 'Play ayah {n}', bn: 'আয়াত {n} চালান', ur: 'آیت {n} چلائیں', tr: '{n}. ayeti oynat', id: 'Putar ayat {n}' },
  qr_pause_ayah: { en: 'Pause ayah {n}', bn: 'আয়াত {n} বিরতি দিন', ur: 'آیت {n} روکیں', tr: '{n}. ayeti duraklat', id: 'Jeda ayat {n}' },
  qr_copy_ayah: { en: 'Copy ayah {n}', bn: 'আয়াত {n} কপি করুন', ur: 'آیت {n} کاپی کریں', tr: '{n}. ayeti kopyala', id: 'Salin ayat {n}' },
  qr_share_ayah: { en: 'Share ayah {n}', bn: 'আয়াত {n} শেয়ার করুন', ur: 'آیت {n} شیئر کریں', tr: '{n}. ayeti paylaş', id: 'Bagikan ayat {n}' },
  qr_select_ayah: { en: 'Select ayah {n}', bn: 'আয়াত {n} নির্বাচন করুন', ur: 'آیت {n} منتخب کریں', tr: '{n}. ayeti seç', id: 'Pilih ayat {n}' },
  qr_reveal_ayah: { en: 'Reveal ayah {n}', bn: 'আয়াত {n} প্রকাশ করুন', ur: 'آیت {n} ظاہر کریں', tr: '{n}. ayeti göster', id: 'Tampilkan ayat {n}' },
  qr_image_card: { en: 'Image card', bn: 'ছবি কার্ড', ur: 'تصویری کارڈ', tr: 'Görsel kart', id: 'Kartu gambar' },
  qr_image_card_ayah: { en: 'Create image card for ayah {n}', bn: 'আয়াত {n}-এর ছবি কার্ড তৈরি করুন', ur: 'آیت {n} کا تصویری کارڈ بنائیں', tr: '{n}. ayet için görsel kart oluştur', id: 'Buat kartu gambar untuk ayat {n}' },
  qr_gloss_unavailable: { en: 'Meaning unavailable', bn: 'অর্থ পাওয়া যায়নি', ur: 'معنی دستیاب نہیں', tr: 'Anlamı bulunamadı', id: 'Arti tidak tersedia' },
  qr_close: { en: 'Close', bn: 'বন্ধ করুন', ur: 'بند کریں', tr: 'Kapat', id: 'Tutup' },

  // Settings drawer
  qr_tab_display: { en: 'Display', bn: 'প্রদর্শন', ur: 'ڈسپلے', tr: 'Görünüm', id: 'Tampilan' },
  qr_tab_translations: { en: 'Translations', bn: 'অনুবাদ', ur: 'تراجم', tr: 'Mealler', id: 'Terjemahan' },
  qr_tab_audio: { en: 'Audio', bn: 'অডিও', ur: 'آڈیو', tr: 'Ses', id: 'Audio' },
  qr_font_size: { en: 'Font size', bn: 'ফন্ট সাইজ', ur: 'فونٹ سائز', tr: 'Yazı boyutu', id: 'Ukuran huruf' },
  qr_font_sm: { en: 'Small', bn: 'ছোট', ur: 'چھوٹا', tr: 'Küçük', id: 'Kecil' },
  qr_font_md: { en: 'Medium', bn: 'মাঝারি', ur: 'درمیانہ', tr: 'Orta', id: 'Sedang' },
  qr_font_lg: { en: 'Large', bn: 'বড়', ur: 'بڑا', tr: 'Büyük', id: 'Besar' },
  qr_font_xl: { en: 'X-Large', bn: 'খুব বড়', ur: 'بہت بڑا', tr: 'Çok büyük', id: 'Sangat besar' },
  qr_show_translation: { en: 'Show translation', bn: 'অনুবাদ দেখান', ur: 'ترجمہ دکھائیں', tr: 'Meali göster', id: 'Tampilkan terjemahan' },
  qr_transliteration_desc: { en: 'Show romanised pronunciation', bn: 'রোমান হরফে উচ্চারণ দেখুন', ur: 'رومن حروف میں تلفظ دکھائیں', tr: 'Latin harfleriyle okunuşu göster', id: 'Tampilkan cara baca dalam huruf Latin' },
  qr_word_by_word_desc: { en: 'Tap each Arabic word to see its meaning', bn: 'অর্থ দেখতে প্রতিটি আরবি শব্দে ট্যাপ করুন', ur: 'معنی دیکھنے کے لیے ہر عربی لفظ پر ٹیپ کریں', tr: 'Anlamını görmek için her Arapça kelimeye dokunun', id: 'Ketuk setiap kata Arab untuk melihat artinya' },
  qr_tafsir_desc: { en: 'Show expandable tafsir for each ayah', bn: 'প্রতিটি আয়াতের তাফসির পড়ুন', ur: 'ہر آیت کی تفسیر دکھائیں', tr: 'Her ayet için açılır tefsir göster', id: 'Tampilkan tafsir untuk setiap ayat' },
  qr_memorisation_mode: { en: 'Memorisation mode', bn: 'মুখস্থ মোড', ur: 'حفظ موڈ', tr: 'Ezber modu', id: 'Mode hafalan' },
  qr_memorisation_desc: { en: 'Hide the Arabic text, tap to reveal each ayah', bn: 'আরবি লুকিয়ে রাখুন, ট্যাপ করে প্রকাশ করুন', ur: 'عربی متن چھپائیں، ہر آیت ظاہر کرنے کے لیے ٹیپ کریں', tr: 'Arapça metni gizle, her ayeti görmek için dokun', id: 'Sembunyikan teks Arab, ketuk untuk menampilkan tiap ayat' },
  qr_repeat_each: { en: 'Repeat each ayah', bn: 'প্রতিটি আয়াতের পুনরাবৃত্তি', ur: 'ہر آیت دہرائیں', tr: 'Her ayeti tekrarla', id: 'Ulangi setiap ayat' },
  qr_decrease: { en: 'Decrease', bn: 'কমান', ur: 'کم کریں', tr: 'Azalt', id: 'Kurangi' },
  qr_increase: { en: 'Increase', bn: 'বাড়ান', ur: 'بڑھائیں', tr: 'Artır', id: 'Tambah' },
  qr_select_one_translation: { en: 'Select at least one translation', bn: 'কমপক্ষে একটি অনুবাদ নির্বাচন করুন', ur: 'کم از کم ایک ترجمہ منتخب کریں', tr: 'En az bir meal seçin', id: 'Pilih minimal satu terjemahan' },
  qr_reset: { en: 'Reset', bn: 'ডিফল্ট', ur: 'ری سیٹ', tr: 'Sıfırla', id: 'Atur ulang' },
  qr_your_language: { en: 'Your language', bn: 'আপনার ভাষা', ur: 'آپ کی زبان', tr: 'Diliniz', id: 'Bahasa Anda' },
  qr_reciter: { en: 'Reciter', bn: 'কারী', ur: 'قاری', tr: 'Kari', id: 'Qari' },

  // Tafsir
  qr_tafsir_ibn_kathir: { en: 'Ibn Kathir (English)', bn: 'ইবনে কাসীর (ইংরেজি)', ur: 'ابن کثیر (انگریزی)', tr: 'İbn Kesîr (İngilizce)', id: 'Ibnu Katsir (Inggris)' },
  qr_tafsir_maariful: { en: 'Maariful Quran (English)', bn: 'মাআরিফুল কুরআন (ইংরেজি)', ur: 'معارف القرآن (انگریزی)', tr: 'Meâriful Kur\'an (İngilizce)', id: 'Ma\'ariful Qur\'an (Inggris)' },
  qr_tafsir_zakaria: { en: 'Abu Bakr Zakaria (Bangla)', bn: 'আবু বকর জাকারিয়া (বাংলা)', ur: 'ابوبکر زکریا (بنگالی)', tr: 'Ebû Bekir Zekeriyyâ (Bengalce)', id: 'Abu Bakr Zakaria (Bengali)' },
  qr_tafsir_loading: { en: 'Loading tafsir…', bn: 'তাফসির লোড হচ্ছে…', ur: 'تفسیر لوڈ ہو رہی ہے…', tr: 'Tefsir yükleniyor…', id: 'Memuat tafsir…' },
  qr_tafsir_empty: { en: 'No tafsir is available for this ayah.', bn: 'এই আয়াতের তাফসির পাওয়া যায়নি।', ur: 'اس آیت کی تفسیر دستیاب نہیں۔', tr: 'Bu ayet için tefsir bulunamadı.', id: 'Tafsir untuk ayat ini tidak tersedia.' },

  // Audio player
  qr_playback_speed: { en: 'Playback speed', bn: 'প্লেব্যাক গতি', ur: 'پلے بیک کی رفتار', tr: 'Oynatma hızı', id: 'Kecepatan putar' },
  qr_sleep_timer: { en: 'Sleep timer', bn: 'স্লিপ টাইমার', ur: 'سلیپ ٹائمر', tr: 'Uyku zamanlayıcısı', id: 'Timer tidur' },
  qr_close_player: { en: 'Close player', bn: 'প্লেয়ার বন্ধ করুন', ur: 'پلیئر بند کریں', tr: 'Oynatıcıyı kapat', id: 'Tutup pemutar' },
  qr_seek: { en: 'Seek', bn: 'অবস্থান বদলান', ur: 'آگے پیچھے کریں', tr: 'Konum', id: 'Geser posisi' },
  qr_prev_ayah: { en: 'Previous ayah', bn: 'আগের আয়াত', ur: 'پچھلی آیت', tr: 'Önceki ayet', id: 'Ayat sebelumnya' },
  qr_next_ayah: { en: 'Next ayah', bn: 'পরের আয়াত', ur: 'اگلی آیت', tr: 'Sonraki ayet', id: 'Ayat berikutnya' },
};
