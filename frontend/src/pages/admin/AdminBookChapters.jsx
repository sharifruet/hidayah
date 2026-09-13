import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const TYPES = ['section', 'chapter', 'scene', 'paragraph'];

const CHILD_TYPE = {
  section: 'chapter',
  chapter: 'scene',
  scene: 'paragraph',
  paragraph: 'paragraph',
};

const EMPTY = { parent_id: '', type: 'chapter', position: '', title: '', content: '' };

function buildTree(nodes) {
  const byId = new Map(nodes.map(n => [n.id, { ...n, children: [] }]));
  const roots = [];
  for (const node of byId.values()) {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id).children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortTree = (list) => {
    list.sort((a, b) => a.position - b.position);
    list.forEach(n => sortTree(n.children));
  };
  sortTree(roots);
  return roots;
}

function flattenWithDepth(tree, depth = 0, out = []) {
  for (const node of tree) {
    out.push({ node, depth });
    flattenWithDepth(node.children, depth + 1, out);
  }
  return out;
}

function descendantIds(nodeId, nodes, out = new Set()) {
  for (const n of nodes) {
    if (n.parent_id === nodeId) {
      out.add(n.id);
      descendantIds(n.id, nodes, out);
    }
  }
  return out;
}

export default function AdminBookChapters() {
  const { id } = useParams();
  const { authFetch } = useAdmin();
  const [book, setBook]       = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // null | 'add' | chapter object
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      authFetch(`/books/${id}`),
      authFetch(`/books/${id}/chapters`),
    ]).then(([b, c]) => {
      setBook(b);
      setChapters(c);
    }).finally(() => setLoading(false));
  }, [authFetch, id]);

  useEffect(() => { load(); }, [load]);

  const tree = useMemo(() => buildTree(chapters), [chapters]);
  const flat = useMemo(() => flattenWithDepth(tree), [tree]);

  function nextPosition(parentId) {
    const siblings = chapters.filter(c => (c.parent_id || null) === (parentId || null));
    return siblings.length ? Math.max(...siblings.map(c => c.position)) + 1 : 1;
  }

  function openAddRoot() {
    setForm({ ...EMPTY, parent_id: '', type: 'chapter', position: nextPosition(null) });
    setError('');
    setModal('add');
  }

  function openAddChild(parent) {
    const childType = CHILD_TYPE[parent.type] || 'chapter';
    setForm({ ...EMPTY, parent_id: parent.id, type: childType, position: nextPosition(parent.id) });
    setError('');
    setModal('add');
  }

  function openEdit(chapter) {
    setForm({ ...chapter, parent_id: chapter.parent_id || '' });
    setError('');
    setModal(chapter);
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
      parent_id: form.parent_id ? Number(form.parent_id) : null,
      position: Number(form.position),
    };
    try {
      if (modal === 'add') {
        await authFetch(`/books/${id}/chapters`, { method: 'POST', body: JSON.stringify(body) });
      } else {
        await authFetch(`/chapters/${modal.id}`, { method: 'PUT', body: JSON.stringify(body) });
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(chapter) {
    const descendants = descendantIds(chapter.id, chapters);
    const warning = descendants.size
      ? ` This will also delete ${descendants.size} nested node(s) beneath it.`
      : '';
    if (!confirm(`Delete "${chapter.title || chapter.type + ' ' + chapter.position}"?${warning}`)) return;
    await authFetch(`/chapters/${chapter.id}`, { method: 'DELETE' });
    load();
  }

  // Valid parent options: everything except the node being edited and its own descendants.
  const parentOptions = useMemo(() => {
    if (!modal || modal === 'add') return flat;
    const excluded = descendantIds(modal.id, chapters);
    excluded.add(modal.id);
    return flat.filter(({ node }) => !excluded.has(node.id));
  }, [flat, modal, chapters]);

  return (
    <AdminLayout>
      <div className="p-8">
        <Link to="/admin/books" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Books
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Chapters {book ? `— ${book.title}` : ''}
          </h1>
          <button onClick={openAddRoot} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
            + Add Top-Level Node
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
                  <th className="px-4 py-3 font-medium w-24">Type</th>
                  <th className="px-4 py-3 font-medium w-16">#</th>
                  <th className="px-4 py-3 font-medium w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {flat.map(({ node, depth }) => (
                  <tr key={node.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium" style={{ paddingLeft: `${16 + depth * 24}px` }}>
                      {node.title || <span className="text-gray-400 italic">untitled</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {node.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{node.position}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openAddChild(node)} className="text-green-600 dark:text-green-400 hover:underline text-xs">+ Child</button>
                      <button onClick={() => openEdit(node)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(node)} className="text-red-500 dark:text-red-400 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
                {flat.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No chapters yet</td></tr>
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
                {modal === 'add' ? 'Add Node' : 'Edit Node'}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Type</label>
                  <select name="type" value={form.type} onChange={handleField} className={inputCls}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Parent</label>
                  <select name="parent_id" value={form.parent_id} onChange={handleField} className={inputCls}>
                    <option value="">— Top level —</option>
                    {parentOptions.map(({ node, depth }) => (
                      <option key={node.id} value={node.id}>
                        {'—'.repeat(depth)} {node.title || `${node.type} ${node.position}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Position *</label>
                  <input type="number" name="position" value={form.position} onChange={handleField} required className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Title</label>
                  <input type="text" name="title" value={form.title ?? ''} onChange={handleField} className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Content <span className="text-gray-400 font-normal">(leave empty for a container node, e.g. a section with no text of its own)</span>
                </label>
                <textarea name="content" value={form.content ?? ''} onChange={handleField} rows={12}
                  className={inputCls + ' resize-y font-mono text-xs'} />
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
