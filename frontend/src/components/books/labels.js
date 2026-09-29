/** Localized labels for book metadata enums (topics, book languages, licenses). */
import strings, { tr } from '../../i18n/translations.js';

export const BOOK_TOPICS = [
  'hadith', 'seerah', 'fiqh', 'aqeedah', 'tafsir',
  'spirituality', 'history', 'dawah', 'children',
];

export const BOOK_LANGUAGES = ['en', 'ar', 'bn', 'ur'];

// Unknown values (new topics/licenses added in the admin) fall back to the raw value.
function label(key, raw, language) {
  return strings[key] ? tr(key, language) : raw;
}

export const topicLabel = (topic, language) => label(`ct_topic_${topic}`, topic, language);
export const bookLanguageLabel = (code, language) => label(`ct_lang_${code}`, code, language);
export const licenseLabel = (license, language) => label(`ct_license_${license}`, license, language);
