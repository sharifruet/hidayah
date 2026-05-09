import { Link } from 'react-router-dom';

// Curated list of well-known ayahs: { surah, ayah, arabic, translation_en, translation_bn, ref }
const CURATED = [
  { surah: 2, ayah: 286, arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', translation_en: 'Allah does not burden a soul beyond that it can bear.', translation_bn: 'আল্লাহ কাউকে তার সাধ্যের বাইরে বোঝা দেন না।', ref: 'Al-Baqarah 2:286' },
  { surah: 94, ayah: 5, arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', translation_en: 'For indeed, with hardship will be ease.', translation_bn: 'নিশ্চয়ই কষ্টের সাথে সহজ আসে।', ref: 'Ash-Sharh 94:5' },
  { surah: 3, ayah: 139, arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', translation_en: 'Do not weaken and do not grieve, and you will be superior if you are true believers.', translation_bn: 'দুর্বল হয়ো না এবং দুঃখ করো না; তোমরাই বিজয়ী হবে যদি তোমরা মুমিন হও।', ref: 'Ali-Imran 3:139' },
  { surah: 2, ayah: 255, arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation_en: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.', translation_bn: 'আল্লাহ — তিনি ছাড়া কোনো ইলাহ নেই, তিনি চিরঞ্জীব, সর্বসত্তার ধারক।', ref: 'Al-Baqarah 2:255 (Ayat al-Kursi)' },
  { surah: 65, ayah: 3, arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', translation_en: 'And whoever relies upon Allah — then He is sufficient for him.', translation_bn: 'যে আল্লাহর উপর তাওয়াক্কুল করে, তাঁর জন্য আল্লাহই যথেষ্ট।', ref: 'At-Talaq 65:3' },
  { surah: 2, ayah: 152, arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', translation_en: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.', translation_bn: 'তোমরা আমাকে স্মরণ কর, আমি তোমাদের স্মরণ করব। আমার প্রতি কৃতজ্ঞ হও।', ref: 'Al-Baqarah 2:152' },
  { surah: 13, ayah: 28, arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', translation_en: 'Verily, in the remembrance of Allah do hearts find rest.', translation_bn: 'জেনে রাখো, আল্লাহর স্মরণেই হৃদয় প্রশান্তি পায়।', ref: "Ar-Ra'd 13:28" },
  { surah: 39, ayah: 53, arabic: 'لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا', translation_en: 'Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.', translation_bn: 'আল্লাহর রহমত থেকে নিরাশ হয়ো না। নিশ্চয়ই আল্লাহ সমস্ত পাপ ক্ষমা করেন।', ref: 'Az-Zumar 39:53' },
  { surah: 2, ayah: 45, arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', translation_en: 'And seek help through patience and prayer.', translation_bn: 'ধৈর্য ও নামাযের মাধ্যমে সাহায্য প্রার্থনা করো।', ref: 'Al-Baqarah 2:45' },
  { surah: 57, ayah: 3, arabic: 'هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ', translation_en: 'He is the First and the Last, the Ascendant and the Intimate, and He is, of all things, Knowing.', translation_bn: 'তিনিই প্রথম, তিনিই শেষ, তিনিই প্রকাশমান, তিনিই গুপ্ত। তিনি সব বিষয়ে সম্যক জ্ঞাত।', ref: 'Al-Hadid 57:3' },
  { surah: 17, ayah: 44, arabic: 'وَإِن مِّن شَيْءٍ إِلَّا يُسَبِّحُ بِحَمْدِهِ وَلَٰكِن لَّا تَفْقَهُونَ تَسْبِيحَهُمْ', translation_en: 'And there is not a thing except that it exalts [Allah] by His praise, but you do not understand their [way of] exalting.', translation_bn: 'এমন কিছু নেই যা তাঁর প্রশংসায় তাসবিহ পাঠ করে না, কিন্তু তোমরা তাদের তাসবিহ বুঝতে পারো না।', ref: "Al-Isra' 17:44" },
  { surah: 55, ayah: 13, arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', translation_en: 'So which of the favours of your Lord would you deny?', translation_bn: 'তোমরা তোমাদের পালনকর্তার কোন কোন নিয়ামতকে মিথ্যা বলবে?', ref: 'Ar-Rahman 55:13' },
  { surah: 2, ayah: 201, arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', translation_en: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.', translation_bn: 'হে আমাদের রব! দুনিয়াতে কল্যাণ দাও, আখিরাতেও কল্যাণ দাও এবং জাহান্নামের আযাব থেকে রক্ষা করো।', ref: 'Al-Baqarah 2:201' },
  { surah: 49, ayah: 13, arabic: 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ', translation_en: 'Indeed, the most noble of you in the sight of Allah is the most righteous of you.', translation_bn: 'নিশ্চয়ই তোমাদের মধ্যে আল্লাহর কাছে সবচেয়ে সম্মানিত সে যে সবচেয়ে বেশি তাকওয়াসম্পন্ন।', ref: 'Al-Hujurat 49:13' },
];

function getDailyAyah() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  return CURATED[dayOfYear % CURATED.length];
}

export default function DailyAyah({ language }) {
  const ayah = getDailyAyah();
  const today = new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-green-700 to-green-900 dark:from-green-900 dark:to-gray-900 rounded-2xl p-5 text-white shadow-md">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-green-200 uppercase tracking-wide">
          {language === 'bn' ? 'আজকের আয়াত' : "Ayah of the Day"}
        </p>
        <p className="text-xs text-green-300">{today}</p>
      </div>

      <p className="text-3xl font-arabic leading-loose text-right mb-3 text-green-50" dir="rtl" lang="ar">
        {ayah.arabic}
      </p>

      <p className="text-sm leading-relaxed text-green-100 mb-3">
        {language === 'bn' ? ayah.translation_bn : ayah.translation_en}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-green-300">{ayah.ref}</span>
        <Link
          to={`/quran/${ayah.surah}/${ayah.ayah}`}
          className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          {language === 'bn' ? 'পড়ুন' : 'Read'}
        </Link>
      </div>
    </div>
  );
}
