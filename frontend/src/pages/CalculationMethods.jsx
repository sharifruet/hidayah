import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { getMethods } from '../services/locationService.js';
import { tr } from '../i18n/translations.js';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const MADHAB_CODES = new Set(['hanafi', 'shafi', 'maliki', 'hanbali']);
const CUSTOM_CODES = new Set(['custom_angles', 'custom_time']);

function groupKeyFor(code) {
  if (MADHAB_CODES.has(code)) return 'methods_group_madhab';
  if (CUSTOM_CODES.has(code)) return 'methods_group_custom';
  return 'methods_group_organizational';
}

function MethodCard({ method, isCurrent, language, onSelect }) {
  const asrIsHanafi = method.asr_method === 'hanafi';

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-5 flex flex-col ${
        isCurrent ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-100 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{method.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{method.code}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {method.is_default && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 whitespace-nowrap">
              {tr('methods_default_badge', language)}
            </span>
          )}
          {isCurrent && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-green-900/30 dark:text-green-400 whitespace-nowrap">
              {tr('methods_current_badge', language)}
            </span>
          )}
        </div>
      </div>

      <dl className="space-y-1.5 text-sm flex-grow">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">{tr('methods_fajr_angle', language)}</dt>
          <dd className="text-gray-900 dark:text-gray-100 font-medium">{method.fajr_angle}°</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">
            {method.isha_calculation_type === 'time' ? tr('methods_isha_label', language) : tr('methods_isha_angle', language)}
          </dt>
          <dd className="text-gray-900 dark:text-gray-100 font-medium">
            {method.isha_calculation_type === 'time'
              ? `${method.isha_time_adjustment} ${tr('methods_isha_after_maghrib', language)}`
              : `${method.isha_angle}°`}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">{tr('methods_asr_method', language)}</dt>
          <dd className={`text-right font-medium ${asrIsHanafi ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {asrIsHanafi ? tr('methods_asr_hanafi', language) : tr('methods_asr_standard', language)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">{tr('methods_dhuhr_adjustment', language)}</dt>
          <dd className="text-gray-900 dark:text-gray-100 font-medium">
            +{method.dhuhr_adjustment} {tr('methods_dhuhr_after_noon', language)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">{tr('methods_maghrib_adjustment', language)}</dt>
          <dd className="text-gray-900 dark:text-gray-100 font-medium">
            +{method.maghrib_adjustment} {tr('methods_maghrib_after_sunset', language)}
          </dd>
        </div>
      </dl>

      {method.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {method.description}
        </p>
      )}

      <button
        onClick={() => onSelect(method.code)}
        disabled={isCurrent}
        className={`mt-4 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isCurrent
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-default'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      >
        {isCurrent ? tr('methods_current_badge', language) : tr('methods_use_button', language)}
      </button>
    </div>
  );
}

export default function CalculationMethods() {
  const { method: currentMethod, updateMethod, language } = useApp();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['methods'],
    queryFn: getMethods,
  });

  const groups = (data?.methods || []).reduce((acc, m) => {
    const key = groupKeyFor(m.code);
    (acc[key] ||= []).push(m);
    return acc;
  }, {});

  const groupOrder = ['methods_group_organizational', 'methods_group_madhab', 'methods_group_custom'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {tr('methods_title', language)}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {tr('methods_subtitle', language)}
          </p>
        </div>

        {isLoading && <Loading message={tr('loading', language)} />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!isLoading && !error && groupOrder.map((groupKey) => {
          const methods = groups[groupKey];
          if (!methods || methods.length === 0) return null;

          return (
            <div key={groupKey} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {tr(groupKey, language)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {methods.map((m) => (
                  <MethodCard
                    key={m.code}
                    method={m}
                    isCurrent={m.code === currentMethod}
                    language={language}
                    onSelect={updateMethod}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
