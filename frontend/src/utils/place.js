/**
 * The saved location keeps English and Bangla names ({ name, name_bn, district, district_bn,
 * division, division_bn }); these helpers pick the right one for display.
 */

/** API location ({ latitude, longitude, name, name_bengali, … }) → app location shape. */
export function toAppLocation(api) {
  return {
    lat: api.latitude,
    lng: api.longitude,
    name: api.name,
    name_bn: api.name_bengali || undefined,
    district: api.district,
    district_bn: api.district_bengali || undefined,
    division: api.division,
    division_bn: api.division_bengali || undefined,
  };
}

const pick = (language, bn, en) => (language === 'bn' && bn ? bn : en);

export function placeName(loc, language) {
  return loc ? pick(language, loc.name_bn, loc.name) : '';
}

/** "District, Division" in the UI language, without repeating the place's own name. */
export function placeRegion(loc, language) {
  if (!loc) return '';
  const name = placeName(loc, language);
  const parts = [pick(language, loc.district_bn, loc.district), pick(language, loc.division_bn, loc.division)];
  return [...new Set(parts.filter((p) => p && p !== name))].join(', ');
}
