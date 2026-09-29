import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { fmt, tr } from '../i18n/translations.js';
import { userErrorMessage } from '../utils/errors.js';
import { relativeTime } from '../utils/masjid.js';
import {
  deleteBackup, disableSync, enableSync, getLastSyncAt, getSyncCode, restoreWithCode, rotateSyncCode, syncNow,
} from '../utils/sync.js';

const CODE_RE = /^[0-9A-HJKMNP-TV-Z]{16}$/;
const normalize = (s) => s.toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');

function Btn({ children, onClick, busy, variant = 'primary' }) {
  const cls = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700',
    danger: 'border border-rose-300 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20',
  }[variant];
  return (
    <button type="button" onClick={onClick} disabled={busy} className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 ${cls}`}>
      {busy ? '…' : children}
    </button>
  );
}

/** Optional backup with a sync code — no account details, just a code to restore with. */
export default function Sync() {
  const { language } = useApp();
  const [code, setCode] = useState(getSyncCode);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [entering, setEntering] = useState(false);
  const [input, setInput] = useState('');
  const [lastSync, setLastSync] = useState(getLastSyncAt);

  async function run(kind, fn) {
    setBusy(kind);
    setError('');
    setNotice('');
    try {
      await fn();
      setLastSync(getLastSyncAt());
    } catch (e) {
      setError(kind === 'restore' && e?.status === 404 ? tr('sync_invalid_code', language) : userErrorMessage(e, language));
    } finally {
      setBusy(null);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tr('sync_title', language)}</h1>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <p className="text-sm text-gray-700 dark:text-gray-300">{tr('sync_intro', language)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{tr('sync_whats_synced', language)}</p>
        </section>

        {error && <p role="alert" className="px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        {notice && <p role="status" className="px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-sm text-green-700 dark:text-green-300">{notice}</p>}

        {code ? (
          <>
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">☁ {tr('sync_on', language)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{tr('sync_code_label', language)}</p>
              <p className="text-2xl font-bold tracking-widest font-mono text-gray-900 dark:text-gray-100 my-1" dir="ltr">
                {revealed ? code : code.replace(/[0-9A-Z]/g, '•')}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => setRevealed((r) => !r)} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200">
                  {tr(revealed ? 'sync_hide' : 'sync_show', language)}
                </button>
                <button onClick={copy} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200">
                  {tr(copied ? 'sync_copied' : 'sync_copy', language)}
                </button>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400">{tr('sync_code_warning', language)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                {lastSync ? fmt('sync_last', language, { time: relativeTime(new Date(lastSync).toISOString(), language) }) : tr('sync_never', language)}
              </p>
            </section>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <Btn busy={busy === 'sync'} onClick={() => run('sync', () => syncNow())}>
                {busy === 'sync' ? tr('sync_syncing', language) : tr('sync_now', language)}
              </Btn>
              <Btn
                variant="secondary"
                busy={busy === 'rotate'}
                onClick={() => window.confirm(tr('sync_rotate_confirm', language)) && run('rotate', async () => { setCode(await rotateSyncCode()); setRevealed(true); })}
              >
                {tr('sync_rotate', language)}
              </Btn>
              <Btn
                variant="secondary"
                onClick={() => { if (window.confirm(tr('sync_turn_off_note', language))) { disableSync(); setCode(null); setLastSync(null); } }}
              >
                {tr('sync_turn_off', language)}
              </Btn>
              <Btn
                variant="danger"
                busy={busy === 'delete'}
                onClick={() => window.confirm(tr('sync_delete_confirm', language)) && run('delete', async () => { await deleteBackup(); setCode(null); })}
              >
                {tr('sync_delete', language)}
              </Btn>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <Btn busy={busy === 'enable'} onClick={() => run('enable', async () => { setCode(await enableSync()); setRevealed(true); })}>
              {tr('sync_enable', language)}
            </Btn>
            {entering ? (
              <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <label htmlFor="sync-code" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">{tr('sync_enter_code', language)}</label>
                <input
                  id="sync-code"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  autoComplete="off"
                  spellCheck={false}
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{tr('sync_code_format', language)}</p>
                <Btn
                  busy={busy === 'restore'}
                  onClick={() => {
                    if (!CODE_RE.test(normalize(input))) { setError(tr('sync_code_format', language)); return; }
                    run('restore', async () => {
                      await restoreWithCode(input);
                      setCode(getSyncCode());
                      setNotice(tr('sync_restored', language));
                      setEntering(false);
                    });
                  }}
                >
                  {tr('sync_restore', language)}
                </Btn>
              </section>
            ) : (
              <Btn variant="secondary" onClick={() => setEntering(true)}>{tr('sync_have_code', language)}</Btn>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
