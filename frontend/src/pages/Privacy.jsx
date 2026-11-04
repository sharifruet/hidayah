import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { fmt, tr } from '../i18n/translations.js';
import { formatDate } from '../utils/format.js';
import { CONTACT_EMAIL, PRIVACY_POLICY_UPDATED } from '../utils/constants.js';

/** Section order; each has `pp_<key>_title` and `pp_<key>_body` strings. */
const SECTIONS = ['summary', 'device', 'location', 'server', 'masjid', 'sync', 'notif', 'third', 'children', 'security', 'rights', 'changes'];

const CARD = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 space-y-2';
const TEXT = 'text-sm text-gray-700 dark:text-gray-300';

/** Splits a section body into paragraphs and bullet lists ("\n"-separated; a "• " line is a bullet). */
function blocks(text) {
  const out = [];
  for (const line of text.split('\n')) {
    if (line.startsWith('• ')) {
      const last = out[out.length - 1];
      if (last?.items) last.items.push(line.slice(2));
      else out.push({ items: [line.slice(2)] });
    } else {
      out.push({ text: line });
    }
  }
  return out;
}

function Body({ text }) {
  return blocks(text).map((block, i) =>
    block.items ? (
      <ul key={i} className={`list-disc ps-5 space-y-1.5 ${TEXT}`}>
        {block.items.map((item, j) => <li key={j}>{item}</li>)}
      </ul>
    ) : (
      <p key={i} className={TEXT}>{block.text}</p>
    )
  );
}

/** Privacy policy for the mobile app and this site — the public URL for the app-store listings. */
export default function Privacy() {
  const { language } = useApp();
  const site = typeof window !== 'undefined' ? window.location.host : '';
  const vars = { site };
  const updated = formatDate(PRIVACY_POLICY_UPDATED, language);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tr('pp_title', language)}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{fmt('pp_updated', language, { date: updated })}</p>
        </header>

        <section className={CARD}>
          <p className={TEXT}>{tr('pp_intro', language)}</p>
          <p className={TEXT}>{fmt('pp_applies', language, vars)}</p>
        </section>

        {SECTIONS.map((key) => (
          <section key={key} className={CARD}>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{tr(`pp_${key}_title`, language)}</h2>
            <Body text={fmt(`pp_${key}_body`, language, vars)} />
          </section>
        ))}

        <section className={CARD}>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{tr('pp_contact_title', language)}</h2>
          <p className={TEXT}>{tr('pp_contact_body', language)}</p>
          <dl className="text-sm space-y-1">
            <div className="flex gap-2">
              <dt className="text-gray-500 dark:text-gray-400">{tr('pp_contact_email', language)}:</dt>
              <dd>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-green-700 dark:text-green-400 hover:underline" dir="ltr">{CONTACT_EMAIL}</a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-500 dark:text-gray-400">{tr('pp_contact_web', language)}:</dt>
              <dd>
                <Link to="/" className="text-green-700 dark:text-green-400 hover:underline" dir="ltr">{site}</Link>
              </dd>
            </div>
          </dl>
        </section>

        <p className="text-xs text-gray-500 dark:text-gray-400">{tr('pp_language_note', language)}</p>
      </div>
    </div>
  );
}
