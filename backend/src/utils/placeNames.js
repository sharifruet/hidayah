import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Bangla names for districts and divisions, derived from data/upazilas.json (Wikidata).
 * The older district seed uses pre-2018 spellings, so those are aliased to the current ones.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upazilas = JSON.parse(fs.readFileSync(path.join(__dirname, '../database/data/upazilas.json'), 'utf8'));

const ALIASES = {
  Barisal: 'Barishal',
  Chittagong: 'Chattogram',
  Comilla: 'Cumilla',
  Bogra: 'Bogura',
  Jessore: 'Jashore',
  "Cox's Bazar": "Cox's Bazar",
  Khagrachhari: 'Khagrachari',
};

const districtBn = new Map();
const divisionBn = new Map();
for (const u of upazilas) {
  districtBn.set(u.district.toLowerCase(), u.district_bn);
  divisionBn.set(u.division.toLowerCase(), u.division_bn);
}
const key = (name) => (ALIASES[name] ?? name).toLowerCase();

/** `{ district_bengali, division_bengali }` for a location row (only keys that resolve). */
export function bengaliRegionNames({ district, division } = {}) {
  const d = district ? districtBn.get(key(district)) : undefined;
  const v = division ? divisionBn.get(key(division)) : undefined;
  return { ...(d && { district_bengali: d }), ...(v && { division_bengali: v }) };
}
