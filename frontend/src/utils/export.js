import { format } from 'date-fns';

/**
 * Export calendar data to CSV
 */
export function exportToCSV(data, filename) {
  if (!data || !data.days) {
    throw new Error('No data to export');
  }

  const headers = ['Date', 'Day', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  if (data.days[0]?.fasting) {
    headers.push('Sehri End', 'Iftar', 'Fasting Duration (minutes)', 'Day Length (minutes)');
  }

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

    if (day.fasting) {
      row.push(
        day.fasting.sehri_end || '',
        day.fasting.iftar || '',
        day.fasting.fasting_duration_minutes || '',
        day.fasting.day_length_minutes || ''
      );
    }

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
 * Export calendar data to iCal format
 */
export function exportToICal(data, filename, locationName = '') {
  if (!data || !data.days) {
    throw new Error('No data to export');
  }

  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Salat & Saom Timing//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ].join('\r\n') + '\r\n';

  data.days.forEach(day => {
    const date = day.date.replace(/-/g, '');

    // Fajr event
    if (day.prayer_times?.fajr) {
      const fajrTime = `${date}T${day.prayer_times.fajr.replace(':', '')}00`;
      icalContent += [
        'BEGIN:VEVENT',
        `DTSTART:${fajrTime}`,
        `DTEND:${fajrTime}`,
        `SUMMARY:Fajr - ${day.prayer_times.fajr}`,
        `DESCRIPTION:Fajr prayer time${locationName ? ` at ${locationName}` : ''}`,
        'END:VEVENT'
      ].join('\r\n') + '\r\n';
    }

    // Maghrib event
    if (day.prayer_times?.maghrib) {
      const maghribTime = `${date}T${day.prayer_times.maghrib.replace(':', '')}00`;
      icalContent += [
        'BEGIN:VEVENT',
        `DTSTART:${maghribTime}`,
        `DTEND:${maghribTime}`,
        `SUMMARY:Maghrib - ${day.prayer_times.maghrib}`,
        `DESCRIPTION:Maghrib prayer time${locationName ? ` at ${locationName}` : ''}`,
        'END:VEVENT'
      ].join('\r\n') + '\r\n';
    }

    // Iftar event
    if (day.fasting?.iftar) {
      const iftarTime = `${date}T${day.fasting.iftar.replace(':', '')}00`;
      icalContent += [
        'BEGIN:VEVENT',
        `DTSTART:${iftarTime}`,
        `DTEND:${iftarTime}`,
        `SUMMARY:Iftar - ${day.fasting.iftar}`,
        `DESCRIPTION:Iftar time${locationName ? ` at ${locationName}` : ''}`,
        'END:VEVENT'
      ].join('\r\n') + '\r\n';
    }
  });

  icalContent += 'END:VCALENDAR\r\n';

  downloadFile(icalContent, filename, 'text/calendar');
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
 * Print calendar
 */
export function printCalendar(data, title = 'Salat & Saom Calendar') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the calendar');
    return;
  }

  const htmlContent = generatePrintHTML(data, title);
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
function generatePrintHTML(data, title) {
  const locationInfo = data.location?.name
    ? `${data.location.name}${data.location.district ? `, ${data.location.district}` : ''}`
    : `${data.coordinates?.latitude?.toFixed(4)}, ${data.coordinates?.longitude?.toFixed(4)}`;

  let tableRows = '';
  if (data.days) {
    tableRows = data.days.map(day => {
      const fastingRow = day.fasting
        ? `<td>${day.fasting.sehri_end || '--'}</td><td>${day.fasting.iftar || '--'}</td>`
        : '';

      return `
        <tr>
          <td>${day.date}</td>
          <td>${day.prayer_times?.fajr || '--'}</td>
          <td>${day.prayer_times?.sunrise || '--'}</td>
          <td>${day.prayer_times?.dhuhr || '--'}</td>
          <td>${day.prayer_times?.asr || '--'}</td>
          <td>${day.prayer_times?.maghrib || '--'}</td>
          <td>${day.prayer_times?.isha || '--'}</td>
          ${fastingRow}
        </tr>
      `;
    }).join('');
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; margin-bottom: 10px; }
        .info { text-align: center; margin-bottom: 20px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        @media print {
          body { margin: 0; }
          @page { margin: 1cm; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="info">
        <p>Location: ${locationInfo}</p>
        <p>Method: ${data.method || 'N/A'}</p>
        ${data.total_days ? `<p>Total Days: ${data.total_days}</p>` : ''}
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Fajr</th>
            <th>Sunrise</th>
            <th>Dhuhr</th>
            <th>Asr</th>
            <th>Maghrib</th>
            <th>Isha</th>
            ${data.days?.[0]?.fasting ? '<th>Sehri</th><th>Iftar</th>' : ''}
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
