import { format, parseISO } from 'date-fns';

/**
 * Format time string (HH:MM) to display format
 */
export function formatTime(timeString) {
  if (!timeString) return '--:--';
  return timeString;
}

/**
 * Format date to display format
 */
export function formatDate(date, formatStr = 'dd MMM yyyy') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format duration in minutes to human-readable format
 */
export function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return '--';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Format duration to hours and minutes
 */
export function formatDurationDetailed(minutes) {
  if (!minutes && minutes !== 0) return '--';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins} minutes`;
  }
  if (mins === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
}

/**
 * Get current prayer time
 */
export function getCurrentPrayer(times, currentTime = new Date()) {
  if (!times) return null;

  const now = currentTime;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'fajr', time: times.fajr },
    { name: 'sunrise', time: times.sunrise },
    { name: 'dhuhr', time: times.dhuhr },
    { name: 'asr', time: times.asr },
    { name: 'maghrib', time: times.maghrib },
    { name: 'isha', time: times.isha }
  ];

  // Parse time string to minutes
  const parseTime = (timeStr) => {
    if (!timeStr) return Infinity;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Find current prayer (which prayer we're currently in)
  let currentPrayer = null;
  let nextPrayer = null;

  for (let i = 0; i < prayers.length; i++) {
    const prayerTime = parseTime(prayers[i].time);

    // If we're before this prayer, this is the next prayer
    if (currentMinutes < prayerTime && !nextPrayer) {
      nextPrayer = {
        name: prayers[i].name,
        time: prayers[i].time,
        timeMinutes: prayerTime
      };
      // Current prayer is the previous one
      if (i > 0) {
        currentPrayer = prayers[i - 1].name;
      } else {
        // Before Fajr, so current is Isha (previous day)
        currentPrayer = 'isha';
      }
      break;
    }
  }

  // If past Isha, next is Fajr (tomorrow)
  if (!nextPrayer) {
    currentPrayer = 'isha';
    nextPrayer = {
      name: 'fajr',
      time: times.fajr,
      timeMinutes: parseTime(times.fajr) + 24 * 60 // Next day
    };
  }

  return {
    current: currentPrayer,
    next: nextPrayer.name,
    nextTime: nextPrayer.time,
    nextTimeMinutes: nextPrayer.timeMinutes
  };
}

/**
 * Calculate time until next prayer
 */
export function getTimeUntilNextPrayer(times, currentTime = new Date()) {
  const prayerInfo = getCurrentPrayer(times, currentTime);
  if (!prayerInfo) return null;

  const now = currentTime;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let minutesUntil = prayerInfo.nextTimeMinutes - currentMinutes;

  // Handle next day (if next prayer is tomorrow)
  if (minutesUntil < 0) {
    minutesUntil = minutesUntil + 24 * 60;
  }

  // Handle case where next prayer is very early next day
  if (minutesUntil > 20 * 60) {
    // If more than 20 hours, it's likely next day
    // This is already handled above
  }

  return minutesUntil;
}

/**
 * Format countdown time
 */
export function formatCountdown(minutes) {
  if (!minutes && minutes !== 0) return '--:--';
  if (minutes < 0) return '00:00';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }
  return `00:${String(mins).padStart(2, '0')}`;
}
