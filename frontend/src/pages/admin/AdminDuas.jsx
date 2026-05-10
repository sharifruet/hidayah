import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const CATEGORIES = ['morning','evening','prayer','sleep','waking','general'];

const EMPTY = {
  category: 'morning', arabic: '', transliteration: '', translation_en: '',
  translation_bn: '', reference: '', count: 1, quran_surah: '', quran_ayah: '', sort_order: 0,
};

export default function AdminDuas() {
  const { authFetch } = useAdmin();
  const [duas, setDuas]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    authFetch('/duas').then(setDuas).finally(() => setLoading(false));
  }, [authFetch]);

  useEffect(() => { load(); }, [load]);

  const visible = filter === 'all' ? duas : duas.filter(d => d.category === filter);

  function openAdd() { setForm(EMPTY); setError(''); setModal('add'); }
  function openEdit(d) {
    setForm({ ...d, quran_surah: d.quran_surah ?? '', quran_ayah: d.quran_ayah ?? '' });
    setError('');
    setModal(d);
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
      count: Number(form.count) || 1,
      sort_order: Number(form.sort_order) || 0,
      quran_surah: form.quran_surah ? Number(form.quran_surah) : null,
      quran_ayah: form.quran_ayah ? Number(form.quran_ayah) : null,
    };
    try {
      if (modal === 'add') {
        await authFetch('/duas', { method: 'POST', body: JSON.stringify(body) });
      } else {
        await authFetch(`/duas/${modal.id}`, { method: 'PUT', body: JSON.stringify(body) });
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(dua) {
    if (!confirm('Delete this du\'a?')) return;
    await authFetch(`/duas/${dua.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Du'a & Adhkar</h1>
          <button onClick={openAdd} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
            + Add Du'a
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {['all', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                filter === c
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}>
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Arabic</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {visible.map(dua => (
                  <tr key={dua.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-arabic text-gray-900 dark:text-gray-100 truncate text-right" dir="rtl">
                        {dua.arabic}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{dua.transliteration}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 capitalize">{dua.category}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{dua.reference || '—'}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(dua)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(dua)} className="text-red-500 dark:text-red-400 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No duas in this category</td></tr>
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
                {modal === 'add' ? "Add Du'a" : "Edit Du'a"}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category *</label>
                  <select name="category" value={form.category} onChange={handleField} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Repeat count</label>
                  <input type="number" name="count" value={form.count} onChange={handleField} min={1} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Arabic text *</label>
                <textarea name="arabic" value={form.arabic} onChange={handleField} rows={3} required
                  dir="rtl" className={inputCls + ' resize-none font-arabic text-lg text-right'} />
              </div>
              <div>
                <label className={labelCls}>Transliteration</label>
                <input name="transliteration" value={form.transliteration} onChange={handleField} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>English translation *</label>
                <textarea name="translation_en" value={form.translation_en} onChange={handleField} rows={2} required className={inputCls + ' resize-none'} />
              </div>
              <div>
                <label className={labelCls}>Bengali translation</label>
                <textarea name="translation_bn" value={form.translation_bn} onChange={handleField} rows={2} className={inputCls + ' resize-none'} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className={labelCls}>Reference</label>
                  <input name="reference" value={form.reference} onChange={handleField} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Qur'an Surah</label>
                  <input type="number" name="quran_surah" value={form.quran_surah} onChange={handleField} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Qur'an Ayah</label>
                  <input type="number" name="quran_ayah" value={form.quran_ayah} onChange={handleField} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Sort order</label>
                <input type="number" name="sort_order" value={form.sort_order} onChange={handleField} className={inputCls} />
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
