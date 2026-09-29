/**
 * Shared UI strings: errors, loading states, generic actions, time-format setting.
 * Every entry has en, bn, ur, tr, id.
 */
export const commonStrings = {
  // ── Errors ───────────────────────────────────────────────────────────────────
  error_title: { en: 'Something went wrong', bn: 'সমস্যা হয়েছে', ur: 'کچھ غلط ہو گیا', tr: 'Bir sorun oluştu', id: 'Terjadi masalah' },
  error_network: {
    en: 'No internet connection. Check your connection and try again.',
    bn: 'ইন্টারনেট সংযোগ নেই। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
    ur: 'انٹرنیٹ کنکشن نہیں ہے۔ اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔',
    tr: 'İnternet bağlantısı yok. Bağlantınızı kontrol edip tekrar deneyin.',
    id: 'Tidak ada koneksi internet. Periksa koneksi Anda lalu coba lagi.',
  },
  error_not_found: { en: 'Not found.', bn: 'পাওয়া যায়নি।', ur: 'نہیں ملا۔', tr: 'Bulunamadı.', id: 'Tidak ditemukan.' },
  error_server: {
    en: 'The service is temporarily unavailable. Please try again shortly.',
    bn: 'সেবাটি সাময়িকভাবে বন্ধ আছে। একটু পরে আবার চেষ্টা করুন।',
    ur: 'سروس عارضی طور پر دستیاب نہیں ہے۔ براہ کرم تھوڑی دیر بعد دوبارہ کوشش کریں۔',
    tr: 'Hizmet geçici olarak kullanılamıyor. Lütfen birazdan tekrar deneyin.',
    id: 'Layanan sedang tidak tersedia untuk sementara. Silakan coba lagi sebentar lagi.',
  },
  error_invalid: {
    en: 'Some of the information looks invalid. Please check it and try again.',
    bn: 'কিছু তথ্য সঠিক নয়। পরীক্ষা করে আবার চেষ্টা করুন।',
    ur: 'کچھ معلومات درست نہیں لگتیں۔ براہ کرم جانچ کر دوبارہ کوشش کریں۔',
    tr: 'Bazı bilgiler geçersiz görünüyor. Lütfen kontrol edip tekrar deneyin.',
    id: 'Beberapa informasi tampaknya tidak valid. Periksa lalu coba lagi.',
  },
  error_auth: {
    en: 'Please sign in again to continue.',
    bn: 'চালিয়ে যেতে আবার সাইন ইন করুন।',
    ur: 'جاری رکھنے کے لیے براہ کرم دوبارہ سائن ان کریں۔',
    tr: 'Devam etmek için lütfen tekrar giriş yapın.',
    id: 'Silakan masuk lagi untuk melanjutkan.',
  },
  error_rate_limited: {
    en: 'Too many requests. Please wait a moment and try again.',
    bn: 'অনেক বেশি অনুরোধ। কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।',
    ur: 'بہت زیادہ درخواستیں۔ براہ کرم تھوڑا انتظار کر کے دوبارہ کوشش کریں۔',
    tr: 'Çok fazla istek. Lütfen biraz bekleyip tekrar deneyin.',
    id: 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.',
  },
  error_load_times: {
    en: "Couldn't load prayer times.",
    bn: 'নামাজের সময় লোড করা যায়নি।',
    ur: 'نماز کے اوقات لوڈ نہیں ہو سکے۔',
    tr: 'Namaz vakitleri yüklenemedi.',
    id: 'Waktu shalat tidak dapat dimuat.',
  },

  // ── Time format setting ──────────────────────────────────────────────────────
  settings_time_format: { en: 'Time format', bn: 'সময়ের ফরম্যাট', ur: 'وقت کا فارمیٹ', tr: 'Saat biçimi', id: 'Format waktu' },
  settings_time_format_12h: { en: '12-hour', bn: '১২ ঘণ্টা', ur: '12 گھنٹے', tr: '12 saat', id: '12 jam' },
  settings_time_format_24h: { en: '24-hour', bn: '২৪ ঘণ্টা', ur: '24 گھنٹے', tr: '24 saat', id: '24 jam' },
  settings_time_format_example: { en: 'Example', bn: 'উদাহরণ', ur: 'مثال', tr: 'Örnek', id: 'Contoh' },
};
