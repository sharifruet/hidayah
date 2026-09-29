import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { tr } from '../i18n/translations.js';
import PrayerTimeline from '../components/prayer/PrayerTimeline.jsx';
import MonthlyCalendar from '../components/calendar/MonthlyCalendar.jsx';
import DailyAyah from '../components/common/DailyAyah.jsx';
import NextPrayerCard from '../components/home/NextPrayerCard.jsx';
import UpcomingDaysCard from '../components/home/UpcomingDaysCard.jsx';
import MyMasjidCard from '../components/home/MyMasjidCard.jsx';

const EXPLORE = [
  { to: '/ramadan', key: 'ramadan_title', icon: '🌙' },
  { to: '/islamic-days', key: 'islamic_days_title', icon: '⭐' },
  { to: '/zakat', key: 'zakat_title', icon: '🧮' },
  { to: '/names', key: 'names_title', icon: '✨' },
  { to: '/calendar', key: 'nav_calendar', icon: '📅' },
  { to: '/masjids', key: 'nav_masjids', icon: '🕌' },
];

export default function Home() {
  const { language, myMasjid } = useApp();
  const today = new Date();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page title for screen readers; the hero card below is the visual heading. */}
        <h1 className="sr-only">{tr('app_name', language)}</h1>

        {/* Next prayer countdown + Hijri date (+ sehri/iftar in Ramadan) */}
        <div className="mb-6">
          <NextPrayerCard />
        </div>

        <div className={`grid gap-6 mb-6 ${myMasjid ? 'md:grid-cols-2' : ''}`}>
          {myMasjid && <MyMasjidCard />}
          <UpcomingDaysCard />
        </div>

        {/* 24-hour prayer timeline */}
        <div className="mb-6">
          <PrayerTimeline />
        </div>

        {/* Daily Ayah widget */}
        <div className="mb-6">
          <DailyAyah language={language} />
        </div>

        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{tr('home_explore', language)}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {EXPLORE.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex flex-col items-center gap-1 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-4 text-center hover:border-primary-300 dark:hover:border-green-600 transition-colors"
            >
              <span className="text-2xl" aria-hidden>{l.icon}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{tr(l.key, language)}</span>
            </Link>
          ))}
        </div>

        {/* Monthly calendar — full width */}
        <div className="mb-6">
          <MonthlyCalendar
            year={today.getFullYear()}
            month={today.getMonth() + 1}
          />
        </div>

      </div>
    </div>
  );
}
