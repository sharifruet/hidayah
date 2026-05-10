import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const EMPTY = {
  slug: '', title: '', title_ar: '', subtitle: '', description: '',
  author: '', translator: '', publisher: '', published_year: '',
  language: 'en', primary_text_language: 'en',
  islamic_topics: [], cover_url: '', embed_url: '', pdf_url: '',
  page_count: '', license_class: 'public_domain', status: 'draft',
};

const TOPICS = ['hadith','seerah','fiqh','aqeedah','tafsir','spirituality','history','dawah','children'];

export default function AdminBooks() {
  const { authFetch } = useAdmin();
  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // null | 'add' | book object
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    authFetch('/books').then(setBooks).finally(() => setLoading(false));
  }, [authFetch]);

  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(EMPTY); setError(''); setModal('add'); }
  function openEdit(book) {
    setForm({
      ...book,
      islamic_topics: Array.isArray(book.islamic_topics) ? book.islamic_topics : [],
      published_year: book.published_year ?? '',
      page_count: book.page_count ?? '',
    });
    setError('');
    setModal(book);
  }

  function handleField(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function toggleTopic(t) {
    setForm(f => ({
      ...f,
      islamic_topics: f.islamic_topics.includes(t)
        ? f.islamic_topics.filter(x => x !== t)
        : [...f.islamic_topics, t],
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const body = {
      ...form,
      published_year: form.published_year ? Number(form.published_year) : null,
      page_count: form.page_count ? Number(form.page_count) : null,
    };
    try {
      if (modal === 'add') {
        await authFetch('/books', { method: 'POST', body: JSON.stringify(body) });
      } else {
        await authFetch(`/books/${modal.id}`, { method: 'PUT', body: JSON.stringify(body) });
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(book) {
    if (!confirm(`Delete "${book.title}"?`)) return;
    await authFetch(`/books/${book.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Books</h1>
          <button onClick={openAdd} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
            + Add Book
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Author</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">{book.title}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{book.author || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        book.status === 'live'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(book)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(book)} className="text-red-500 dark:text-red-400 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No books yet</td></tr>
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
                {modal === 'add' ? 'Add Book' : 'Edit Book'}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Slug *" name="slug" value={form.slug} onChange={handleField} required />
                <Field label="Title *" name="title" value={form.title} onChange={handleField} required />
                <Field label="Arabic Title" name="title_ar" value={form.title_ar} onChange={handleField} />
                <Field label="Subtitle" name="subtitle" value={form.subtitle} onChange={handleField} />
                <Field label="Author" name="author" value={form.author} onChange={handleField} />
                <Field label="Translator" name="translator" value={form.translator} onChange={handleField} />
                <Field label="Publisher" name="publisher" value={form.publisher} onChange={handleField} />
                <Field label="Year" name="published_year" value={form.published_year} onChange={handleField} type="number" />
                <Field label="Pages" name="page_count" value={form.page_count} onChange={handleField} type="number" />
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
                  <select name="status" value={form.status} onChange={handleField} className={selectCls}>
                    <option value="draft">Draft</option>
                    <option value="live">Live</option>
                    <option value="removed">Removed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleField} rows={3}
                  className={inputCls + ' resize-none'} />
              </div>

              <Field label="Cover URL" name="cover_url" value={form.cover_url} onChange={handleField} />
              <Field label="Embed URL" name="embed_url" value={form.embed_url} onChange={handleField} />
              <Field label="PDF URL" name="pdf_url" value={form.pdf_url} onChange={handleField} />

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Topics</label>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map(t => (
                    <button key={t} type="button" onClick={() => toggleTopic(t)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        form.islamic_topics.includes(t)
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
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
const selectCls = inputCls;

function Field({ label, name, value, onChange, required, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input type={type} name={name} value={value ?? ''} onChange={onChange} required={required} className={inputCls} />
    </div>
  );
}
