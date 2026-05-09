import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { usePrayerTimes } from '../../hooks/usePrayerTimes.js';

const PRAYERS = [
  { key: 'fajr',    en: 'Fajr',    bn: 'ফজর',      above: true,  dot: 'bg-indigo-300',  line: 'bg-indigo-200',  label: 'text-indigo-600 dark:text-indigo-400',  time: 'text-indigo-400 dark:text-indigo-500'  },
  { key: 'sunrise', en: 'Sunrise', bn: 'সূর্যোদয়', above: false, dot: 'bg-amber-300',   line: 'bg-amber-200',   label: 'text-amber-600 dark:text-amber-400',    time: 'text-amber-400 dark:text-amber-500'    },
  { key: 'dhuhr',   en: 'Dhuhr',  bn: 'যোহর',     above: true,  dot: 'bg-yellow-300',  line: 'bg-yellow-200',  label: 'text-yellow-600 dark:text-yellow-400',  time: 'text-yellow-400 dark:text-yellow-500'  },
  { key: 'asr',     en: 'Asr',    bn: 'আসর',      above: false, dot: 'bg-orange-300',  line: 'bg-orange-200',  label: 'text-orange-600 dark:text-orange-400',  time: 'text-orange-400 dark:text-orange-500'  },
  { key: 'maghrib', en: 'Maghrib', bn: 'মাগরিব',  above: true,  dot: 'bg-rose-300',    line: 'bg-rose-200',    label: 'text-rose-600 dark:text-rose-400',      time: 'text-rose-400 dark:text-rose-500'      },
  { key: 'isha',    en: 'Isha',   bn: 'ইশা',      above: false, dot: 'bg-violet-300',  line: 'bg-violet-200',  label: 'text-violet-600 dark:text-violet-400',  time: 'text-violet-400 dark:text-violet-500'  },
];

// Colored bands painted on the track between salah periods
// Each entry: [fromKey, toKey, Tailwind bg class, dark bg class]
// "isha→fajr" wraps midnight so it's handled specially
const BANDS = [
  { from: 'fajr',    to: 'sunrise', light: '#dbeafe', dark: '#1e3a5f' },  // sky blue  — dawn
  { from: 'dhuhr',   to: 'asr',     light: '#fef9c3', dark: '#3b3200' },  // yellow    — midday
  { from: 'asr',     to: 'maghrib', light: '#ffedd5', dark: '#3d1a00' },  // orange    — afternoon
  { from: 'isha',    to: 'fajr',    light: '#ede9fe', dark: '#1e1040' },  // violet    — night (wraps)
];

function toMins(t) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function toPct(mins) {
  return (mins / 1440) * 100;
}

// Tick marks: minor every 30 min, labeled every 2 hours
const TICKS = [];
for (let m = 0; m <= 1440; m += 30) {
  const isHour = m % 60 === 0;
  const isLabeled = m % 120 === 0;
  TICKS.push({
    m, pct: toPct(m), isHour, isLabeled,
    label: isLabeled ? `${String(m / 60).padStart(2, '0')}:00` : null,
  });
}

// Layout constants (px)
const ABOVE_H = 52;
const TRACK_H = 10;
const BELOW_H = 52;
const TOTAL_H = ABOVE_H + TRACK_H + BELOW_H;
const TRACK_Y = ABOVE_H;

export default function PrayerTimeline() {
  const { location, method, language } = useApp();
  const { data, isLoading } = usePrayerTimes(location.lat, location.lng, new Date(), method);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tick);
  }, []);

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (isLoading || !data?.times) return null;

  const isBn = language === 'bn';
  const nowPct = toPct(nowMins);

  // Precompute prayer minute positions
  const prayerMins = {};
  PRAYERS.forEach(p => { prayerMins[p.key] = toMins(data.times[p.key]); });

  // Build band segments (handle midnight wrap for isha→fajr)
  const bandSegments = [];
  BANDS.forEach(({ from, to, light, dark }) => {
    const a = prayerMins[from];
    const b = prayerMins[to];
    if (a === null || b === null) return;

    if (b > a) {
      // normal segment
      bandSegments.push({ left: toPct(a), width: toPct(b - a), light, dark });
    } else {
      // wraps midnight: two pieces
      bandSegments.push({ left: toPct(a), width: toPct(1440 - a), light, dark });
      bandSegments.push({ left: 0,        width: toPct(b),         light, dark });
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-5 pt-4 pb-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
        {isBn ? 'আজকের সালাতের সময়' : "Today's Prayer Times"}
      </p>

      <div className="relative w-full" style={{ height: TOTAL_H }}>

        {/* ── Base track ── */}
        <div
          className="absolute left-0 right-0 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden"
          style={{ top: TRACK_Y, height: TRACK_H }}
        >
          {/* Colored salah-period bands inside the track */}
          {bandSegments.map((seg, i) => (
            <div
              key={i}
              className="absolute top-0 h-full dark:hidden"
              style={{ left: `${seg.left}%`, width: `${seg.width}%`, backgroundColor: seg.light }}
            />
          ))}
          {bandSegments.map((seg, i) => (
            <div
              key={`d-${i}`}
              className="absolute top-0 h-full hidden dark:block"
              style={{ left: `${seg.left}%`, width: `${seg.width}%`, backgroundColor: seg.dark }}
            />
          ))}
        </div>

        {/* ── Tick marks ── */}
        {TICKS.map(({ m, pct, isHour, isLabeled, label }) => (
          <div key={m} className="absolute" style={{ left: `${pct}%`, top: TRACK_Y, height: TRACK_H }}>
            <div
              className={`absolute left-1/2 -translate-x-px ${isHour ? 'bg-gray-300/70 dark:bg-gray-500/70' : 'bg-gray-200/70 dark:bg-gray-600/70'}`}
              style={{ width: 1, top: isHour ? 0 : 2, height: isHour ? TRACK_H : TRACK_H - 4 }}
            />
            {isLabeled && (
              <span
                className="absolute left-1/2 -translate-x-1/2 text-gray-300 dark:text-gray-600 select-none"
                style={{ top: TRACK_H + 4, fontSize: 9, whiteSpace: 'nowrap' }}
              >
                {label}
              </span>
            )}
          </div>
        ))}

        {/* ── Prayer markers ── */}
        {PRAYERS.map((p) => {
          const mins = prayerMins[p.key];
          if (mins === null) return null;
          const pct = toPct(mins);
          const dotCenterY = TRACK_Y + TRACK_H / 2;
          const lineLen = p.above ? ABOVE_H - 22 : BELOW_H - 22;

          return (
            <div key={p.key} className="absolute" style={{ left: `${pct}%`, top: 0, height: TOTAL_H }}>
              {/* Connector line */}
              <div
                className={`absolute left-1/2 -translate-x-px ${p.line}`}
                style={{ width: 1.5, top: p.above ? dotCenterY - lineLen : dotCenterY, height: lineLen }}
              />
              {/* Dot */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white dark:border-gray-800 ${p.dot}`}
                style={{ width: 12, height: 12, top: dotCenterY, zIndex: 10 }}
              />
              {/* Label */}
              <div
                className="absolute left-1/2 -translate-x-1/2 text-center"
                style={p.above
                  ? { bottom: BELOW_H + TRACK_H + 2, whiteSpace: 'nowrap' }
                  : { top: TRACK_Y + TRACK_H + lineLen + 2, whiteSpace: 'nowrap' }
                }
              >
                <div className={`text-[10px] font-semibold leading-tight ${p.label}`}>
                  {isBn ? p.bn : p.en}
                </div>
                <div className={`text-[9px] leading-tight tabular-nums ${p.time}`}>
                  {data.times[p.key]}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Now indicator — full container height ── */}
        <div
          className="absolute"
          style={{ left: `${nowPct}%`, top: 0, height: TOTAL_H, zIndex: 20, pointerEvents: 'none' }}
        >
          <div className="absolute left-1/2 -translate-x-px w-px bg-red-400 opacity-70 h-full" />
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-red-400"
            style={{ top: TRACK_Y + TRACK_H / 2, transform: 'translate(-50%, -50%)' }}
          />
          {/* Current time label */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bg-red-400 text-white rounded px-1 leading-none tabular-nums"
            style={{ top: 0, fontSize: 9, paddingTop: 2, paddingBottom: 2, whiteSpace: 'nowrap' }}
          >
            {nowLabel}
          </div>
        </div>

      </div>
    </div>
  );
}
