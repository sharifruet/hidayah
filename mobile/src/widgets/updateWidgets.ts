import type { LanguageCode } from '../lib/constants';
import type { PrayerDay } from '../lib/prayerDays';

/** Home-screen widgets exist only on iOS/Android (see the platform-specific files). */
export async function updateWidgets(_days?: PrayerDay[], _language?: LanguageCode): Promise<void> {}
