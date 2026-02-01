import pool from '../config/database.js';
import { getAllMethods } from '../config/methods.js';

/**
 * Get available calculation methods
 * Returns all methods from database, or falls back to config if database is empty
 */
export async function getMethodsService() {
  try {
    const [methods] = await pool.query(
      `SELECT
        id, method_code, numeric_code, method_name, description,
        fajr_angle, isha_angle, isha_time_adjustment, isha_calculation_type,
        asr_method, dhuhr_adjustment, maghrib_adjustment,
        is_default, is_active, regional_preference
      FROM calculation_methods
      WHERE is_active = TRUE
      ORDER BY is_default DESC, method_code ASC`
    );

    // If no methods in database, use config
    let methodList;
    if (methods.length === 0) {
      methodList = getAllMethods();
    } else {
      // Format database methods
      methodList = methods.map(method => ({
        code: method.method_code,
        numeric_code: method.numeric_code,
        name: method.method_name,
        fajr_angle: parseFloat(method.fajr_angle),
        isha_angle: method.isha_angle !== null ? parseFloat(method.isha_angle) : null,
        isha_time_adjustment: method.isha_time_adjustment || null,
        isha_calculation_type: method.isha_calculation_type || 'angle',
        asr_method: method.asr_method || 'standard',
        dhuhr_adjustment: method.dhuhr_adjustment || 1,
        maghrib_adjustment: method.maghrib_adjustment || 1,
        is_default: method.is_default === 1,
        regional_preference: method.regional_preference ? JSON.parse(method.regional_preference) : [],
        description: method.description || ''
      }));
    }

    // Custom options for user configuration
    const customOptions = {
      fajr_angle: {
        range: [10.0, 24.5],
        increment: 0.5,
        description: 'Fajr angle in degrees (10.0 to 24.5)'
      },
      isha_angle: {
        range: [10.0, 24.5],
        increment: 0.5,
        description: 'Isha angle in degrees (10.0 to 24.5)'
      },
      isha_time_adjustment: {
        range: [0, 180],
        increment: 1,
        description: 'Isha time adjustment in minutes after Maghrib (0 to 180)'
      },
      asr_method: {
        values: ['standard', 'hanafi'],
        description: 'Asr calculation method'
      },
      dhuhr_adjustment: {
        range: [1, 60],
        increment: 1,
        description: 'Dhuhr adjustment in minutes after solar noon (1 to 60)'
      },
      maghrib_adjustment: {
        range: [1, 15],
        increment: 1,
        description: 'Maghrib adjustment in minutes after sunset (1 to 15)'
      },
      hijri_adjustment: {
        range: [-2, 2],
        increment: 1,
        description: 'Hijri date adjustment in days (-2 to +2)'
      },
      sehri_margin: {
        range: [5, 15],
        increment: 1,
        description: 'Sehri margin in minutes before Fajr (5 to 15)'
      }
    };

    return {
      methods: methodList,
      total_methods: methodList.length,
      custom_options: customOptions
    };
  } catch (error) {
    console.error('Error fetching methods from database:', error);
    // Fallback to config methods
    const methodList = getAllMethods();
    return {
      methods: methodList,
      total_methods: methodList.length,
      custom_options: {
        fajr_angle: { range: [10.0, 24.5], increment: 0.5 },
        isha_angle: { range: [10.0, 24.5], increment: 0.5 },
        isha_time_adjustment: { range: [0, 180], increment: 1 },
        asr_method: { values: ['standard', 'hanafi'] },
        dhuhr_adjustment: { range: [1, 60], increment: 1 },
        maghrib_adjustment: { range: [1, 15], increment: 1 },
        hijri_adjustment: { range: [-2, 2], increment: 1 },
        sehri_margin: { range: [5, 15], increment: 1 }
      }
    };
  }
}
