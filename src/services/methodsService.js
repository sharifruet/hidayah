import pool from '../config/database.js';

/**
 * Method code to numeric code mapping (for compatibility with Islamic Finder)
 */
const METHOD_NUMERIC_CODES = {
  'mwl': 1,
  'egyptian': 2,
  'karachi': 3,
  'umm_al_qura': 4,
  'isna': 5,
  'france': 6,
  'kuwait': 7,
  'qatar': 8,
  'singapore': 9,
  'turkey': 10,
  'tehran': 11,
  'north_america': 12,
  'hanafi': 13,
  'shafi': 14,
  'maliki': 15,
  'hanbali': 16
};

/**
 * Regional preferences for methods
 */
const REGIONAL_PREFERENCES = {
  'hanafi': ['Hanafi communities', 'Bangladesh', 'India', 'Pakistan'],
  'shafi': ['Shafi communities', 'Bangladesh', 'Some regions'],
  'maliki': ['Maliki communities', 'International'],
  'hanbali': ['Hanbali communities', 'International'],
  'karachi': ['Pakistan', 'India', 'Bangladesh'],
  'mwl': ['International'],
  'isna': ['United States', 'Canada'],
  'umm_al_qura': ['Saudi Arabia', 'Gulf countries']
};

/**
 * Get available calculation methods
 */
export async function getMethodsService() {
  const [methods] = await pool.query(
    `SELECT
      id, method_code, method_name, description,
      fajr_angle, isha_angle, asr_shadow_factor,
      supports_regional_variations, is_active
    FROM calculation_methods
    WHERE is_active = TRUE
    ORDER BY method_code ASC`
  );

  // If no methods in database, return default methods
  let methodList;
  if (methods.length === 0) {
    methodList = [
      {
        method_code: 'hanafi',
        method_name: 'Hanafi',
        description: 'Hanafi school of thought. Most common method in Bangladesh.',
        fajr_angle: 18.0,
        isha_angle: 18.0,
        asr_shadow_factor: 1.0,
        supports_regional_variations: true,
        is_active: true
      },
      {
        method_code: 'shafi',
        method_name: 'Shafi',
        description: 'Shafi school of thought. Common in some regions of Bangladesh.',
        fajr_angle: 20.0,
        isha_angle: 18.0,
        asr_shadow_factor: 1.0,
        supports_regional_variations: false,
        is_active: true
      },
      {
        method_code: 'maliki',
        method_name: 'Maliki',
        description: 'Maliki school of thought. Alternative calculation method.',
        fajr_angle: 18.0,
        isha_angle: 17.0,
        asr_shadow_factor: 1.0,
        supports_regional_variations: false,
        is_active: true
      },
      {
        method_code: 'hanbali',
        method_name: 'Hanbali',
        description: 'Hanbali school of thought. Alternative calculation method.',
        fajr_angle: 18.0,
        isha_angle: 17.0,
        asr_shadow_factor: 1.0,
        supports_regional_variations: false,
        is_active: true
      }
    ];
  } else {
    methodList = methods;
  }

  // Map methods to response format
  const formattedMethods = methodList.map((method) => {
    const code = method.method_code;
    const asrMethod = method.asr_shadow_factor === 1.0 ? 'standard' : 'hanafi';

    return {
      code: code,
      numeric_code: METHOD_NUMERIC_CODES[code] || null,
      name: method.method_name,
      fajr_angle: parseFloat(method.fajr_angle),
      isha_angle: method.isha_angle !== null ? parseFloat(method.isha_angle) : null,
      isha_calculation_type: method.isha_angle !== null ? 'angle' : 'time',
      ...(method.isha_angle === null && { isha_time_adjustment: 90 }), // Default 90 minutes if time-based
      asr_method: asrMethod,
      dhuhr_adjustment: 1, // Default value
      maghrib_adjustment: 1, // Default value
      is_default: code === 'hanafi', // Hanafi is default for Bangladesh
      regional_preference: REGIONAL_PREFERENCES[code] || ['International'],
      description: method.description || ''
    };
  });

  // Custom options for user configuration
  const customOptions = {
    fajr_angle_range: [10.0, 24.5],
    fajr_angle_increment: 0.5,
    isha_angle_range: [10.0, 24.5],
    isha_angle_increment: 0.5,
    dhuhr_adjustment_range: [1, 60],
    maghrib_adjustment_range: [1, 15],
    hijri_adjustment_range: [-2, 2]
  };

  return {
    methods: formattedMethods,
    custom_options: customOptions
  };
}
