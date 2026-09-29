import { tr, fmt, RTL_LANGUAGES } from '../i18n/translations.js';
import { formatDate, formatTime, localDigits } from './format.js';

const PRAYER_COLUMNS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** iCal TEXT values must escape backslashes, commas, semicolons and newlines. */
function escapeICalText(value) {
  return String(value).replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
}

/**
 * Export calendar data to CSV. Values stay raw ASCII (ISO dates, 24-hour HH:MM) and headers
 * stay English so the file imports cleanly into spreadsheets regardless of UI language.
 */
export function exportToCSV(data, filename) {
  if (!data || !data.days) {
    throw new Error('No data to export');
  }

  const headers = ['Date', 'Day', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const rows = data.days.map(day => {
    const row = [
      day.date,
      day.day_of_week || '',
      day.prayer_times?.fajr || '',
      day.prayer_times?.sunrise || '',
      day.prayer_times?.dhuhr || '',
      day.prayer_times?.asr || '',
      day.prayer_times?.maghrib || '',
      day.prayer_times?.isha || ''
    ];

    return row.map(cell => `"${cell}"`).join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Export calendar data to JSON
 */
export function exportToJSON(data, filename) {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Export calendar data to iCal format. Event times stay raw; the human-readable summary and
 * description use the UI language.
 */
export function exportToICal(data, filename, locationName = '', { language = 'en', timeFormat } = {}) {
  if (!data || !data.days) {
    throw new Error('No data to export');
  }

  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hidayah//Prayer Times//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ].join('\r\n') + '\r\n';

  data.days.forEach(day => {
    const date = day.date.replace(/-/g, '');

    ['fajr', 'maghrib'].forEach((key) => {
      const time = day.prayer_times?.[key];
      if (!time) return;
      const stamp = `${date}T${time.replace(':', '')}00`;
      const prayer = tr(`prayer_${key}`, language);
      const description = locationName
        ? fmt('cal_ical_prayer_time_at', language, { prayer, location: locationName })
        : fmt('cal_ical_prayer_time', language, { prayer });
      icalContent += [
        'BEGIN:VEVENT',
        `DTSTART:${stamp}`,
        `DTEND:${stamp}`,
        `SUMMARY:${escapeICalText(`${prayer} - ${formatTime(time, language, timeFormat)}`)}`,
        `DESCRIPTION:${escapeICalText(description)}`,
        'END:VEVENT'
      ].join('\r\n') + '\r\n';
    });
  });

  icalContent += 'END:VCALENDAR\r\n';

  downloadFile(icalContent, filename, 'text/calendar;charset=utf-8');
}

/**
 * Download file
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename for export
 */
export function generateFilename(locationName, viewType, params, format) {
  const location = locationName || 'location';
  const sanitizedLocation = location.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  let datePart = '';
  if (viewType === 'monthly') {
    datePart = `${params.year}_${String(params.month).padStart(2, '0')}`;
  } else if (viewType === 'yearly') {
    datePart = `${params.year}`;
  } else if (viewType === 'date-range') {
    datePart = `${params.startDate.replace(/-/g, '')}_${params.endDate.replace(/-/g, '')}`;
  }

  return `salat_saom_${sanitizedLocation}_${datePart}.${format}`;
}

/**
 * Print calendar (the browser's print dialog also offers "Save as PDF"). Localized for the
 * UI language: headings, dates, times and numerals.
 */
export function printCalendar(data, title, { language = 'en', timeFormat } = {}) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert(tr('cal_popup_blocked', language));
    return;
  }

  const htmlContent = generatePrintHTML(data, title, language, timeFormat);
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();

  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

/**
 * Generate HTML for printing
 */
function generatePrintHTML(data, title, language, timeFormat) {
  const locationInfo = data.location?.name
    ? `${data.location.name}${data.location.district ? `, ${data.location.district}` : ''}`
    : localDigits(`${data.coordinates?.latitude?.toFixed(4)}, ${data.coordinates?.longitude?.toFixed(4)}`, language);

  let tableRows = '';
  if (data.days) {
    tableRows = data.days.map(day => `
        <tr>
          <td>${escapeHTML(formatDate(day.date, language, { day: 'numeric', month: 'short', year: 'numeric' }))}</td>
          ${PRAYER_COLUMNS.map((key) => `<td>${escapeHTML(formatTime(day.prayer_times?.[key], language, timeFormat))}</td>`).join('')}
        </tr>
      `).join('');
  }

  const headerCells = PRAYER_COLUMNS.map((key) => `<th>${escapeHTML(tr(`prayer_${key}`, language))}</th>`).join('');
  const dir = RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr';

  return `
    <!DOCTYPE html>
    <html lang="${language}" dir="${dir}">
    <head>
      <meta charset="utf-8">
      <title>${escapeHTML(title)}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; margin-bottom: 10px; }
        .info { text-align: center; margin-bottom: 20px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: start; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        @media print {
          body { margin: 0; }
          @page { margin: 1cm; }
        }
      </style>
    </head>
    <body>
      <h1>${escapeHTML(title)}</h1>
      <div class="info">
        <p>${escapeHTML(fmt('cal_print_location', language, { location: locationInfo }))}</p>
        <p>${escapeHTML(fmt('cal_print_method', language, { method: data.method || tr('cal_not_available', language) }))}</p>
        ${data.total_days ? `<p>${escapeHTML(fmt('cal_print_total_days', language, { n: localDigits(data.total_days, language) }))}</p>` : ''}
      </div>
      <table>
        <thead>
          <tr>
            <th>${escapeHTML(tr('cal_col_date', language))}</th>
            ${headerCells}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;
}
