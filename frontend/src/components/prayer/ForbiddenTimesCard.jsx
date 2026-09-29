import { useApp } from '../../context/AppContext.jsx';
import { fmt, tr } from '../../i18n/translations.js';
import { activeForbiddenWindow, forbiddenWindows } from '../../utils/forbiddenTimes.js';
import { formatTime } from '../../utils/format.js';

/** Sunrise / zawal / sunset windows in which voluntary salah is prohibited. */
export default function ForbiddenTimesCard({ times, isToday = true }) {
  const { language, timeFormat } = useApp();
  const short = (hhmm) => formatTime(hhmm, language, timeFormat, { withPeriod: false });
  const windows = forbiddenWindows(times);
  if (!windows.length) return null;
  const active = isToday ? activeForbiddenWindow(times) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        <span className="text-rose-500" aria-hidden>⊘</span>
        {tr('forbidden_title', language)}
      </h2>
      {active && (
        <p className="mb-3 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-xs font-medium text-rose-700 dark:text-rose-300">
          {fmt('forbidden_now', language, { end: formatTime(active.end, language, timeFormat) })}
        </p>
      )}
      <div className="grid grid-cols-3 gap-2">
        {windows.map((w) => (
          <div
            key={w.key}
            className={`rounded-lg px-2 py-2 text-center ${
              active?.key === w.key ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            <div className="text-[11px] text-gray-500 dark:text-gray-400">{tr(`forbidden_${w.key}`, language)}</div>
            <div className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {short(w.start)}–{short(w.end)}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-gray-400">{tr('forbidden_note', language)}</p>
    </div>
  );
}
