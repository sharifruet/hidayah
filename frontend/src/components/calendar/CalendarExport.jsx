import { useState } from 'react';
import { exportToCSV, exportToJSON, exportToICal, printCalendar, generateFilename } from '../../utils/export.js';
import { useApp } from '../../context/AppContext.jsx';
import { EXPORT_FORMATS } from '../../utils/constants.js';

export default function CalendarExport({ data, viewType, params, onExport = null }) {
  const { location, language } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    if (!data || !data.days) {
      alert(language === 'bn' ? 'রপ্তানির জন্য ডেটা নেই' : 'No data to export');
      return;
    }

    setIsExporting(true);

    try {
      const locationName = location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
      const filename = generateFilename(locationName, viewType, params, format);

      switch (format) {
        case EXPORT_FORMATS.CSV:
          exportToCSV(data, filename);
          break;
        case EXPORT_FORMATS.JSON:
          exportToJSON(data, filename);
          break;
        case EXPORT_FORMATS.ICAL:
          exportToICal(data, filename, locationName);
          break;
        case EXPORT_FORMATS.PDF:
          // PDF export would require a library like jsPDF
          // For now, use print which can be saved as PDF
          printCalendar(data, `Salat & Saom Calendar - ${locationName}`);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      if (onExport) {
        onExport(format);
      }
    } catch (error) {
      alert(language === 'bn' ? `রপ্তানি ত্রুটি: ${error.message}` : `Export error: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (!data || !data.days) {
      alert(language === 'bn' ? 'প্রিন্ট করার জন্য ডেটা নেই' : 'No data to print');
      return;
    }

    const locationName = location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
    printCalendar(data, `Salat & Saom Calendar - ${locationName}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleExport(EXPORT_FORMATS.CSV)}
        disabled={isExporting}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isExporting ? 'Exporting...' : (language === 'bn' ? 'CSV ডাউনলোড' : 'Download CSV')}
      </button>

      <button
        onClick={() => handleExport(EXPORT_FORMATS.JSON)}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isExporting ? 'Exporting...' : (language === 'bn' ? 'JSON ডাউনলোড' : 'Download JSON')}
      </button>

      <button
        onClick={() => handleExport(EXPORT_FORMATS.ICAL)}
        disabled={isExporting}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        {isExporting ? 'Exporting...' : (language === 'bn' ? 'iCal ডাউনলোড' : 'Download iCal')}
      </button>

      <button
        onClick={handlePrint}
        disabled={isExporting}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
      >
        {language === 'bn' ? 'প্রিন্ট' : 'Print'}
      </button>
    </div>
  );
}
