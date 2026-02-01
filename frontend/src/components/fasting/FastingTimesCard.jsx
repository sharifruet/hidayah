import { useFastingTimes } from '../../hooks/useFastingTimes.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import FastingDuration from './FastingDuration.jsx';
import { formatDate, formatDurationDetailed } from '../../utils/formatters.js';

export default function FastingTimesCard({ date = new Date(), onMethodChange = null, onSehriMarginChange = null }) {
  const { location, method, sehriMargin, language } = useApp();
  const { data, isLoading, error, refetch } = useFastingTimes(location.lat, location.lng, date, method, sehriMargin);

  if (isLoading) {
    return <Loading message="Loading fasting times..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data?.fasting) {
    return <ErrorMessage error="No fasting times data available" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {language === 'bn' ? 'সাওমের সময়' : 'Fasting Times'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {formatDate(date)} • {location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
            {language === 'bn' ? 'সেহরির শেষ সময়' : 'Sehri End'}
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {data.fasting.sehri_end}
          </p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
            {language === 'bn' ? 'ইফতারের সময়' : 'Iftar Time'}
          </p>
          <p className="text-2xl font-bold text-orange-700">
            {data.fasting.iftar}
          </p>
        </div>

        <FastingDuration
          duration={data.fasting.fasting_duration_minutes}
          dayLength={data.fasting.day_length_minutes}
        />
      </div>

      {(onMethodChange || onSehriMarginChange) && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {onMethodChange && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'bn' ? 'গণনা পদ্ধতি' : 'Calculation Method'}
              </label>
              <select
                value={method}
                onChange={(e) => onMethodChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="karachi">Karachi</option>
                <option value="mwl">MWL</option>
                <option value="isna">ISNA</option>
                <option value="umm_al_qura">Umm Al-Qura</option>
                <option value="hanafi">Hanafi</option>
              </select>
            </div>
          )}

          {onSehriMarginChange && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'bn' ? 'সেহরি মার্জিন (মিনিট)' : 'Sehri Margin (minutes)'}
              </label>
              <input
                type="number"
                min="5"
                max="15"
                value={sehriMargin}
                onChange={(e) => onSehriMarginChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
