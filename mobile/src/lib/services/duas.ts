import apiClient from '../api';
import type { LanguageCode } from '../constants';

export interface DuaCategory {
  id: string;
  label_en: string;
  label_bn: string;
  label_ur: string;
  label_tr: string;
  label_id: string;
}

export interface Dua {
  id: string;
  category: string;
  arabic: string;
  transliteration: string;
  translation_en: string;
  translation_bn: string;
  reference: string;
  count: number;
  quranRef?: { surah: number; ayah: number };
  /** Virtue / fazilat of the du'a — hidden by default in the UI */
  virtue_en?: string;
  virtue_bn?: string;
}

export interface DuasCollection {
  categories: DuaCategory[];
  duas: Dua[];
  total: number;
  /** Newest change on the server — lets a client tell whether a re-sync changed anything */
  updated_at: string;
}

/** GET /v1/duas — the whole collection in one payload (~60 KB) */
export function fetchDuasCollection(): Promise<DuasCollection> {
  return apiClient.get<DuasCollection, DuasCollection>('/duas');
}

export function duaCategoryLabel(cat: DuaCategory, language: LanguageCode): string {
  return (cat as unknown as Record<string, string>)[`label_${language}`] ?? cat.label_en;
}
