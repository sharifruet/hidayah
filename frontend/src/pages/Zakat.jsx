import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { fmt, tr } from '../i18n/translations.js';
import { getNisabPrices } from '../services/zakatService.js';
import { DEFAULT_NISAB_PRICES, GRAMS_PER_BHORI, calculateZakat, formatTaka } from '../utils/zakat.js';
import { formatDate } from '../utils/format.js';

const MONEY_FIELDS = ['business', 'receivables', 'investments', 'other'];
const LABELS = {
  cash: 'zakat_cash', business: 'zakat_business', receivables: 'zakat_receivables',
  investments: 'zakat_investments', other: 'zakat_other', debts: 'zakat_debts',
};

// Accept Bangla numerals typed on a Bangla keyboard ("১২৩" → "123").
const toAsciiDigits = (s) => s.replace(/[০-৯]/g, (d) => String(d.charCodeAt(0) - 0x09e6));

const toNumber = (s) => {
  const n = parseFloat(String(s ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

function Field({ label, value, onChange, suffix }) {
  return (
    <label className="block">
      <span className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</span>
      <span className="flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-primary-500">
        {!suffix && <span className="ps-3 text-sm text-gray-400">৳</span>}
        <input
          inputMode="decimal"
          value={value}
          placeholder="0"
          onChange={(e) => onChange(toAsciiDigits(e.target.value).replace(/[^0-9.]/g, ''))}
          className="w-full bg-transparent px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
        />
        {suffix && <span className="pe-3 text-xs text-gray-400">{suffix}</span>}
      </span>
    </label>
  );
}

function Toggle({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium ${
            value === o.value ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Zakat() {
  const { language } = useApp();
  const { data: serverPrices } = useQuery({ queryKey: ['zakat-nisab'], queryFn: getNisabPrices, staleTime: 6 * 60 * 60 * 1000 });
  const base = serverPrices ?? DEFAULT_NISAB_PRICES;

  const [basis, setBasis] = useState('silver');
  const [unit, setUnit] = useState('bhori');
  // null = use the server's (or bundled) rate until the user types their own.
  const [goldEdit, setGoldEdit] = useState(null);
  const [silverEdit, setSilverEdit] = useState(null);
  const [fields, setFields] = useState({});

  const goldPrice = goldEdit ?? String(base.goldPerBhori);
  const silverPrice = silverEdit ?? String(base.silverPerBhori);
  const set = (key) => (v) => setFields((f) => ({ ...f, [key]: v }));
  const weight = (key) => toNumber(fields[key]) / (unit === 'gram' ? GRAMS_PER_BHORI : 1);
  const unitLabel = tr(unit === 'bhori' ? 'zakat_unit_bhori' : 'zakat_unit_gram', language);

  const result = calculateZakat(
    {
      cash: toNumber(fields.cash),
      goldBhori: weight('gold'),
      silverBhori: weight('silver'),
      business: toNumber(fields.business),
      receivables: toNumber(fields.receivables),
      investments: toNumber(fields.investments),
      other: toNumber(fields.other),
      debts: toNumber(fields.debts),
    },
    { ...base, goldPerBhori: toNumber(goldPrice), silverPerBhori: toNumber(silverPrice) },
    basis
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tr('zakat_title', language)}</h1>
          <button onClick={() => setFields({})} className="text-sm font-medium text-primary-600 dark:text-green-400 hover:underline">
            {tr('zakat_reset', language)}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{tr('zakat_basis', language)}</p>
              <Toggle
                value={basis}
                onChange={setBasis}
                options={[
                  { value: 'silver', label: tr('zakat_basis_silver', language) },
                  { value: 'gold', label: tr('zakat_basis_gold', language) },
                ]}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{tr('zakat_basis_note', language)}</p>

              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-5 mb-2">{tr('zakat_prices', language)}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label={tr('zakat_gold_price', language)} value={goldPrice} onChange={setGoldEdit} />
                <Field label={tr('zakat_silver_price', language)} value={silverPrice} onChange={setSilverEdit} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {fmt('zakat_prices_asof', language, { date: formatDate(base.asOf, language), source: base.source ?? '' })}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tr('zakat_assets', language)}</h2>
                <Toggle
                  value={unit}
                  onChange={setUnit}
                  options={[
                    { value: 'bhori', label: tr('zakat_unit_bhori', language) },
                    { value: 'gram', label: tr('zakat_unit_gram', language) },
                  ]}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={tr(LABELS.cash, language)} value={fields.cash ?? ''} onChange={set('cash')} />
                <div>
                  <Field label={`${tr('zakat_gold', language)} (${unitLabel})`} value={fields.gold ?? ''} onChange={set('gold')} suffix={unitLabel} />
                  {result.goldValue > 0 && <p className="text-xs text-gray-400 mt-1">≈ {formatTaka(result.goldValue, language)}</p>}
                </div>
                <div>
                  <Field label={`${tr('zakat_silver', language)} (${unitLabel})`} value={fields.silver ?? ''} onChange={set('silver')} suffix={unitLabel} />
                  {result.silverValue > 0 && <p className="text-xs text-gray-400 mt-1">≈ {formatTaka(result.silverValue, language)}</p>}
                </div>
                {MONEY_FIELDS.map((k) => (
                  <Field key={k} label={tr(LABELS[k], language)} value={fields[k] ?? ''} onChange={set(k)} />
                ))}
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">{tr('zakat_liabilities', language)}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={tr(LABELS.debts, language)} value={fields.debts ?? ''} onChange={set('debts')} />
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 self-start">
            <div className={`rounded-xl px-5 py-5 text-white ${result.eligible ? 'bg-green-700' : 'bg-gray-700'}`}>
              <p className="text-xs uppercase tracking-wider text-green-100">{tr('zakat_due', language)}</p>
              <p className="text-3xl font-bold mt-1 tabular-nums">{formatTaka(result.zakat, language)}</p>
              {!result.eligible && <p className="text-xs text-gray-200 mt-1">{tr('zakat_not_due', language)}</p>}
              <dl className="mt-4 pt-4 border-t border-white/20 space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-green-100">{tr('zakat_total_assets', language)}</dt><dd className="tabular-nums">{formatTaka(result.totalAssets, language)}</dd></div>
                <div className="flex justify-between"><dt className="text-green-100">{tr('zakat_net', language)}</dt><dd className="tabular-nums font-semibold">{formatTaka(result.net, language)}</dd></div>
                <div className="flex justify-between"><dt className="text-green-100">{tr('zakat_nisab', language)}</dt><dd className="tabular-nums">{formatTaka(result.nisab, language)}</dd></div>
              </dl>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">{tr('zakat_note', language)}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
