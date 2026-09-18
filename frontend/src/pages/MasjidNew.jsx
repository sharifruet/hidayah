import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { tr } from '../i18n/translations.js';
import { createMasjid } from '../services/masjidService.js';
import MasjidMap from '../components/masjid/MasjidMap.jsx';
import JamahTimesFields from '../components/masjid/JamahTimesFields.jsx';
import { jamahFormToBody, jamahToForm } from '../utils/masjid.js';

const inputCls = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500';
const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

const EMPTY = { name: '', name_bn: '', address: '', city: '', district: '', phone: '', description: '' };

export default function MasjidNew() {
  const { location, language } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [coords, setCoords] = useState(null); // { lat, lng } once the user has placed the pin
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [jamah, setJamah] = useState(jamahToForm());
  const [locating, setLocating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const setPin = useCallback((lat, lng) => {
    setCoords({ lat, lng });
    setLatInput(lat.toFixed(6));
    setLngInput(lng.toFixed(6));
    setValidationError('');
  }, []);

  const handleCoordInput = (which, value) => {
    if (which === 'lat') setLatInput(value); else setLngInput(value);
    const lat = parseFloat(which === 'lat' ? value : latInput);
    const lng = parseFloat(which === 'lng' ? value : lngInput);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      setCoords({ lat, lng });
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setPin(pos.coords.latitude, pos.coords.longitude); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const mutation = useMutation({
    mutationFn: createMasjid,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['masjids'] });
      navigate(`/masjids/${created.id}`);
    },
  });

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coords) {
      setValidationError(tr('masjid_coords_required', language));
      return;
    }
    const jamahBody = jamahFormToBody(jamah);
    const hasJamah = Object.values(jamahBody).some(Boolean);
    mutation.mutate({
      ...form,
      latitude: coords.lat,
      longitude: coords.lng,
      ...(hasJamah && { jamah: Object.fromEntries(Object.entries(jamahBody).filter(([, v]) => v)) }),
    });
  };

  const mapCenter = coords ? [coords.lat, coords.lng] : [location.lat, location.lng];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/masjids" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-700 dark:hover:text-green-400 mb-4">
          ← {tr('masjid_back_to_list', language)}
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tr('masjid_new_title', language)}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{tr('masjid_new_subtitle', language)}</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
            <div>
              <label className={labelCls}>{tr('masjid_field_name', language)} *</label>
              <input name="name" value={form.name} onChange={handleField} required minLength={2} maxLength={200} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{tr('masjid_field_name_bn', language)}</label>
              <input name="name_bn" value={form.name_bn} onChange={handleField} maxLength={200} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{tr('masjid_field_address', language)}</label>
              <input name="address" value={form.address} onChange={handleField} maxLength={400} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{tr('masjid_field_city', language)}</label>
                <input name="city" value={form.city} onChange={handleField} maxLength={100} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{tr('masjid_field_district', language)}</label>
                <input name="district" value={form.district} onChange={handleField} maxLength={100} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>{tr('masjid_field_phone', language)}</label>
              <input name="phone" value={form.phone} onChange={handleField} maxLength={40} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{tr('masjid_field_description', language)}</label>
              <textarea name="description" value={form.description} onChange={handleField} rows={3} maxLength={2000} className={inputCls + ' resize-none'} />
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className={labelCls + ' mt-3'}>{tr('masjid_jamah_optional', language)}</p>
              <JamahTimesFields value={jamah} onChange={setJamah} />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className={labelCls + ' mb-0'}>{tr('masjid_field_coords', language)} *</label>
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={locating}
                  className="text-xs font-medium text-primary-700 dark:text-green-400 hover:underline disabled:opacity-60"
                >
                  {locating ? tr('masjids_locating', language) : tr('masjids_use_my_location', language)}
                </button>
              </div>
              <MasjidMap
                center={mapCenter}
                zoom={coords ? 16 : 12}
                selected={coords ? [coords.lat, coords.lng] : null}
                onMapClick={setPin}
                height="320px"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">{tr('masjid_coords_hint', language)}</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number" step="any" placeholder="Latitude"
                  value={latInput} onChange={(e) => handleCoordInput('lat', e.target.value)}
                  className={inputCls + ' font-mono'}
                />
                <input
                  type="number" step="any" placeholder="Longitude"
                  value={lngInput} onChange={(e) => handleCoordInput('lng', e.target.value)}
                  className={inputCls + ' font-mono'}
                />
              </div>
              {validationError && <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>}
            </div>

            {mutation.isError && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {mutation.error?.message || tr('error_generic', language)}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Link to="/masjids" className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                {tr('cancel', language)}
              </Link>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium"
              >
                {mutation.isPending ? tr('masjid_submitting', language) : tr('masjid_submit', language)}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
