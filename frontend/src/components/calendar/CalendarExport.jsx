import { useState } from 'react';
import { exportToCSV, exportToJSON, exportToICal, printCalendar, generateFilename } from '../../utils/export.js';
import { useApp } from '../../context/AppContext.jsx';
import { EXPORT_FORMATS } from '../../utils/constants.js';
import { tr, fmt } from '../../i18n/translations.js';
import { placeName } from '../../utils/place.js';

export default function CalendarExport({ data, viewType, params, onExport = null }) {
  const { location, language, timeFormat } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  const locationName = placeName(location, language) || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  const printTitle = fmt('cal_print_title', language, { location: locationName });
  const localeOptions = { language, timeFormat };

  const handleExport = async (format) => {
    if (!data || !data.days) {
      alert(tr('cal_no_data_export', language));
      return;
    }

    setIsExporting(true);

    try {
      const filename = generateFilename(locationName, viewType, params, format);

      switch (format) {
        case EXPORT_FORMATS.CSV:
          exportToCSV(data, filename);
          break;
        case EXPORT_FORMATS.JSON:
          exportToJSON(data, filename);
          break;
        case EXPORT_FORMATS.ICAL:
          exportToICal(data, filename, locationName, localeOptions);
          break;
        case EXPORT_FORMATS.PDF:
          // PDF export would require a library like jsPDF
          // For now, use print which can be saved as PDF
          printCalendar(data, printTitle, localeOptions);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      if (onExport) {
        onExport(format);
      }
    } catch (error) {
      console.error('Calendar export failed', error);
      alert(tr('cal_export_failed', language));
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!data || !data.days) {
      alert(tr('cal_no_data_print', language));
      return;
    }

    printCalendar(data, printTitle, localeOptions);
  };

  const exportLabel = (key) => (isExporting ? tr('cal_exporting', language) : tr(key, language));

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleExport(EXPORT_FORMATS.CSV)}
        disabled={isExporting}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {exportLabel('cal_download_csv')}
      </button>

      <button
        onClick={() => handleExport(EXPORT_FORMATS.JSON)}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {exportLabel('cal_download_json')}
      </button>

      <button
        onClick={() => handleExport(EXPORT_FORMATS.ICAL)}
        disabled={isExporting}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        {exportLabel('cal_download_ical')}
      </button>

      <button
        onClick={handlePrint}
        disabled={isExporting}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
      >
        {tr('cal_print', language)}
      </button>
    </div>
  );
}
