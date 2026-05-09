import { API_BASE_URL, API_VERSION } from '../utils/constants.js';
const API_BASE = `${API_BASE_URL}/${API_VERSION}`;

async function get(path) {
  const res = await fetch(`${API_BASE}/books${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
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
};
