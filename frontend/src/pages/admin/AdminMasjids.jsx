import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import JamahTimesFields from '../../components/masjid/JamahTimesFields.jsx';
import { jamahFormToBody, jamahToForm, relativeTime, absoluteTime } from '../../utils/masjid.js';

const EMPTY = {
  name: '', name_bn: '', address: '', city: '', district: '',
  latitude: '', longitude: '', phone: '', description: '', status: 'active',
};

export default function AdminMasjids() {
  const { authFetch } = useAdmin();
  const [masjids, setMasjids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [q, setQ]             = useState('');
  const [modal, setModal]     = useState(null); // 'add' | masjid object
  const [form, setForm]       = useState(EMPTY);
  const [jamah, setJamah]     = useState(jamahToForm());
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    authFetch('/masjids').then(setMasjids).finally(() => setLoading(false));
  }, [authFetch]);

  useEffect(() => { load(); }, [load]);

  const visible = masjids.filter(m => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (!q.trim()) return true;
    const needle = q.trim().toLowerCase();
    return [m.name, m.name_bn, m.address, m.city, m.district]
      .some(v => v && v.toLowerCase().includes(needle));
  });

  function openAdd() {
    setForm(EMPTY); setJamah(jamahToForm()); setError(''); setModal('add');
  }
  function openEdit(m) {
    setForm({
      name: m.name, name_bn: m.name_bn || '', address: m.address || '', city: m.city || '',
      district: m.district || '', latitude: String(m.latitude), longitude: String(m.longitude),
      phone: m.phone || '', description: m.description || '', status: m.status,
    });
    setJamah(jamahToForm(m.jamah));
    setError('');
    setModal(m);
  }

  function handleField(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const body = {
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      jamah: jamahFormToBody(jamah),
    };
    try {
      if (modal === 'add') {
        await authFetch('/masjids', { method: 'POST', body: JSON.stringify(body) });
      } else {
        await authFetch(`/masjids/${modal.id}`, { method: 'PUT', body: JSON.stringify(body) });
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(m) {
    const status = m.status === 'active' ? 'hidden' : 'active';
    await authFetch(`/masjids/${m.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...m, status, jamah: undefined }),
    });
    load();
  }

  async function handleDelete(m) {
    if (!confirm(`Delete "${m.name}" and its jamah times?`)) return;
    await authFetch(`/masjids/${m.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Masjids</h1>
          <button onClick={openAdd} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
            + Add Masjid
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex gap-2">
            {['all', 'active', 'hidden'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  filter === s
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, address, city…"
            className="flex-1 min-w-[200px] max-w-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <span className="text-xs text-gray-400">{visible.length} of {masjids.length}</span>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Jamah</th>
                  <th className="px-4 py-3 font-medium">Jamah updated</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {visible.map(m => {
                  const jamahCount = Object.values(m.jamah || {}).filter(Boolean).length;
                  return (
                    <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{m.name}</p>
                        {m.name_bn && <p className="text-xs text-gray-400 truncate">{m.name_bn}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        <p className="truncate max-w-[220px]">{[m.address, m.city, m.district].filter(Boolean).join(', ') || '—'}</p>
                        <p className="text-xs font-mono text-gray-400">{m.latitude.toFixed(5)}, {m.longitude.toFixed(5)}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{jamahCount ? `${jamahCount}/6` : '—'}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs" title={absoluteTime(m.jamah_updated_at)}>
                        {m.jamah_updated_at ? relativeTime(m.jamah_updated_at) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          m.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}>{m.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(m)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">Edit</button>
                          <button onClick={() => toggleStatus(m)} className="text-amber-600 dark:text-amber-400 hover:underline text-xs">
                            {m.status === 'active' ? 'Hide' : 'Show'}
                          </button>
                          <button onClick={() => handleDelete(m)} className="text-red-500 dark:text-red-400 hover:underline text-xs">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {visible.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No masjids found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {modal === 'add' ? 'Add Masjid' : 'Edit Masjid'}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input name="name" value={form.name} onChange={handleField} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Name (Bangla)</label>
                  <input name="name_bn" value={form.name_bn} onChange={handleField} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Address</label>
                <input name="address" value={form.address} onChange={handleField} className={inputCls} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>City</label>
                  <input name="city" value={form.city} onChange={handleField} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>District</label>
                  <input name="district" value={form.district} onChange={handleField} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleField} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Latitude *</label>
                  <input type="number" step="any" name="latitude" value={form.latitude} onChange={handleField} required min={-90} max={90} className={inputCls + ' font-mono'} />
                </div>
                <div>
                  <label className={labelCls}>Longitude *</label>
                  <input type="number" step="any" name="longitude" value={form.longitude} onChange={handleField} required min={-180} max={180} className={inputCls + ' font-mono'} />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select name="status" value={form.status} onChange={handleField} className={inputCls}>
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea name="description" value={form.description} onChange={handleField} rows={2} className={inputCls + ' resize-none'} />
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className={labelCls + ' mt-3'}>Jamah times (blank = clear)</p>
                <JamahTimesFields value={jamah} onChange={setJamah} />
                {modal !== 'add' && modal.jamah_updated_at && (
                  <p className="mt-2 text-xs text-gray-400">Last updated {relativeTime(modal.jamah_updated_at)} · {absoluteTime(modal.jamah_updated_at)}</p>
                )}
              </div>

              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500';
const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';
