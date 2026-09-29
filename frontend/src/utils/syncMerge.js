/**
 * How each synced document is combined when it changed both on this device and on another
 * one since the last sync. Rules favour never losing something the user did: lists are
 * unioned, "done" marks are kept, counts of owed prayers keep the higher number.
 * (A deletion made on one device can come back if the other device changed that same
 * document before syncing — acceptable for bookmarks/favourites.)
 *
 * Mirrors `mobile/src/lib/syncMerge.ts`.
 */
const isObj = (v) => v != null && typeof v === 'object' && !Array.isArray(v);

/** Items unioned by `id`; this device's copy wins for duplicates; order: this device first. */
function unionById(local, remote) {
  if (!Array.isArray(local) || !Array.isArray(remote)) return Array.isArray(local) ? local : remote;
  const seen = new Set(local.map((x) => x?.id));
  return [...local, ...remote.filter((x) => !seen.has(x?.id))];
}

function unionValues(local, remote) {
  if (!Array.isArray(local) || !Array.isArray(remote)) return Array.isArray(local) ? local : remote;
  return [...local, ...remote.filter((x) => !local.includes(x))];
}

/** Per-key numeric max (e.g. counts per prayer / per tasbih preset). */
function maxPerKey(local, remote) {
  if (!isObj(local) || !isObj(remote)) return isObj(local) ? local : remote;
  const out = { ...remote };
  for (const [k, v] of Object.entries(local)) out[k] = Math.max(Number(v) || 0, Number(remote[k]) || 0);
  return out;
}

export const MERGERS = {
  // { 'YYYY-MM-DD': { fajr: true, ... } } — a prayer counts as done if either device says so.
  salah_tracker_log: (local, remote) => {
    if (!isObj(local) || !isObj(remote)) return isObj(local) ? local : remote;
    const out = { ...remote };
    for (const [day, status] of Object.entries(local)) {
      const other = isObj(remote[day]) ? remote[day] : {};
      const merged = { ...other };
      for (const [p, done] of Object.entries(isObj(status) ? status : {})) merged[p] = Boolean(done) || Boolean(other[p]);
      out[day] = merged;
    }
    return out;
  },
  // Owed (qada) prayers: keep the higher count so nothing owed is lost.
  qada_counts: maxPerKey,
  tasbih_counts: maxPerKey,
  quran_bookmarks: unionById,
  hadith_bookmarks: unionById,
  fav_duas: unionValues,
  quran_khatm: (local, remote) =>
    isObj(local) && isObj(remote)
      ? { ...remote, ...local, readSurahs: [...new Set([...(local.readSurahs ?? []), ...(remote.readSurahs ?? [])])] }
      : local ?? remote,
  // The more recent streak wins (ISO dates compare as strings).
  quran_streak: (local, remote) => {
    if (!isObj(local) || !isObj(remote)) return local ?? remote;
    if ((local.lastDate ?? '') !== (remote.lastDate ?? '')) return (local.lastDate ?? '') > (remote.lastDate ?? '') ? local : remote;
    return (local.streak ?? 0) >= (remote.streak ?? 0) ? local : remote;
  },
  // Where you left off reading: this device (it's the one in your hand).
  quran_last_read: (local, remote) => local ?? remote,
  // { slug: { ..., updatedAt } } — newest position per book.
  book_positions: (local, remote) => {
    if (!isObj(local) || !isObj(remote)) return isObj(local) ? local : remote;
    const out = { ...remote };
    for (const [slug, pos] of Object.entries(local)) {
      if (!out[slug] || (pos?.updatedAt ?? 0) >= (out[slug]?.updatedAt ?? 0)) out[slug] = pos;
    }
    return out;
  },
};

export const SYNC_KEYS = Object.keys(MERGERS);

export function mergeDocument(key, local, remote) {
  const merge = MERGERS[key];
  return merge ? merge(local, remote) : local ?? remote;
}
