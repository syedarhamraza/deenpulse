import { Location, CalcMethod, FileContent } from '../types';

export const locationData: Record<Location, { lat: string; lon: string; methodOffsets: Record<CalcMethod, number> }> = {
  Mecca: { lat: '21.4225° N', lon: '39.8262° E', methodOffsets: { Karachi: -5, ISNA: -10, MWL: -3, Egypt: 0, Makkah: 0, Jakarta: -2, Dubai: -4 } },
  Karachi: { lat: '24.8607° N', lon: '67.0011° E', methodOffsets: { Karachi: 0, ISNA: -8, MWL: -3, Egypt: 2, Makkah: 5, Jakarta: -2, Dubai: -5 } },
  London: { lat: '51.5074° N', lon: '0.1278° W', methodOffsets: { Karachi: 8, ISNA: -12, MWL: -5, Egypt: 12, Makkah: 15, Jakarta: 3, Dubai: 5 } },
  'New York': { lat: '40.7128° N', lon: '74.0060° W', methodOffsets: { Karachi: 10, ISNA: 0, MWL: 5, Egypt: 12, Makkah: 14, Jakarta: 6, Dubai: 8 } },
  Cairo: { lat: '30.0444° N', lon: '31.2357° E', methodOffsets: { Karachi: -3, ISNA: -8, MWL: -5, Egypt: 0, Makkah: 2, Jakarta: -4, Dubai: -6 } },
  Jakarta: { lat: '6.2088° S', lon: '106.8456° E', methodOffsets: { Karachi: 5, ISNA: 0, MWL: 3, Egypt: 6, Makkah: 8, Jakarta: 0, Dubai: 2 } },
  Dubai: { lat: '25.2048° N', lon: '55.2708° E', methodOffsets: { Karachi: 3, ISNA: -4, MWL: -2, Egypt: 5, Makkah: 7, Jakarta: -2, Dubai: 0 } }
};

export const fileContents: Record<string, FileContent> = {
  'prayerEngine.ts': {
    desc: 'Local formatting and prayer status determination logic. Determines which prayer is next, formats countdown ticks, and checks active status.',
    lang: 'typescript',
    code: `export interface PrayerTime {
  name: string;
  time: string; // "HH:mm" format
  date: Date;   // Today's Date object
}

export function getNextPrayer(prayers: PrayerTime[], now: Date = new Date()): NextPrayerInfo {
  for (const prayer of prayers) {
    if (prayer.date > now) {
      const diffMs = prayer.date.getTime() - now.getTime();
      return {
        name: prayer.name,
        time: prayer.time,
        remainingMinutes: Math.floor(diffMs / 60000),
        remainingSeconds: Math.floor((diffMs % 60000) / 1000),
      };
    }
  }
  // All prayers passed today - next is Fajr tomorrow
  const fajr = prayers[0];
  const tomorrowFajr = new Date(fajr.date);
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
  const diffMs = tomorrowFajr.getTime() - now.getTime();
  return {
    name: fajr.name,
    time: fajr.time,
    remainingMinutes: Math.floor(diffMs / 60000),
    remainingSeconds: Math.floor((diffMs % 60000) / 1000),
  };
}

export function getPrayerStatus(prayer: PrayerTime, nextPrayer: NextPrayerInfo, now: Date): 'passed' | 'active' | 'upcoming' | 'next' {
  if (prayer.name === nextPrayer.name) return 'next';
  if (prayer.date <= now) {
    const diff = now.getTime() - prayer.date.getTime();
    if (diff <= 15 * 60000) return 'active'; // Active within 15 mins of start time
    return 'passed';
  }
  return 'upcoming';
}`
  },
  'deviceProfiles.ts': {
    desc: 'OEM layout and style mapping. Maps devices into specific categories to handle brand-specific status bar Live Capsules and fallback notifications.',
    lang: 'typescript',
    code: `export interface DeviceProfile {
  brand: string;            // 'oppo', 'oneplus', 'vivo', 'samsung', etc.
  manufacturer: string;
  category: 1 | 2 | 3;      // Style category (1: Capsule + Expanded, 2: Vivo partially optimized layout, 3: Default fallback)
}

export const OEM_CATEGORIES: Record<string, 1 | 2 | 3> = {
  oppo: 1,
  oneplus: 1,
  realme: 1,
  vivo: 2,
  iqoo: 2,
};

export function getCategoryForManufacturer(manufacturer: string): 1 | 2 | 3 {
  const mfgClean = manufacturer.toLowerCase().trim();
  if (OEM_CATEGORIES[mfgClean] !== undefined) {
    return OEM_CATEGORIES[mfgClean];
  }
  return 3; // Default category (Samsung, Xiaomi, Pixel, etc.)
}

export function detectDeviceCategory(): { brand: string; manufacturer: string; category: 1 | 2 | 3 } {
  const constants = (Platform.constants || {}) as { Brand?: string; Manufacturer?: string };
  const manufacturer = constants.Manufacturer || 'unknown';
  const brand = constants.Brand || 'unknown';
  
  let category = getCategoryForManufacturer(manufacturer.toLowerCase());
  if (category === 3) {
    category = getCategoryForManufacturer(brand.toLowerCase());
  }
  return { brand: brand.toLowerCase(), manufacturer, category };
}`
  },
  'usePrayerTimes.ts': {
    desc: 'Local-first React Hook to load prayer times. Serves cached calendars from AsyncStorage to avoid active GPS/network battery drains.',
    lang: 'typescript',
    code: `export function usePrayerTimes(
  locationMode: 'gps' | 'cached',
  juristicMethod: 'standard' | 'hanafi',
  calculationRule: CalculationMethod
): UsePrayerTimesResult {
  const loadTimes = useCallback(async (forceRefreshGPS: boolean = false) => {
    if (!forceRefreshGPS) {
      // Local-first path: retrieve cached monthly calendar and serve immediately
      const cachedLat = await AsyncStorage.getItem('@deenpulse_cached_lat');
      const cachedLng = await AsyncStorage.getItem('@deenpulse_cached_lng');
      if (cachedLat && cachedLng) {
        const lat = parseFloat(cachedLat);
        const lng = parseFloat(cachedLng);
        const cacheKey = await buildStableCacheKey(lat, lng, month, year);
        const calendarDataStr = await AsyncStorage.getItem(cacheKey);
        if (calendarDataStr) {
          const calendarData = JSON.parse(calendarDataStr);
          if (calendarData[day - 1]?.timings) {
            // Serve directly from storage — zero GPS hardware usage, zero network
            setPrayerTimes(parsePrayerTimings(calendarData[day - 1].timings));
            return; 
          }
        }
      }
    }
    // GPS path: request location permissions and trigger low-power GPS triangulation
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      acquireGPSOnce(async (lat, lng) => {
        const cacheKey = await buildStableCacheKey(lat, lng, month, year);
        await performFetch(lat, lng, month, year, day, cacheKey, true);
      });
    }
  }, [juristicMethod, calculationRule]);
}`
  },
  'usePrayerCountdown.ts': {
    desc: 'Countdown hook orchestrator. Dispatches calculated timetables to the Wear OS sync module and the Kotlin Foreground Service overlay.',
    lang: 'typescript',
    code: `export function usePrayerCountdown(
  prayerTimes: PrayerTime[],
  liveActivityEnabled: boolean = true,
  capsuleFormat: string = 'name',
  notificationStyle: string = 'standard',
  location: { latitude: number; longitude: number } | null = null,
  deviceCategory: number = 3,
  cat3NotificationMode: 'ongoing' | 'reminder' = 'reminder'
) {
  useEffect(() => {
    if (prayerTimes.length === 0) return;
    if (!liveActivityEnabled) {
      PrayerCapsuleModule?.stopCapsule();
      return;
    }

    const scheduleList = [
      ...prayerTimes.map(p => ({ name: p.name, timestamp: p.date.getTime() })),
      ...prayerTimes.map(p => {
        const tomorrow = new Date(p.date.getTime());
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { name: p.name, timestamp: tomorrow.getTime() };
      })
    ];
    const prayersJson = JSON.stringify(scheduleList);

    if (deviceCategory === 3 && cat3NotificationMode === 'reminder') {
      // Cat 3 reminder: schedule AlarmManager alerts, no background service
      PrayerCapsuleModule?.stopCapsule();
      PrayerCapsuleModule?.scheduleReminders(prayersJson);
    } else {
      // Cat 1 / Cat 2 or Cat 3 ongoing: update Kotlin status-bar capsule foreground service
      PrayerCapsuleModule?.cancelReminders();
      PrayerCapsuleModule?.updateLiveCapsule(prayersJson, capsuleFormat, notificationStyle);
    }
  }, [prayerTimes, liveActivityEnabled, capsuleFormat, notificationStyle, location, deviceCategory]);
}`
  },
  'PrayerCapsuleForegroundService.kt': {
    desc: 'Kotlin background service. Builds a high-priority foreground notification and triggers promoted status-bar capsule flags for OPPO/Vivo devices.',
    lang: 'kotlin',
    code: `package com.deenpulse

import android.app.Notification
import android.app.Service
import android.content.Intent
import androidx.core.app.NotificationCompat

class PrayerCapsuleForegroundService : Service() {
    private var capsuleFormat: String = "name"
    private var notificationStyle: String = "standard"

    private fun buildCapsuleNotification(): Notification {
        val texts = getNotificationTexts(getActivePrayerName(), formattedTime, countdownStr)
        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(texts.contentTitle)
            .setContentText(texts.contentText)
            .setSmallIcon(R.drawable.ic_stat_prayer)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_MAX)

        val category = getDeviceCategory()
        if (category == 1 || category == 2) {
            // ColorOS / Funtouch OS status bar Live Capsule overrides
            try {
                builder.setRequestPromotedOngoing(true)
                builder.setShortCriticalText(texts.shortText)
            } catch (e: NoSuchMethodError) {
                builder.extras.putBoolean("android.requestPromotedOngoing", true)
                builder.extras.putString("android.shortCriticalText", texts.shortText)
            }
            val notification = builder.build()
            // Flag 0x40000000: FLAG_CAN_SHOW_LIVE_CAPSULE
            notification.flags = notification.flags or 0x40000000 or 0x02000000
            return notification
        }
        return builder.build()
    }
}`
  },
  'WearDataSyncService.kt': {
    desc: 'Kotlin WearableListenerService companion. Integrates Google Play Services DataClient to push timetables and settings to the watch over Bluetooth.',
    lang: 'kotlin',
    code: `package com.deenpulse

import android.content.Context
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable
import com.google.android.gms.wearable.WearableListenerService

class WearDataSyncService : WearableListenerService() {
    companion object {
        fun pushTimetableToWear(context: Context, prayersJson: String, lat: Double, lng: Double) {
            companionScope.launch {
                try {
                    val dataClient = Wearable.getDataClient(context)
                    val putDataReq = PutDataMapRequest.create("/deen_pulse_wear_timetable").apply {
                        dataMap.putString("key_prayers_json", prayersJson)
                        dataMap.putDouble("key_latitude", lat)
                        dataMap.putDouble("key_longitude", lng)
                        dataMap.putLong("key_timestamp", System.currentTimeMillis())
                    }.asPutDataRequest().setUrgent()

                    dataClient.putDataItem(putDataReq).await()
                    Log.d("WearDataSync", "Timetable pushed to Wear OS successfully")
                } catch (e: Exception) {
                    Log.e("WearDataSync", "Failed to sync to Wear OS", e)
                }
            }
        }
    }
}`
  }
};
