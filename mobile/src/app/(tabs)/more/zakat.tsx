import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { fmt, tr } from '../../../data/translations';
import {
  DEFAULT_NISAB_PRICES, EMPTY_ZAKAT_INPUT, GRAMS_PER_BHORI, calculateZakat, fetchNisabPrices, formatTaka,
  type NisabBasis, type ZakatInput,
} from '../../../lib/zakat';
import { formatDate } from '../../../lib/format';
import { parseLocalISODate } from '../../../lib/dates';

type MoneyField = Exclude<keyof ZakatInput, 'goldBhori' | 'silverBhori'>;
type Unit = 'bhori' | 'gram';

const ASSET_FIELDS: { key: MoneyField; labelKey: string }[] = [
  { key: 'cash', labelKey: 'zakat_cash' },
  { key: 'business', labelKey: 'zakat_business' },
  { key: 'receivables', labelKey: 'zakat_receivables' },
  { key: 'investments', labelKey: 'zakat_investments' },
  { key: 'other', labelKey: 'zakat_other' },
];

const toNumber = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

function NumberField({
  label, value, onChange, suffix,
}: { label: string; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <View className="mb-3">
      <Text className="font-body text-xs text-ink-500 dark:text-ink-400 mb-1">{label}</Text>
      <View className="flex-row items-center bg-ink-50 dark:bg-ink-800 rounded-xl px-3">
        {!suffix ? <Text className="font-body-medium text-sm text-ink-400 mr-1">৳</Text> : null}
        <TextInput
          value={value}
          onChangeText={(v) => onChange(v.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#adb5c2"
          className="flex-1 py-2.5 font-body text-sm text-ink-900 dark:text-white"
        />
        {suffix ? <Text className="font-body text-xs text-ink-400 ml-1">{suffix}</Text> : null}
      </View>
    </View>
  );
}

export default function ZakatScreen() {
  const { language } = useApp();
  const { data: serverPrices } = useQuery({ queryKey: ['zakat-nisab'], queryFn: fetchNisabPrices, staleTime: 6 * 60 * 60 * 1000 });
  const prices0 = serverPrices ?? DEFAULT_NISAB_PRICES;

  const [basis, setBasis] = useState<NisabBasis>('silver');
  const [unit, setUnit] = useState<Unit>('bhori');
  // null = use the server's (or bundled) rate; a string once the user edits it.
  const [goldEdit, setGoldPrice] = useState<string | null>(null);
  const [silverEdit, setSilverPrice] = useState<string | null>(null);
  const goldPrice = goldEdit ?? String(prices0.goldPerBhori);
  const silverPrice = silverEdit ?? String(prices0.silverPerBhori);
  const [fields, setFields] = useState<Record<string, string>>({});

  const set = (key: string) => (v: string) => setFields((f) => ({ ...f, [key]: v }));
  const weight = (key: string) => toNumber(fields[key] ?? '') / (unit === 'gram' ? GRAMS_PER_BHORI : 1);

  const input: ZakatInput = {
    ...EMPTY_ZAKAT_INPUT,
    ...Object.fromEntries(ASSET_FIELDS.map((f) => [f.key, toNumber(fields[f.key] ?? '')])),
    goldBhori: weight('gold'),
    silverBhori: weight('silver'),
    debts: toNumber(fields.debts ?? ''),
  };
  const prices = { ...prices0, goldPerBhori: toNumber(goldPrice), silverPerBhori: toNumber(silverPrice) };
  const result = calculateZakat(input, prices, basis);
  const unitLabel = tr(unit === 'bhori' ? 'zakat_unit_bhori' : 'zakat_unit_gram', language);

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white flex-1">{tr('zakat_title', language)}</Text>
        <TouchableOpacity onPress={() => setFields({})} className="px-2 py-1">
          <Text className="font-body-medium text-sm text-primary-600">{tr('zakat_reset', language)}</Text>
        </TouchableOpacity>
      </View>

      {/* Result */}
      <View className={`rounded-2xl px-5 py-4 mb-4 ${result.eligible ? 'bg-primary-700' : 'bg-ink-800'}`}>
        <Text className="font-body-medium text-xs uppercase tracking-wider text-primary-200">{tr('zakat_due', language)}</Text>
        <Text className="font-body-bold text-3xl text-white mt-1">{formatTaka(result.zakat, language)}</Text>
        {!result.eligible ? <Text className="font-body text-xs text-ink-300 mt-1">{tr('zakat_not_due', language)}</Text> : null}
        <View className="flex-row justify-between mt-3 pt-3 border-t border-white/15">
          <View>
            <Text className="font-body text-[11px] text-primary-200">{tr('zakat_net', language)}</Text>
            <Text className="font-body-semibold text-sm text-white">{formatTaka(result.net, language)}</Text>
          </View>
          <View className="items-end">
            <Text className="font-body text-[11px] text-primary-200">{tr('zakat_nisab', language)}</Text>
            <Text className="font-body-semibold text-sm text-white">{formatTaka(result.nisab, language)}</Text>
          </View>
        </View>
      </View>

      {/* Nisab basis + prices */}
      <Card className="p-4 mb-4">
        <Text className="font-body-medium text-sm text-ink-900 dark:text-white mb-2">{tr('zakat_basis', language)}</Text>
        <View className="flex-row bg-ink-100 dark:bg-ink-800 rounded-lg p-1 mb-2">
          {(['silver', 'gold'] as NisabBasis[]).map((b) => (
            <TouchableOpacity key={b} onPress={() => setBasis(b)} className={`flex-1 py-2 rounded-md items-center ${basis === b ? 'bg-white dark:bg-ink-700' : ''}`}>
              <Text className={`font-body-medium text-xs ${basis === b ? 'text-ink-900 dark:text-white' : 'text-ink-400'}`}>
                {tr(b === 'silver' ? 'zakat_basis_silver' : 'zakat_basis_gold', language)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="font-body text-[11px] text-ink-400 mb-3">{tr('zakat_basis_note', language)}</Text>

        <Text className="font-body-medium text-sm text-ink-900 dark:text-white mb-2">{tr('zakat_prices', language)}</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <NumberField label={tr('zakat_gold_price', language)} value={goldPrice} onChange={setGoldPrice} />
          </View>
          <View className="flex-1">
            <NumberField label={tr('zakat_silver_price', language)} value={silverPrice} onChange={setSilverPrice} />
          </View>
        </View>
        <Text className="font-body text-[11px] text-ink-400">
          {fmt('zakat_prices_asof', language, {
            date: /^\d{4}-\d{2}-\d{2}$/.test(prices0.asOf)
              ? formatDate(parseLocalISODate(prices0.asOf), language, { day: 'numeric', month: 'long', year: 'numeric' })
              : prices0.asOf,
            source: prices0.source ?? '',
          })}
        </Text>
      </Card>

      {/* Assets */}
      <Card className="p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{tr('zakat_assets', language)}</Text>
          <View className="flex-row bg-ink-100 dark:bg-ink-800 rounded-lg p-0.5">
            {(['bhori', 'gram'] as Unit[]).map((u) => (
              <TouchableOpacity key={u} onPress={() => setUnit(u)} className={`px-2.5 py-1 rounded-md ${unit === u ? 'bg-white dark:bg-ink-700' : ''}`}>
                <Text className={`font-body-medium text-[11px] ${unit === u ? 'text-ink-900 dark:text-white' : 'text-ink-400'}`}>
                  {tr(u === 'bhori' ? 'zakat_unit_bhori' : 'zakat_unit_gram', language)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <NumberField label={tr('zakat_cash', language)} value={fields.cash ?? ''} onChange={set('cash')} />
        <NumberField label={`${tr('zakat_gold', language)} (${unitLabel})`} value={fields.gold ?? ''} onChange={set('gold')} suffix={unitLabel} />
        {result.goldValue > 0 ? <Text className="font-body text-[11px] text-ink-400 -mt-2 mb-3">≈ {formatTaka(result.goldValue, language)}</Text> : null}
        <NumberField label={`${tr('zakat_silver', language)} (${unitLabel})`} value={fields.silver ?? ''} onChange={set('silver')} suffix={unitLabel} />
        {result.silverValue > 0 ? <Text className="font-body text-[11px] text-ink-400 -mt-2 mb-3">≈ {formatTaka(result.silverValue, language)}</Text> : null}
        {ASSET_FIELDS.filter((f) => f.key !== 'cash').map((f) => (
          <NumberField key={f.key} label={tr(f.labelKey, language)} value={fields[f.key] ?? ''} onChange={set(f.key)} />
        ))}
        <View className="flex-row justify-between pt-2 border-t border-ink-100 dark:border-ink-800">
          <Text className="font-body-medium text-sm text-ink-700 dark:text-ink-300">{tr('zakat_total_assets', language)}</Text>
          <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{formatTaka(result.totalAssets, language)}</Text>
        </View>
      </Card>

      <Card className="p-4 mb-4">
        <Text className="font-body-semibold text-sm text-ink-900 dark:text-white mb-3">{tr('zakat_liabilities', language)}</Text>
        <NumberField label={tr('zakat_debts', language)} value={fields.debts ?? ''} onChange={set('debts')} />
      </Card>

      <Text className="font-body text-xs text-ink-400 leading-relaxed">{tr('zakat_note', language)}</Text>
    </Screen>
  );
}
