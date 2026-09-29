import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { tr } from '../../i18n/translations.js';
import { bnOr, formatTime } from '../../utils/format.js';

const DAILY = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const LABEL = { fajr: 'prayer_fajr', dhuhr: 'prayer_dhuhr', asr: 'prayer_asr', maghrib: 'prayer_maghrib', isha: 'prayer_isha', jumuah: 'masjid_jumuah' };

/** Today's jamah times at the user's masjid, with the next one highlighted. */
export default function MyMasjidCard() {
  const { myMasjid, language, timeFormat } = useApp();
  if (!myMasjid) return null;

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const prayers = DAILY.map((p) => (p === 'dhuhr' && now.getDay() === 5 && myMasjid.jamah?.jumuah ? 'jumuah' : p));
  const rows = prayers.filter((p) => myMasjid.jamah?.[p]).map((p) => ({ p, time: myMasjid.jamah[p] }));
  const next = rows.find(({ time }) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m > nowMins;
  });
  const name = bnOr(language, myMasjid.name_bn, myMasjid.name);

  return (
    <Link
      to={`/masjids/${myMasjid.id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 h-full hover:border-primary-300 dark:hover:border-green-600 transition-colors"
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">{tr('my_masjid', language)}</p>
      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</p>
      {rows.length ? (
        <div className="grid grid-cols-5 gap-1 mt-3">
          {rows.map(({ p, time }) => (
            <div
              key={p}
              className={`rounded-lg py-1.5 text-center ${next?.p === p ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200'}`}
            >
              <div className="text-[10px] opacity-80">{tr(LABEL[p], language)}</div>
              <div className="text-sm font-semibold tabular-nums">{formatTime(time, language, timeFormat, { withPeriod: false })}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 mt-2">{tr('my_masjid_no_times', language)}</p>
      )}
    </Link>
  );
}
