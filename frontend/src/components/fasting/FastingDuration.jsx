import { formatDurationDetailed } from '../../utils/formatters.js';
import { useApp } from '../../context/AppContext.jsx';

export default function FastingDuration({ duration, dayLength }) {
  const { language } = useApp();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">
          {language === 'bn' ? 'রোজার সময়কাল' : 'Fasting Duration'}
        </p>
        <p className="text-xl font-bold text-gray-800">
          {formatDurationDetailed(duration)}
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">
          {language === 'bn' ? 'দিনের দৈর্ঘ্য' : 'Day Length'}
        </p>
        <p className="text-xl font-bold text-gray-800">
          {formatDurationDetailed(dayLength)}
        </p>
      </div>
    </div>
  );
}
