import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext.jsx';
import { tr } from '../i18n/translations.js';
import { getMasjid, updateJamahTimes } from '../services/masjidService.js';
import { getPrayerTimes } from '../services/prayerTimesService.js';
import MasjidMap from '../components/masjid/MasjidMap.jsx';
import JamahTimesFields from '../components/masjid/JamahTimesFields.jsx';
import Loading from '../components/common/Loading.jsx';
import {
  JAMAH_PRAYERS, prayerLabel, relativeTime, absoluteTime, formatDistance,
  googleMapsUrl, directionsUrl, minutesBetween, jamahFormToBody, jamahToForm,
} from '../utils/masjid.js';

export default function MasjidDetail() {
  const { id } = useParams();
  const { location, method, language } = useApp();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(jamahToForm());
  const [savedMsg, setSavedMsg] = useState('');

  const { data: masjid, isLoading, isError, error } = useQuery({
    queryKey: ['masjid', id, location.lat, location.lng],
    queryFn: () => getMasjid(id, { lat: location.lat, lng: location.lng }),
  });

  // Calculated adhan times for the masjid's own coordinates, for side-by-side comparison
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: prayerTimes } = useQuery({
    queryKey: ['masjid-prayer-times', masjid?.latitude, masjid?.longitude, today, method],
    queryFn: () => getPrayerTimes(masjid.latitude, masjid.longitude, today, method),
    enabled: !!masjid,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (masjid) setForm(jamahToForm(masjid.jamah));
  }, [masjid]);

  const mutation = useMutation({
    mutationFn: (body) => updateJamahTimes(id, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(['masjid', id, location.lat, location.lng], updated);
      queryClient.invalidateQueries({ queryKey: ['masjids'] });
      setEditing(false);
      setSavedMsg(tr('masjid_saved', language));
      setTimeout(() => setSavedMsg(''), 4000);
    },
  });

  if (isLoading) return <Loading message={tr('loading', language)} />;

  if (isError || !masjid) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          {error?.status === 404 ? tr('masjid_not_found', language) : tr('masjids_load_error', language)}
        </p>
        <Link to="/masjids" className="inline-block mt-4 text-sm font-medium text-primary-700 dark:text-green-400 hover:underline">
          ← {tr('masjid_back_to_list', language)}
        </Link>
      </div>
    );
  }

  const name = language === 'bn' && masjid.name_bn ? masjid.name_bn : masjid.name;
  const hasJamah = JAMAH_PRAYERS.some((p) => masjid.jamah?.[p]);
  const adhan = prayerTimes?.times;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/masjids" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-700 dark:hover:text-green-400 mb-4">
          ← {tr('masjid_back_to_list', language)}
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{name}</h1>
              {masjid.name_bn && masjid.name_bn !== name && (
                <p className="text-gray-500 dark:text-gray-400">{language === 'bn' ? masjid.name : masjid.name_bn}</p>
              )}
              {(masjid.address || masjid.city || masjid.district) && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {[masjid.address, masjid.city, masjid.district].filter(Boolean).join(', ')}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 font-mono">
                {masjid.latitude.toFixed(5)}, {masjid.longitude.toFixed(5)}
                {masjid.distance_km != null && (
                  <span className="ml-2 font-sans">· {formatDistance(masjid.distance_km)} {tr('masjids_away', language)}</span>
                )}
              </p>
              {masjid.phone && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <a href={`tel:${masjid.phone}`} className="hover:underline">{masjid.phone}</a>
                </p>
              )}
              {masjid.description && (
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{masjid.description}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={directionsUrl(masjid.latitude, masjid.longitude)}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {tr('masjid_directions', language)}
              </a>
              <a
                href={googleMapsUrl(masjid.latitude, masjid.longitude)}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-center text-gray-500 dark:text-gray-400 hover:underline"
              >
                {tr('masjid_open_in_maps', language)}
              </a>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-gray-400 dark:text-gray-500" title={absoluteTime(masjid.created_at)}>
            {tr('masjid_added_on', language)} {relativeTime(masjid.created_at)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Jamah times */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{tr('masjid_jamah_times', language)}</h2>
                {masjid.jamah_updated_at ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" title={absoluteTime(masjid.jamah_updated_at)}>
                    {tr('masjid_last_updated', language)}: <span className="font-medium">{relativeTime(masjid.jamah_updated_at)}</span>
                    <span className="text-gray-400 dark:text-gray-500"> · {absoluteTime(masjid.jamah_updated_at)}</span>
                  </p>
                ) : null}
              </div>
              {!editing && (
                <button
                  type="button"
                  onClick={() => { setEditing(true); setSavedMsg(''); mutation.reset(); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {hasJamah ? tr('masjid_update_jamah', language) : tr('masjid_add_jamah', language)}
                </button>
              )}
            </div>

            {savedMsg && (
              <p className="mb-3 text-sm text-primary-700 dark:text-green-400 bg-primary-50 dark:bg-green-900/30 rounded-lg px-3 py-2">{savedMsg}</p>
            )}

            {editing ? (
              <form
                onSubmit={(e) => { e.preventDefault(); mutation.mutate(jamahFormToBody(form)); }}
                className="space-y-4"
              >
                <JamahTimesFields value={form} onChange={setForm} disabled={mutation.isPending} />
                <p className="text-xs text-gray-500 dark:text-gray-400">{tr('masjid_jamah_hint', language)}</p>
                {mutation.isError && (
                  <p className="text-sm text-red-600 dark:text-red-400">{mutation.error?.message || tr('error_generic', language)}</p>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setForm(jamahToForm(masjid.jamah)); }}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    {tr('cancel', language)}
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium"
                  >
                    {mutation.isPending ? tr('masjid_saving', language) : tr('masjid_save', language)}
                  </button>
                </div>
              </form>
            ) : hasJamah ? (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="py-2 font-medium">{tr('masjid_prayer', language)}</th>
                      <th className="py-2 font-medium text-right">{tr('masjid_adhan', language)}</th>
                      <th className="py-2 font-medium text-right">{tr('masjid_jamah', language)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {JAMAH_PRAYERS.map((p) => {
                      const jamah = masjid.jamah?.[p];
                      // Jumu'ah replaces Dhuhr on Fridays; compare it against Dhuhr's adhan
                      const adhanTime = adhan?.[p === 'jumuah' ? 'dhuhr' : p];
                      const delta = minutesBetween(adhanTime, jamah);
                      return (
                        <tr key={p} className={jamah ? '' : 'opacity-50'}>
                          <td className="py-2.5 font-medium text-gray-900 dark:text-gray-100">{prayerLabel(p, language)}</td>
                          <td className="py-2.5 text-right font-mono text-gray-500 dark:text-gray-400">{adhanTime || '—'}</td>
                          <td className="py-2.5 text-right">
                            <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{jamah || '—'}</span>
                            {delta != null && delta >= 0 && (
                              <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">+{delta}m</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500">{tr('masjid_today_adhan_note', language)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">{tr('masjid_no_jamah', language)}</p>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <MasjidMap
              center={[masjid.latitude, masjid.longitude]}
              zoom={16}
              masjids={[masjid]}
              height="320px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
