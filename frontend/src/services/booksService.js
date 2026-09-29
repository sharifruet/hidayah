import { API_BASE_URL, API_VERSION } from '../utils/constants.js';
const API_BASE = `${API_BASE_URL}/${API_VERSION}`;

function apiError(message, code, status) {
  return Object.assign(new Error(message), { code, status });
}

// Rejects with the same `{ message, code, status }` shape as `services/api.js`, so
// `ErrorMessage` can tell "not found" / network / server errors apart.
async function get(path) {
  let res;
  try {
    res = await fetch(`${API_BASE}/books${path}`);
  } catch {
    throw apiError('Network error', 'NETWORK_ERROR', 0);
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw apiError(err?.error?.message || `HTTP ${res.status}`, err?.error?.code || 'UNKNOWN_ERROR', res.status);
  }
  return res.json();
}

export const booksService = {
  listBooks: ({ topic, lang, q, page, limit } = {}) => {
    const params = new URLSearchParams();
    if (topic) params.set('topic', topic);
    if (lang)  params.set('lang', lang);
    if (q)     params.set('q', q);
    if (page)  params.set('page', page);
    if (limit) params.set('limit', limit);
    const qs = params.toString();
    return get(qs ? `?${qs}` : '');
  },
  getBook: (slug) => get(`/${slug}`),
  listTopics: () => get('/topics'),
  listChapters: (slug) => get(`/${slug}/chapters`),
  getChapter: (slug, id) => get(`/${slug}/chapters/${id}`),
};
