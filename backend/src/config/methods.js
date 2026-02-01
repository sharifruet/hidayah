/**
 * Calculation Methods Configuration
 *
 * This file defines all 20 calculation methods with their parameters.
 * Used for method lookup and parameter resolution.
 */

export const CALCULATION_METHODS = {
  // Organizational Methods
  karachi: {
    code: 'karachi',
    numeric_code: 3,
    name: 'University of Islamic Sciences, Karachi',
    fajr_angle: 18.0,
    isha_angle: 18.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1,
    is_default: true
  },
  mwl: {
    code: 'mwl',
    numeric_code: 1,
    name: 'Muslim World League',
    fajr_angle: 18.0,
    isha_angle: 17.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  isna: {
    code: 'isna',
    numeric_code: 5,
    name: 'Islamic Society of North America',
    fajr_angle: 15.0,
    isha_angle: 15.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  egyptian: {
    code: 'egyptian',
    numeric_code: 2,
    name: 'Egyptian General Authority of Survey',
    fajr_angle: 19.5,
    isha_angle: 17.5,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  umm_al_qura: {
    code: 'umm_al_qura',
    numeric_code: 4,
    name: 'Umm Al-Qura',
    fajr_angle: 18.5,
    isha_angle: null,
    isha_time_adjustment: 90,
    isha_calculation_type: 'time',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  singapore: {
    code: 'singapore',
    numeric_code: 9,
    name: 'Majlis Ugama Islam Singapura',
    fajr_angle: 20.0,
    isha_angle: 18.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  turkey: {
    code: 'turkey',
    numeric_code: 16,
    name: 'Diyanet İşleri Başkanlığı, Turkey',
    fajr_angle: 18.0,
    isha_angle: 17.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  jakim: {
    code: 'jakim',
    numeric_code: 13,
    name: 'JAKIM (Jabatan Kemajuan Islam Malaysia)',
    fajr_angle: 20.0,
    isha_angle: 18.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  france: {
    code: 'france',
    numeric_code: 8,
    name: 'Union des Organisations Islamiques de France',
    fajr_angle: 12.0,
    isha_angle: 12.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  algeria: {
    code: 'algeria',
    numeric_code: 15,
    name: 'Algerian Ministry of Religious Affairs and Wakfs',
    fajr_angle: 18.0,
    isha_angle: 17.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  tunisia: {
    code: 'tunisia',
    numeric_code: 12,
    name: 'Tunisian Ministry of Religious Affairs',
    fajr_angle: 18.0,
    isha_angle: 18.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  indonesia: {
    code: 'indonesia',
    numeric_code: 11,
    name: 'Sihat/Kemenag (Indonesia)',
    fajr_angle: 20.0,
    isha_angle: 18.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  russia: {
    code: 'russia',
    numeric_code: 14,
    name: 'Spiritual Administration of Muslims of Russia',
    fajr_angle: 16.0,
    isha_angle: 15.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  jafri: {
    code: 'jafri',
    numeric_code: 18,
    name: 'Shia Ithna-Ashari, Leva Institute, Qum (Jafri)',
    fajr_angle: 16.0,
    isha_angle: 14.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  // Traditional Madhab Methods
  hanafi: {
    code: 'hanafi',
    numeric_code: null,
    name: 'Hanafi',
    fajr_angle: 18.0,
    isha_angle: 18.0,
    isha_calculation_type: 'angle',
    asr_method: 'hanafi',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  shafi: {
    code: 'shafi',
    numeric_code: null,
    name: 'Shafi',
    fajr_angle: 20.0,
    isha_angle: 18.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  maliki: {
    code: 'maliki',
    numeric_code: null,
    name: 'Maliki',
    fajr_angle: 18.0,
    isha_angle: 17.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  hanbali: {
    code: 'hanbali',
    numeric_code: null,
    name: 'Hanbali',
    fajr_angle: 18.0,
    isha_angle: 17.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  // Custom Methods (placeholders)
  custom_angles: {
    code: 'custom_angles',
    numeric_code: 6,
    name: 'Custom - Fajr and Isha Angle',
    fajr_angle: 18.0,
    isha_angle: 18.0,
    isha_calculation_type: 'angle',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  },
  custom_time: {
    code: 'custom_time',
    numeric_code: 7,
    name: 'Custom - Fajr Angle and Isha Time Adjustment',
    fajr_angle: 18.0,
    isha_angle: null,
    isha_time_adjustment: 90,
    isha_calculation_type: 'time',
    asr_method: 'standard',
    dhuhr_adjustment: 1,
    maghrib_adjustment: 1
  }
};

/**
 * Get method parameters by code
 * @param {string} methodCode - Method code (e.g., 'karachi', 'mwl')
 * @param {object} customParams - Custom parameters to override defaults
 * @returns {object} Method parameters
 */
export function getMethodParameters(methodCode, customParams = {}) {
  const method = CALCULATION_METHODS[methodCode] || CALCULATION_METHODS.karachi;

  return {
    fajr_angle: customParams.fajr_angle ?? method.fajr_angle,
    isha_angle: customParams.isha_angle ?? method.isha_angle,
    isha_time_adjustment: customParams.isha_time_adjustment ?? method.isha_time_adjustment,
    isha_calculation_type: method.isha_calculation_type || 'angle',
    asr_method: customParams.asr_method ?? method.asr_method,
    dhuhr_adjustment: customParams.dhuhr_adjustment ?? method.dhuhr_adjustment ?? 1,
    maghrib_adjustment: customParams.maghrib_adjustment ?? method.maghrib_adjustment ?? 1
  };
}

/**
 * Get method by numeric code (for Islamic Finder compatibility)
 * @param {number} numericCode - Numeric code (1-18)
 * @returns {object|null} Method object or null if not found
 */
export function getMethodByNumericCode(numericCode) {
  return Object.values(CALCULATION_METHODS).find(m => m.numeric_code === numericCode) || null;
}

/**
 * Get all available methods
 * @returns {array} Array of all method objects
 */
export function getAllMethods() {
  return Object.values(CALCULATION_METHODS);
}

/**
 * Check if method code is valid
 * @param {string} methodCode - Method code to validate
 * @returns {boolean} True if valid
 */
export function isValidMethod(methodCode) {
  return methodCode in CALCULATION_METHODS;
}
