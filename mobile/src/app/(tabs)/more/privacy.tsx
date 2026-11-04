import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { fmt, tr } from '../../../data/translations';
import { parseLocalISODate } from '../../../lib/dates';
import { formatDate } from '../../../lib/format';
import { PRIVACY_CONTACT_EMAIL, PRIVACY_POLICY_UPDATED, PRIVACY_POLICY_URL, WEBSITE_URL } from '../../../lib/constants';

/** Section order; each has `pp_<key>_title` and `pp_<key>_body` strings. */
const SECTIONS = ['summary', 'device', 'location', 'server', 'masjid', 'sync', 'notif', 'third', 'children', 'security', 'rights', 'changes'];

const SITE_LABEL = WEBSITE_URL.replace(/^https?:\/\//, '');

/** A section body: paragraphs separated by "\n"; a line starting with "• " is a bullet. */
function Body({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => {
        const bullet = line.startsWith('• ');
        return (
          <View key={i} className={`flex-row ${i > 0 ? 'mt-2' : ''}`}>
            {bullet ? <Text className="font-body text-sm text-primary-600 dark:text-primary-400 w-4">•</Text> : null}
            <Text className="font-body text-sm text-ink-700 dark:text-ink-300 leading-relaxed flex-1">{bullet ? line.slice(2) : line}</Text>
          </View>
        );
      })}
    </>
  );
}

function LinkRow({ icon, label, value, url }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; url: string }) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(url)} className="flex-row items-center py-2" accessibilityRole="link">
      <Ionicons name={icon} size={16} color="#22a06d" />
      <Text className="font-body text-sm text-ink-500 dark:text-ink-400 ml-2">{label}:</Text>
      <Text className="font-body-medium text-sm text-primary-600 dark:text-primary-400 ml-1 flex-1" numberOfLines={1}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

/** Privacy policy — the same text as the website's /privacy page, readable offline. */
export default function PrivacyScreen() {
  const { language } = useApp();
  const updated = formatDate(parseLocalISODate(PRIVACY_POLICY_UPDATED), language, { day: 'numeric', month: 'long', year: 'numeric' });
  const vars = { site: SITE_LABEL };

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-1">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1" accessibilityLabel={tr('close', language)}>
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('pp_title', language)}</Text>
      </View>
      <Text className="font-body text-xs text-ink-400 mb-4 ml-9">{fmt('pp_updated', language, { date: updated })}</Text>

      <Card className="p-4 mb-4">
        <Text className="font-body text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{tr('pp_intro', language)}</Text>
        <Text className="font-body text-sm text-ink-700 dark:text-ink-300 leading-relaxed mt-2">{fmt('pp_applies', language, vars)}</Text>
      </Card>

      {SECTIONS.map((key) => (
        <Card key={key} className="p-4 mb-4">
          <Text className="font-body-semibold text-base text-ink-900 dark:text-white mb-2">{tr(`pp_${key}_title`, language)}</Text>
          <Body text={fmt(`pp_${key}_body`, language, vars)} />
        </Card>
      ))}

      <Card className="p-4 mb-4">
        <Text className="font-body-semibold text-base text-ink-900 dark:text-white mb-2">{tr('pp_contact_title', language)}</Text>
        <Text className="font-body text-sm text-ink-700 dark:text-ink-300 leading-relaxed mb-1">{tr('pp_contact_body', language)}</Text>
        <LinkRow icon="mail-outline" label={tr('pp_contact_email', language)} value={PRIVACY_CONTACT_EMAIL} url={`mailto:${PRIVACY_CONTACT_EMAIL}`} />
        <LinkRow icon="globe-outline" label={tr('pp_contact_web', language)} value={SITE_LABEL} url={WEBSITE_URL} />
      </Card>

      <Text className="font-body text-xs text-ink-400 leading-relaxed">{tr('pp_language_note', language)}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} className="flex-row items-center mt-3" accessibilityRole="link">
        <Ionicons name="open-outline" size={14} color="#22a06d" />
        <Text className="font-body-medium text-xs text-primary-600 dark:text-primary-400 ml-1">{tr('pp_open_web', language)}</Text>
      </TouchableOpacity>
    </Screen>
  );
}
