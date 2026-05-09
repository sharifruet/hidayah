import { useApp } from '../context/AppContext.jsx';
import PrayerTimeline from '../components/prayer/PrayerTimeline.jsx';
import MonthlyCalendar from '../components/calendar/MonthlyCalendar.jsx';
import DailyAyah from '../components/common/DailyAyah.jsx';

export default function Home() {
  const { language } = useApp();
  const today = new Date();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Daily Ayah widget */}
        <div className="mb-6">
          <DailyAyah language={language} />
        </div>

        {/* 24-hour prayer timeline */}
        <div className="mb-6">
          <PrayerTimeline />
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
