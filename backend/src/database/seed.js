import pool from '../config/database.js';
import { seedDuas } from './duasSeeder.js';

async function seed() {
  let connection;
  try {
    console.log('🌱 Seeding database...');

    connection = await pool.getConnection();

    // Seed calculation methods (all 20 methods)
    console.log('📝 Seeding calculation methods...');

    const methods = [
      // Organizational Methods
      {
        method_code: 'karachi',
        numeric_code: 3,
        method_name: 'University of Islamic Sciences, Karachi',
        fajr_angle: 18.0,
        isha_angle: 18.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: true,
        regional_preference: JSON.stringify(['Pakistan', 'India', 'Bangladesh']),
        description: 'Most commonly used method in South Asia, including Bangladesh. This is the default method for the API.'
      },
      {
        method_code: 'mwl',
        numeric_code: 1,
        method_name: 'Muslim World League',
        fajr_angle: 18.0,
        isha_angle: 17.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['International']),
        description: 'Used by many Islamic organizations worldwide'
      },
      {
        method_code: 'isna',
        numeric_code: 5,
        method_name: 'Islamic Society of North America',
        fajr_angle: 15.0,
        isha_angle: 15.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['United States', 'Canada']),
        description: 'Common in North America'
      },
      {
        method_code: 'egyptian',
        numeric_code: 2,
        method_name: 'Egyptian General Authority of Survey',
        fajr_angle: 19.5,
        isha_angle: 17.5,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Egypt', 'Middle East']),
        description: 'Official method used in Egypt'
      },
      {
        method_code: 'umm_al_qura',
        numeric_code: 4,
        method_name: 'Umm Al-Qura',
        fajr_angle: 18.5,
        isha_angle: null,
        isha_time_adjustment: 90,
        isha_calculation_type: 'time',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Saudi Arabia', 'Gulf countries']),
        description: 'Official method for Saudi Arabia. Isha is time-based (90 minutes after Maghrib)'
      },
      {
        method_code: 'singapore',
        numeric_code: 9,
        method_name: 'Majlis Ugama Islam Singapura',
        fajr_angle: 20.0,
        isha_angle: 18.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Singapore', 'Southeast Asia']),
        description: 'Official method for Singapore'
      },
      {
        method_code: 'turkey',
        numeric_code: 16,
        method_name: 'Diyanet İşleri Başkanlığı, Turkey',
        fajr_angle: 18.0,
        isha_angle: 17.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Turkey']),
        description: 'Official method for Turkey'
      },
      {
        method_code: 'jakim',
        numeric_code: 13,
        method_name: 'JAKIM (Jabatan Kemajuan Islam Malaysia)',
        fajr_angle: 20.0,
        isha_angle: 18.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Malaysia']),
        description: 'Official method for Malaysia'
      },
      {
        method_code: 'france',
        numeric_code: 8,
        method_name: 'Union des Organisations Islamiques de France',
        fajr_angle: 12.0,
        isha_angle: 12.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['France', 'Europe']),
        description: 'Used by French Islamic organizations'
      },
      {
        method_code: 'algeria',
        numeric_code: 15,
        method_name: 'Algerian Ministry of Religious Affairs and Wakfs',
        fajr_angle: 18.0,
        isha_angle: 17.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Algeria']),
        description: 'Official method for Algeria'
      },
      {
        method_code: 'tunisia',
        numeric_code: 12,
        method_name: 'Tunisian Ministry of Religious Affairs',
        fajr_angle: 18.0,
        isha_angle: 18.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Tunisia']),
        description: 'Official method for Tunisia'
      },
      {
        method_code: 'indonesia',
        numeric_code: 11,
        method_name: 'Sihat/Kemenag (Indonesia)',
        fajr_angle: 20.0,
        isha_angle: 18.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Indonesia']),
        description: 'Official method for Indonesia'
      },
      {
        method_code: 'russia',
        numeric_code: 14,
        method_name: 'Spiritual Administration of Muslims of Russia',
        fajr_angle: 16.0,
        isha_angle: 15.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Russia', 'Central Asia']),
        description: 'Used in Russia'
      },
      {
        method_code: 'jafri',
        numeric_code: 18,
        method_name: 'Shia Ithna-Ashari, Leva Institute, Qum (Jafri)',
        fajr_angle: 16.0,
        isha_angle: 14.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Shia communities worldwide']),
        description: 'Used by Shia Ithna-Ashari communities'
      },
      // Traditional Madhab Methods
      {
        method_code: 'hanafi',
        numeric_code: null,
        method_name: 'Hanafi',
        fajr_angle: 18.0,
        isha_angle: 18.0,
        isha_calculation_type: 'angle',
        asr_method: 'hanafi',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Hanafi communities']),
        description: 'Hanafi school of thought'
      },
      {
        method_code: 'shafi',
        numeric_code: null,
        method_name: 'Shafi',
        fajr_angle: 20.0,
        isha_angle: 18.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Shafi communities']),
        description: 'Shafi school of thought'
      },
      {
        method_code: 'maliki',
        numeric_code: null,
        method_name: 'Maliki',
        fajr_angle: 18.0,
        isha_angle: 17.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Maliki communities']),
        description: 'Maliki school of thought'
      },
      {
        method_code: 'hanbali',
        numeric_code: null,
        method_name: 'Hanbali',
        fajr_angle: 18.0,
        isha_angle: 17.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: JSON.stringify(['Hanbali communities']),
        description: 'Hanbali school of thought'
      },
      // Custom Methods (placeholders)
      {
        method_code: 'custom_angles',
        numeric_code: 6,
        method_name: 'Custom - Fajr and Isha Angle',
        fajr_angle: 18.0,
        isha_angle: 18.0,
        isha_calculation_type: 'angle',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: null,
        description: 'User-defined Fajr and Isha angles'
      },
      {
        method_code: 'custom_time',
        numeric_code: 7,
        method_name: 'Custom - Fajr Angle and Isha Time Adjustment',
        fajr_angle: 18.0,
        isha_angle: null,
        isha_time_adjustment: 90,
        isha_calculation_type: 'time',
        asr_method: 'standard',
        dhuhr_adjustment: 1,
        maghrib_adjustment: 1,
        is_default: false,
        regional_preference: null,
        description: 'Fajr angle + Isha time adjustment (similar to Umm Al-Qura)'
      }
    ];

    for (const method of methods) {
      await connection.query(
        `INSERT INTO calculation_methods
         (method_code, numeric_code, method_name, fajr_angle, isha_angle, isha_time_adjustment,
          isha_calculation_type, asr_method, dhuhr_adjustment, maghrib_adjustment,
          is_default, is_active, regional_preference, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         method_name = VALUES(method_name),
         fajr_angle = VALUES(fajr_angle),
         isha_angle = VALUES(isha_angle),
         isha_time_adjustment = VALUES(isha_time_adjustment),
         isha_calculation_type = VALUES(isha_calculation_type),
         asr_method = VALUES(asr_method),
         dhuhr_adjustment = VALUES(dhuhr_adjustment),
         maghrib_adjustment = VALUES(maghrib_adjustment),
         is_default = VALUES(is_default),
         regional_preference = VALUES(regional_preference),
         description = VALUES(description)`,
        [
          method.method_code,
          method.numeric_code,
          method.method_name,
          method.fajr_angle,
          method.isha_angle,
          method.isha_time_adjustment || null,
          method.isha_calculation_type,
          method.asr_method,
          method.dhuhr_adjustment,
          method.maghrib_adjustment,
          method.is_default,
          true,
          method.regional_preference,
          method.description
        ]
      );
    }
    console.log(`✅ Seeded ${methods.length} calculation methods`);

    // Seed major locations (8 major cities)
    console.log('📝 Seeding major locations...');

    const majorLocations = [
      { name: 'Dhaka', name_bengali: 'ঢাকা', lat: 23.8103, lng: 90.4125, district: 'Dhaka', division: 'Dhaka', type: 'city', population: 21000000, is_popular: true },
      { name: 'Chittagong', name_bengali: 'চট্টগ্রাম', lat: 22.3569, lng: 91.7832, district: 'Chittagong', division: 'Chittagong', type: 'city', population: 5000000, is_popular: true },
      { name: 'Sylhet', name_bengali: 'সিলেট', lat: 24.8949, lng: 91.8687, district: 'Sylhet', division: 'Sylhet', type: 'city', population: 500000, is_popular: true },
      { name: 'Rajshahi', name_bengali: 'রাজশাহী', lat: 24.3745, lng: 88.6042, district: 'Rajshahi', division: 'Rajshahi', type: 'city', population: 700000, is_popular: true },
      { name: 'Khulna', name_bengali: 'খুলনা', lat: 22.8456, lng: 89.5403, district: 'Khulna', division: 'Khulna', type: 'city', population: 1500000, is_popular: true },
      { name: 'Barisal', name_bengali: 'বরিশাল', lat: 22.7010, lng: 90.3531, district: 'Barisal', division: 'Barisal', type: 'city', population: 300000, is_popular: true },
      { name: 'Rangpur', name_bengali: 'রংপুর', lat: 25.7439, lng: 89.2756, district: 'Rangpur', division: 'Rangpur', type: 'city', population: 300000, is_popular: true },
      { name: 'Mymensingh', name_bengali: 'ময়মনসিংহ', lat: 24.7471, lng: 90.4203, district: 'Mymensingh', division: 'Mymensingh', type: 'city', population: 400000, is_popular: true }
    ];

    for (const loc of majorLocations) {
      await connection.query(
        `INSERT INTO locations
         (name, name_bengali, latitude, longitude, district, division, type, population, is_popular, country)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'BD')
         ON DUPLICATE KEY UPDATE
         name_bengali = VALUES(name_bengali),
         latitude = VALUES(latitude),
         longitude = VALUES(longitude),
         district = VALUES(district),
         division = VALUES(division),
         type = VALUES(type),
         population = VALUES(population),
         is_popular = VALUES(is_popular)`,
        [loc.name, loc.name_bengali, loc.lat, loc.lng, loc.district, loc.division, loc.type, loc.population, loc.is_popular]
      );
    }
    console.log(`✅ Seeded ${majorLocations.length} major locations`);

    // Seed district centers (64 districts of Bangladesh)
    console.log('📝 Seeding district centers...');

    const districts = [
      // Dhaka Division
      { name: 'Dhaka', name_bengali: 'ঢাকা', lat: 23.8103, lng: 90.4125, district: 'Dhaka', division: 'Dhaka', type: 'district' },
      { name: 'Gazipur', name_bengali: 'গাজীপুর', lat: 24.0029, lng: 90.4263, district: 'Gazipur', division: 'Dhaka', type: 'district' },
      { name: 'Narayanganj', name_bengali: 'নারায়ণগঞ্জ', lat: 23.6238, lng: 90.5000, district: 'Narayanganj', division: 'Dhaka', type: 'district' },
      { name: 'Tangail', name_bengali: 'টাঙ্গাইল', lat: 24.2513, lng: 89.9167, district: 'Tangail', division: 'Dhaka', type: 'district' },
      { name: 'Kishoreganj', name_bengali: 'কিশোরগঞ্জ', lat: 24.4444, lng: 90.7833, district: 'Kishoreganj', division: 'Dhaka', type: 'district' },
      { name: 'Manikganj', name_bengali: 'মানিকগঞ্জ', lat: 23.8600, lng: 90.0000, district: 'Manikganj', division: 'Dhaka', type: 'district' },
      { name: 'Munshiganj', name_bengali: 'মুন্সীগঞ্জ', lat: 23.5500, lng: 90.5333, district: 'Munshiganj', division: 'Dhaka', type: 'district' },
      { name: 'Narsingdi', name_bengali: 'নরসিংদী', lat: 23.9167, lng: 90.7167, district: 'Narsingdi', division: 'Dhaka', type: 'district' },
      { name: 'Faridpur', name_bengali: 'ফরিদপুর', lat: 23.6000, lng: 89.8333, district: 'Faridpur', division: 'Dhaka', type: 'district' },
      { name: 'Gopalganj', name_bengali: 'গোপালগঞ্জ', lat: 23.0167, lng: 89.9167, district: 'Gopalganj', division: 'Dhaka', type: 'district' },
      { name: 'Madaripur', name_bengali: 'মাদারীপুর', lat: 23.1667, lng: 90.2000, district: 'Madaripur', division: 'Dhaka', type: 'district' },
      { name: 'Rajbari', name_bengali: 'রাজবাড়ী', lat: 23.7500, lng: 89.5833, district: 'Rajbari', division: 'Dhaka', type: 'district' },
      { name: 'Shariatpur', name_bengali: 'শরীয়তপুর', lat: 23.2000, lng: 90.3500, district: 'Shariatpur', division: 'Dhaka', type: 'district' },

      // Chittagong Division
      { name: 'Chittagong', name_bengali: 'চট্টগ্রাম', lat: 22.3569, lng: 91.7832, district: 'Chittagong', division: 'Chittagong', type: 'district' },
      { name: 'Cox\'s Bazar', name_bengali: 'কক্সবাজার', lat: 21.4333, lng: 91.9833, district: 'Cox\'s Bazar', division: 'Chittagong', type: 'district' },
      { name: 'Bandarban', name_bengali: 'বান্দরবান', lat: 22.1953, lng: 92.2181, district: 'Bandarban', division: 'Chittagong', type: 'district' },
      { name: 'Rangamati', name_bengali: 'রাঙ্গামাটি', lat: 22.6333, lng: 92.2000, district: 'Rangamati', division: 'Chittagong', type: 'district' },
      { name: 'Khagrachhari', name_bengali: 'খাগড়াছড়ি', lat: 23.1000, lng: 91.9833, district: 'Khagrachhari', division: 'Chittagong', type: 'district' },
      { name: 'Feni', name_bengali: 'ফেনী', lat: 23.0167, lng: 91.4000, district: 'Feni', division: 'Chittagong', type: 'district' },
      { name: 'Lakshmipur', name_bengali: 'লক্ষ্মীপুর', lat: 22.9500, lng: 90.8333, district: 'Lakshmipur', division: 'Chittagong', type: 'district' },
      { name: 'Noakhali', name_bengali: 'নোয়াখালী', lat: 22.8667, lng: 91.1000, district: 'Noakhali', division: 'Chittagong', type: 'district' },
      { name: 'Chandpur', name_bengali: 'চাঁদপুর', lat: 23.2167, lng: 90.6500, district: 'Chandpur', division: 'Chittagong', type: 'district' },
      { name: 'Comilla', name_bengali: 'কুমিল্লা', lat: 23.4619, lng: 91.1850, district: 'Comilla', division: 'Chittagong', type: 'district' },
      { name: 'Brahmanbaria', name_bengali: 'ব্রাহ্মণবাড়িয়া', lat: 23.9667, lng: 91.1000, district: 'Brahmanbaria', division: 'Chittagong', type: 'district' },

      // Sylhet Division
      { name: 'Sylhet', name_bengali: 'সিলেট', lat: 24.8949, lng: 91.8687, district: 'Sylhet', division: 'Sylhet', type: 'district' },
      { name: 'Moulvibazar', name_bengali: 'মৌলভীবাজার', lat: 24.4833, lng: 91.7667, district: 'Moulvibazar', division: 'Sylhet', type: 'district' },
      { name: 'Habiganj', name_bengali: 'হবিগঞ্জ', lat: 24.3667, lng: 91.4167, district: 'Habiganj', division: 'Sylhet', type: 'district' },
      { name: 'Sunamganj', name_bengali: 'সুনামগঞ্জ', lat: 25.0333, lng: 91.4000, district: 'Sunamganj', division: 'Sylhet', type: 'district' },

      // Rajshahi Division
      { name: 'Rajshahi', name_bengali: 'রাজশাহী', lat: 24.3745, lng: 88.6042, district: 'Rajshahi', division: 'Rajshahi', type: 'district' },
      { name: 'Bogra', name_bengali: 'বগুড়া', lat: 24.8500, lng: 89.3667, district: 'Bogra', division: 'Rajshahi', type: 'district' },
      { name: 'Joypurhat', name_bengali: 'জয়পুরহাট', lat: 25.1000, lng: 89.0167, district: 'Joypurhat', division: 'Rajshahi', type: 'district' },
      { name: 'Naogaon', name_bengali: 'নওগাঁ', lat: 24.8000, lng: 88.9333, district: 'Naogaon', division: 'Rajshahi', type: 'district' },
      { name: 'Natore', name_bengali: 'নাটোর', lat: 24.4167, lng: 88.9833, district: 'Natore', division: 'Rajshahi', type: 'district' },
      { name: 'Chapai Nawabganj', name_bengali: 'চাঁপাই নবাবগঞ্জ', lat: 24.6000, lng: 88.2833, district: 'Chapai Nawabganj', division: 'Rajshahi', type: 'district' },
      { name: 'Pabna', name_bengali: 'পাবনা', lat: 24.0000, lng: 89.2500, district: 'Pabna', division: 'Rajshahi', type: 'district' },
      { name: 'Sirajganj', name_bengali: 'সিরাজগঞ্জ', lat: 24.4500, lng: 89.7167, district: 'Sirajganj', division: 'Rajshahi', type: 'district' },

      // Khulna Division
      { name: 'Khulna', name_bengali: 'খুলনা', lat: 22.8456, lng: 89.5403, district: 'Khulna', division: 'Khulna', type: 'district' },
      { name: 'Bagerhat', name_bengali: 'বাগেরহাট', lat: 22.6500, lng: 89.7833, district: 'Bagerhat', division: 'Khulna', type: 'district' },
      { name: 'Chuadanga', name_bengali: 'চুয়াডাঙ্গা', lat: 23.6333, lng: 88.8167, district: 'Chuadanga', division: 'Khulna', type: 'district' },
      { name: 'Jashore', name_bengali: 'যশোর', lat: 23.1667, lng: 89.2167, district: 'Jashore', division: 'Khulna', type: 'district' },
      { name: 'Jhenaidah', name_bengali: 'ঝিনাইদহ', lat: 23.5333, lng: 89.1667, district: 'Jhenaidah', division: 'Khulna', type: 'district' },
      { name: 'Kushtia', name_bengali: 'কুষ্টিয়া', lat: 23.9000, lng: 89.1167, district: 'Kushtia', division: 'Khulna', type: 'district' },
      { name: 'Magura', name_bengali: 'মাগুরা', lat: 23.4833, lng: 89.4167, district: 'Magura', division: 'Khulna', type: 'district' },
      { name: 'Meherpur', name_bengali: 'মেহেরপুর', lat: 23.7667, lng: 88.6333, district: 'Meherpur', division: 'Khulna', type: 'district' },
      { name: 'Narail', name_bengali: 'নড়াইল', lat: 23.1667, lng: 89.5000, district: 'Narail', division: 'Khulna', type: 'district' },
      { name: 'Satkhira', name_bengali: 'সাতক্ষীরা', lat: 22.7167, lng: 89.0833, district: 'Satkhira', division: 'Khulna', type: 'district' },

      // Barisal Division
      { name: 'Barisal', name_bengali: 'বরিশাল', lat: 22.7010, lng: 90.3531, district: 'Barisal', division: 'Barisal', type: 'district' },
      { name: 'Barguna', name_bengali: 'বরগুনা', lat: 22.1500, lng: 90.1167, district: 'Barguna', division: 'Barisal', type: 'district' },
      { name: 'Bhola', name_bengali: 'ভোলা', lat: 22.6833, lng: 90.6500, district: 'Bhola', division: 'Barisal', type: 'district' },
      { name: 'Jhalokati', name_bengali: 'ঝালকাঠি', lat: 22.6333, lng: 90.2000, district: 'Jhalokati', division: 'Barisal', type: 'district' },
      { name: 'Patuakhali', name_bengali: 'পটুয়াখালী', lat: 22.3500, lng: 90.3167, district: 'Patuakhali', division: 'Barisal', type: 'district' },
      { name: 'Pirojpur', name_bengali: 'পিরোজপুর', lat: 22.5833, lng: 90.0000, district: 'Pirojpur', division: 'Barisal', type: 'district' },

      // Rangpur Division
      { name: 'Rangpur', name_bengali: 'রংপুর', lat: 25.7439, lng: 89.2756, district: 'Rangpur', division: 'Rangpur', type: 'district' },
      { name: 'Dinajpur', name_bengali: 'দিনাজপুর', lat: 25.6333, lng: 88.6333, district: 'Dinajpur', division: 'Rangpur', type: 'district' },
      { name: 'Gaibandha', name_bengali: 'গাইবান্ধা', lat: 25.2500, lng: 89.5167, district: 'Gaibandha', division: 'Rangpur', type: 'district' },
      { name: 'Kurigram', name_bengali: 'কুড়িগ্রাম', lat: 25.8167, lng: 89.6500, district: 'Kurigram', division: 'Rangpur', type: 'district' },
      { name: 'Lalmonirhat', name_bengali: 'লালমনিরহাট', lat: 25.9167, lng: 89.4500, district: 'Lalmonirhat', division: 'Rangpur', type: 'district' },
      { name: 'Nilphamari', name_bengali: 'নীলফামারী', lat: 25.9333, lng: 88.8500, district: 'Nilphamari', division: 'Rangpur', type: 'district' },
      { name: 'Panchagarh', name_bengali: 'পঞ্চগড়', lat: 26.3333, lng: 88.5667, district: 'Panchagarh', division: 'Rangpur', type: 'district' },
      { name: 'Thakurgaon', name_bengali: 'ঠাকুরগাঁও', lat: 26.0333, lng: 88.4667, district: 'Thakurgaon', division: 'Rangpur', type: 'district' },

      // Mymensingh Division
      { name: 'Mymensingh', name_bengali: 'ময়মনসিংহ', lat: 24.7471, lng: 90.4203, district: 'Mymensingh', division: 'Mymensingh', type: 'district' },
      { name: 'Jamalpur', name_bengali: 'জামালপুর', lat: 24.9167, lng: 89.9333, district: 'Jamalpur', division: 'Mymensingh', type: 'district' },
      { name: 'Netrokona', name_bengali: 'নেত্রকোণা', lat: 24.8833, lng: 90.7333, district: 'Netrokona', division: 'Mymensingh', type: 'district' },
      { name: 'Sherpur', name_bengali: 'শেরপুর', lat: 25.0167, lng: 90.0167, district: 'Sherpur', division: 'Mymensingh', type: 'district' }
    ];

    for (const dist of districts) {
      await connection.query(
        `INSERT INTO locations
         (name, name_bengali, latitude, longitude, district, division, type, country)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'BD')
         ON DUPLICATE KEY UPDATE
         name_bengali = VALUES(name_bengali),
         latitude = VALUES(latitude),
         longitude = VALUES(longitude),
         district = VALUES(district),
         division = VALUES(division)`,
        [dist.name, dist.name_bengali, dist.lat, dist.lng, dist.district, dist.division, dist.type]
      );
    }
    console.log(`✅ Seeded ${districts.length} district locations`);

    await seedDuas(connection);

    connection.release();
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    if (connection) connection.release();
    process.exit(1);
  }
}

seed();
