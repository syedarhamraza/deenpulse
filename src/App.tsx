import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Smartphone, 
  Watch, 
  Download, 
  Shield, 
  HardDrive, 
  WifiOff, 
  Database, 
  Bell, 
  FileText, 
  CheckCircle2, 
  Github, 
  Cpu, 
  Layers, 
  Activity, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  RefreshCw, 
  Settings, 
  Clock, 
  Compass,
  AlertTriangle,
  Code,
  FileCode,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  BatteryCharging,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import mainAppImg from './assets/main_app.jpeg';
import wearosImg from './assets/wearos.jpeg';
import backgroundImg from './assets/backgound.png';
import iconImg from './assets/icon.png';

// Types for prayer calculation engine simulator
type Location = 'Mecca' | 'Karachi' | 'London' | 'New York' | 'Cairo' | 'Jakarta' | 'Dubai';
type JuristicMethod = 'Standard' | 'Hanafi';
type CalcMethod = 'Karachi' | 'ISNA' | 'MWL' | 'Egypt' | 'Makkah' | 'Jakarta' | 'Dubai';

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location>('Karachi');
  const [juristicMethod, setJuristicMethod] = useState<JuristicMethod>('Hanafi');
  const [calcMethod, setCalcMethod] = useState<CalcMethod>('Karachi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<string>('prayerEngine.ts');
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Interactive Bento states
  const [simCapsuleFormat, setSimCapsuleFormat] = useState<'name' | 'name_time' | 'time' | 'name_countdown'>('name_countdown');
  const [selectedOemProfile, setSelectedOemProfile] = useState<'oppo' | 'vivo' | 'samsung'>('oppo');
  const [syncLogs, setSyncLogs] = useState<string[]>([
    'System ready. Client listening...',
    'Idle. Waiting for configuration shifts...'
  ]);

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'android': true,
    'android/app': true,
    'src': true,
    'src/hooks': true,
    'src/utils': true,
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Dynamic GitHub Release details state (replicates app AboutScreen updates)
  const [releaseInfo, setReleaseInfo] = useState<{
    version: string | null;
    publishedAt: string | null;
    mobileUrl: string;
    mobileSize: string | null;
    mobileName: string;
    watchUrl: string;
    watchSize: string | null;
    watchName: string;
    loading: boolean;
    error: boolean;
  }>({
    version: null,
    publishedAt: null,
    mobileUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
    mobileSize: null,
    mobileName: 'deen-pulse-mobile.apk',
    watchUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
    watchSize: null,
    watchName: 'deen-pulse-wear.apk',
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchLatestRelease = async () => {
      const CACHE_KEY = 'deenpulse_release_cache';
      const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

      // 1. Try loading cached details from localStorage
      let cachedData: any = null;
      try {
        const rawCache = localStorage.getItem(CACHE_KEY);
        if (rawCache) {
          cachedData = JSON.parse(rawCache);
        }
      } catch (e) {
        console.warn('Failed to read release cache:', e);
      }

      if (cachedData) {
        setReleaseInfo(prev => ({
          ...prev,
          version: cachedData.version,
          publishedAt: cachedData.publishedAt,
          mobileUrl: cachedData.mobileUrl,
          mobileSize: cachedData.mobileSize,
          mobileName: cachedData.mobileName,
          watchUrl: cachedData.watchUrl,
          watchSize: cachedData.watchSize,
          watchName: cachedData.watchName,
          loading: false,
        }));

        // If the cache is still fresh, bypass network request completely
        if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
          return;
        }
      }

      try {
        const res = await fetch('https://api.github.com/repos/syedarhamraza/deen-pulse/releases/latest', {
          headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        if (!res.ok) {
          // If rate limited or offline, but we have cached values, keep using them
          if (cachedData) {
            setReleaseInfo(prev => ({ ...prev, loading: false }));
            return;
          }
          setReleaseInfo({
            version: null,
            publishedAt: null,
            mobileUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
            mobileSize: null,
            mobileName: 'deen-pulse-mobile.apk',
            watchUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
            watchSize: null,
            watchName: 'deen-pulse-wear.apk',
            loading: false,
            error: true
          });
          return;
        }
        const release = await res.json();
        const latestVersion = (release.tag_name || '').replace(/^v/, '');
        
        const assets = release.assets || [];
        const mobileAsset = assets.find((a: any) => 
          a.name.endsWith('.apk') && 
          (/phone/i.test(a.name) || /mobile/i.test(a.name))
        ) || assets.find((a: any) => 
          a.name.endsWith('.apk') && 
          !/wear/i.test(a.name) && 
          !/watch/i.test(a.name)
        ) || assets[0];

        const watchAsset = assets.find((a: any) => 
          a.name.endsWith('.apk') && 
          (/wear/i.test(a.name) || /watch/i.test(a.name))
        ) || assets.find((a: any) => 
          a.name.endsWith('.apk') && 
          a !== mobileAsset
        );

        const freshDetails = {
          version: `v${latestVersion}`,
          publishedAt: release.published_at ? new Date(release.published_at).toLocaleDateString() : null,
          mobileUrl: mobileAsset?.browser_download_url || `https://github.com/syedarhamraza/deen-pulse/releases/download/v${latestVersion}/${mobileAsset?.name || 'deen-pulse-mobile.apk'}`,
          mobileSize: mobileAsset?.size ? `${(mobileAsset.size / (1024 * 1024)).toFixed(1)} MB` : null,
          mobileName: mobileAsset?.name || 'deen-pulse-mobile.apk',
          watchUrl: watchAsset?.browser_download_url || `https://github.com/syedarhamraza/deen-pulse/releases/download/v${latestVersion}/${watchAsset?.name || 'deen-pulse-wear.apk'}`,
          watchSize: watchAsset?.size ? `${(watchAsset.size / (1024 * 1024)).toFixed(1)} MB` : null,
          watchName: watchAsset?.name || 'deen-pulse-wear.apk',
          loading: false,
          error: false
        };

        setReleaseInfo(freshDetails);

        // Store new data in localStorage cache with timestamp
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            ...freshDetails,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('Failed to save release cache:', e);
        }
      } catch (e) {
        console.warn('Update check failed:', e);
        if (cachedData) {
          setReleaseInfo(prev => ({ ...prev, loading: false }));
          return;
        }
        setReleaseInfo({
          version: null,
          publishedAt: null,
          mobileUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
          mobileSize: null,
          mobileName: 'deen-pulse-mobile.apk',
          watchUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
          watchSize: null,
          watchName: 'deen-pulse-wear.apk',
          loading: false,
          error: true
        });
      }
    };
    fetchLatestRelease();
  }, []);

  // Monitor scroll for navbar styles
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync simulation logging
  const triggerMockSync = () => {
    const time = new Date().toLocaleTimeString();
    const newLogs = [
      `[${time}] [DataClient] Broadcast requested`,
      `[${time}] [DataClient] serialize timetable -> json`,
      `[${time}] [DataClient] push payload to /deen_pulse_wear_timetable`,
      `[${time}] [DataClient] sync success -> Wear OS node (0ms latency)`
    ];
    setSyncLogs(newLogs);
  };


  const highlightCode = (code: string) => {
    let html = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const tokens: string[] = [];
    const addToken = (str: string, cls: string) => {
      const placeholder = `___TOKEN_${tokens.length}___`;
      tokens.push(`<span class="${cls}">${str}</span>`);
      return placeholder;
    };

    html = html.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, (m) => addToken(m, 'text-amber-400 font-medium'));
    html = html.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m) => addToken(m, 'text-slate-500 italic'));

    const keywords = /\b(import|from|export|class|private|public|static|readonly|const|let|var|if|else|return|package|fun|val|override|enum|interface|type|async|await|try|catch|new|throw|void|string|number|boolean|any|Record|as)\b/g;
    html = html.replace(keywords, (m) => addToken(m, 'text-purple-400 font-bold'));

    const types = /\b(Coordinate|CalculationMethod|PrayerTimes|SolarEquations|OEMProfile|BatteryOptimTier|deviceProfiles|LiveCapsuleService|Service|Intent|IBinder|Notification|NotificationCompat|WearSyncService|DataClient|PutDataMapRequest|RemoteViews|IBinder|NextPrayerInfo|PrayerTime|DeviceProfile|UsePrayerTimesResult|PutDataMapRequest|Wearable|WearableListenerService|Context|Platform)\b/g;
    html = html.replace(types, (m) => addToken(m, 'text-[#3DD1C4]'));

    html = html.replace(/(@\w+)/g, (m) => addToken(m, 'text-emerald-400 font-semibold'));

    for (let i = tokens.length - 1; i >= 0; i--) {
      html = html.replace(`___TOKEN_${i}___`, tokens[i]);
    }

    return { __html: html };
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileContents[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Base prayer dataset for our simulator with real-time adaptation
  const locationData: Record<Location, { lat: string; lon: string; methodOffsets: Record<CalcMethod, number> }> = {
    Mecca: { lat: '21.4225° N', lon: '39.8262° E', methodOffsets: { Karachi: -5, ISNA: -10, MWL: -3, Egypt: 0, Makkah: 0, Jakarta: -2, Dubai: -4 } },
    Karachi: { lat: '24.8607° N', lon: '67.0011° E', methodOffsets: { Karachi: 0, ISNA: -8, MWL: -3, Egypt: 2, Makkah: 5, Jakarta: -2, Dubai: -5 } },
    London: { lat: '51.5074° N', lon: '0.1278° W', methodOffsets: { Karachi: 8, ISNA: -12, MWL: -5, Egypt: 12, Makkah: 15, Jakarta: 3, Dubai: 5 } },
    'New York': { lat: '40.7128° N', lon: '74.0060° W', methodOffsets: { Karachi: 10, ISNA: 0, MWL: 5, Egypt: 12, Makkah: 14, Jakarta: 6, Dubai: 8 } },
    Cairo: { lat: '30.0444° N', lon: '31.2357° E', methodOffsets: { Karachi: -3, ISNA: -8, MWL: -5, Egypt: 0, Makkah: 2, Jakarta: -4, Dubai: -6 } },
    Jakarta: { lat: '6.2088° S', lon: '106.8456° E', methodOffsets: { Karachi: 5, ISNA: 0, MWL: 3, Egypt: 6, Makkah: 8, Jakarta: 0, Dubai: 2 } },
    Dubai: { lat: '25.2048° N', lon: '55.2708° E', methodOffsets: { Karachi: 3, ISNA: -4, MWL: -2, Egypt: 5, Makkah: 7, Jakarta: -2, Dubai: 0 } }
  };

  const getSimulatedPrayerTimes = (): PrayerTimes => {
    // Dynamic calculation depending on selections
    const baseTimes: Record<Location, PrayerTimes> = {
      Mecca: { Fajr: '04:12 AM', Dhuhr: '12:22 PM', Asr: '03:41 PM', Maghrib: '07:04 PM', Isha: '08:34 PM' },
      Karachi: { Fajr: '03:36 AM', Dhuhr: '12:07 PM', Asr: '03:52 PM', Maghrib: '07:16 PM', Isha: '08:39 PM' },
      London: { Fajr: '02:50 AM', Dhuhr: '01:05 PM', Asr: '05:15 PM', Maghrib: '09:18 PM', Isha: '10:45 PM' },
      'New York': { Fajr: '03:48 AM', Dhuhr: '12:58 PM', Asr: '04:45 PM', Maghrib: '08:22 PM', Isha: '09:50 PM' },
      Cairo: { Fajr: '03:14 AM', Dhuhr: '11:58 AM', Asr: '03:32 PM', Maghrib: '06:58 PM', Isha: '08:30 PM' },
      Jakarta: { Fajr: '04:35 AM', Dhuhr: '11:52 AM', Asr: '03:14 PM', Maghrib: '05:46 PM', Isha: '06:59 PM' },
      Dubai: { Fajr: '03:58 AM', Dhuhr: '12:14 PM', Asr: '03:42 PM', Maghrib: '07:05 PM', Isha: '08:35 PM' }
    };

    const prayers = { ...baseTimes[selectedLocation] };
    
    // Shift Asr if Hanafi is selected
    if (juristicMethod === 'Hanafi') {
      const standardAsr = prayers.Asr;
      const [time, period] = standardAsr.split(' ');
      const [hourStr, minStr] = time.split(':');
      let hour = parseInt(hourStr);
      let min = parseInt(minStr) + 72; // Hanafi is roughly 1 hour 12 mins later in summer
      if (min >= 60) {
        hour += Math.floor(min / 60);
        min = min % 60;
      }
      const newHour = hour > 12 ? hour - 12 : hour;
      const hourPadded = newHour.toString().padStart(2, '0');
      const minPadded = min.toString().padStart(2, '0');
      prayers.Asr = `${hourPadded}:${minPadded} ${period}`;
    }

    // Adapt slightly according to regional calculation method offsets
    const offset = locationData[selectedLocation].methodOffsets[calcMethod];
    if (offset !== 0) {
      const shiftTime = (timeStr: string, offsetMins: number): string => {
        const [time, period] = timeStr.split(' ');
        const [hourStr, minStr] = time.split(':');
        let hour = parseInt(hourStr);
        let min = parseInt(minStr) + offsetMins;
        if (min >= 60) {
          hour += Math.floor(min / 60);
          min = min % 60;
        } else if (min < 0) {
          hour -= 1;
          min = 60 + min;
        }
        const hourPadded = hour.toString().padStart(2, '0');
        const minPadded = min.toString().padStart(2, '0');
        return `${hourPadded}:${minPadded} ${period}`;
      };
      
      prayers.Fajr = shiftTime(prayers.Fajr, offset);
      prayers.Isha = shiftTime(prayers.Isha, -offset);
    }

    return prayers;
  };

  const calculatedTimes = getSimulatedPrayerTimes();

  // Helper to parse time strings like "04:15 AM" into a Date object for today
  const parseSimulatedTime = (timeStr: string): Date => {
    const [time, period] = timeStr.split(' ');
    const [hourStr, minStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const min = parseInt(minStr, 10);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min, 0);
  };

  const [countdown, setCountdown] = useState<string>('');
  const [nextPrayerName, setNextPrayerName] = useState<string>('');
  const [activePrayerName, setActivePrayerName] = useState<string | null>(null);

  useEffect(() => {
    const getNextSimulatedPrayer = (prayersList: { name: string; time: string; date: Date }[]) => {
      const now = new Date();
      const sorted = [...prayersList].sort((a, b) => a.date.getTime() - b.date.getTime());
      
      for (const prayer of sorted) {
        if (prayer.date > now) {
          return prayer;
        }
      }
      const first = sorted[0];
      const tomorrowFajrDate = new Date(first.date);
      tomorrowFajrDate.setDate(tomorrowFajrDate.getDate() + 1);
      return { name: first.name, time: first.time, date: tomorrowFajrDate };
    };

    const updateCountdownTimer = () => {
      const now = new Date();
      
      // Calculate active status (whether a prayer started within the last 15 minutes)
      let active: string | null = null;
      const sorted = Object.entries(calculatedTimes).map(([name, time]) => ({
        name,
        date: parseSimulatedTime(time)
      })).sort((a, b) => a.date.getTime() - b.date.getTime());

      for (const p of sorted) {
        if (p.date <= now) {
          const diffMs = now.getTime() - p.date.getTime();
          if (diffMs <= 15 * 60000) {
            active = p.name;
          }
        }
      }
      setActivePrayerName(active);

      // Next prayer countdown calculation
      const prayers = Object.entries(calculatedTimes).map(([name, time]) => ({
        name,
        time,
        date: parseSimulatedTime(time)
      }));
      const next = getNextSimulatedPrayer(prayers);
      setNextPrayerName(next.name);

      const diffMs = next.date.getTime() - now.getTime();
      const totalSecs = Math.floor(diffMs / 1000);
      if (totalSecs <= 0) {
        setCountdown('Active');
      } else {
        const hours = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        let str = '';
        if (hours > 0) {
          str += `${hours}h ${mins}m ${secs}s`;
        } else if (mins > 0) {
          str += `${mins}m ${secs}s`;
        } else {
          str += `${secs}s`;
        }
        setCountdown(str);
      }
    };

    updateCountdownTimer();
    const interval = setInterval(updateCountdownTimer, 1000);
    return () => clearInterval(interval);
  }, [calculatedTimes]);

  const toggleNode = (node: string) => {
    setExpandedNodes(prev => ({ ...prev, [node]: !prev[node] }));
  };

  const fileContents: Record<string, { desc: string; code: string; lang: string }> = {
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
      desc: 'OEM battery optimization tier mapping. Formulates settings to bypass custom process-killing policies on modern defensive Android skins.',
      lang: 'typescript',
      code: `export interface DeviceProfile {
  brand: string;            // 'oppo', 'oneplus', 'vivo', 'samsung', etc.
  manufacturer: string;
  category: 1 | 2 | 3;      // OEM battery optimization tier
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

  return (
    <div className="min-h-screen bg-[#030606] text-[#A6B2B2] selection:bg-[#00F29D]/30 selection:text-[#00F29D] font-sans antialiased relative pb-16 overflow-x-hidden">
      
      {/* Custom Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none opacity-[0.05] mix-blend-screen -z-10" 
        style={{ backgroundImage: `url(${backgroundImg})` }} 
      />
      
      {/* Premium subtle mesh grid and floating lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,157,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,157,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[#00F29D]/5 to-[#3DD1C4]/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[#3DD1C4]/5 to-[#00F29D]/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* FLOATING GLASS PIL NAVBAR */}
      <div className="fixed top-4 inset-x-0 z-50 px-6 flex justify-center pointer-events-none">
        <header className={`pointer-events-auto h-16 w-full max-w-5xl rounded-2xl flex items-center justify-between px-6 border transition-all duration-500 ${scrolled ? 'bg-[#060A0A]/85 backdrop-blur-xl border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : 'bg-transparent border-transparent'}`}>
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F29D] to-[#3DD1C4] p-[1px] shadow-[0_0_15px_rgba(0,242,157,0.15)] group-hover:shadow-[0_0_20px_rgba(0,242,157,0.3)] transition-all overflow-hidden">
              <div className="w-full h-full bg-[#030606] rounded-[11px] flex items-center justify-center overflow-hidden p-1.5">
                <img src={iconImg} alt="DeenPulse Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-[#00F29D] transition-colors">
              Deen<span className="text-[#00F29D]">Pulse</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#features" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#simulator" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Local Simulator</a>
            <a href="#structure" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Architecture</a>
            <a href="#faq" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Download CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="#downloads" 
              className="h-10 px-4 bg-white/[0.03] hover:bg-[#00F29D] text-slate-300 hover:text-[#060a0a] border border-white/[0.06] hover:border-transparent text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get APK</span>
            </a>
            <a 
              href="https://github.com/syedarhamraza/deen-pulse" 
              target="_blank" 
              rel="noreferrer" 
              className="w-10 h-10 bg-white/[0.03] border border-white/[0.06] hover:border-[#00F29D]/40 text-slate-300 hover:text-[#00F29D] rounded-xl transition-all flex items-center justify-center"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden w-10 h-10 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>
      </div>

      {/* MOBILE NAV ACCORDION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-24 inset-x-6 bg-[#0c1212]/95 backdrop-blur-xl border border-white/[0.08] z-40 p-6 rounded-2xl flex flex-col gap-4 shadow-2xl"
          >
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D]"
            >
              Features
            </a>
            <a 
              href="#simulator" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D]"
            >
              Local Simulator
            </a>
            <a 
              href="#structure" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D]"
            >
              Architecture
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D]"
            >
              FAQ
            </a>
            <div className="h-px bg-white/[0.08] my-2" />
            <div className="flex gap-4">
              <a 
                href="#downloads" 
                onClick={() => setMobileMenuOpen(false)} 
                className="flex-1 py-3 text-center bg-[#111616] border border-white/[0.08] text-xs font-bold uppercase tracking-wider rounded-xl text-white flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Get APK</span>
              </a>
              <a 
                href="https://github.com/syedarhamraza/deen-pulse" 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-[#111616] border border-white/[0.08] rounded-xl text-slate-300 flex items-center justify-center"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="pt-36 pb-20 px-6 relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
        
        {/* Glow pill */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#00F29D]/5 border border-[#00F29D]/15 rounded-full backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#00F29D] animate-pulse" />
          <span className="text-xs font-mono font-bold text-[#00F29D] uppercase tracking-widest font-mono">
            {releaseInfo.loading ? 'Checking Updates...' : releaseInfo.version ? `${releaseInfo.version} Stable Release` : 'Latest Stable Release'}
          </span>
        </motion.div>

        {/* Premium Typographic Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] max-w-5xl"
        >
          Devotion uninterrupted.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F29D] via-[#2CE1A6] to-[#3DD1C4]">
            Bypassing OEM limits.
          </span>
        </motion.h1>

        {/* Copywriting Subheader */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-3xl font-sans"
        >
          A privacy-focused Islamic prayer companion for Android & Wear OS. Built with Kotlin and React Native, utilizing a local-first caching architecture that runs completely offline—without location tracking, cloud queries, or telemetry.
        </motion.p>

        {/* Clean, Premium Call-to-actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-4"
        >
          <a 
            href="#downloads" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00F29D] to-[#3DD1C4] text-[#060A0A] font-extrabold rounded-xl hover:shadow-[0_0_35px_rgba(0,242,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <Smartphone className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            <span>Get Mobile APK</span>
          </a>
          <a 
            href="#downloads" 
            className="w-full sm:w-auto px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#3DD1C4]/40 text-slate-300 font-extrabold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <Watch className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span>Get Wear OS Companion</span>
          </a>
        </motion.div>

        {/* Visual Showcase: Overlapping Device Frame Assembly */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl mt-16 relative flex items-center justify-center"
        >
          {/* Neon radial backdrop shadow */}
          <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-[#00F29D]/10 to-[#3DD1C4]/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

          <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 lg:gap-16">
            
            {/* Mobile Phone Mockup */}
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00F29D]/20 to-[#3DD1C4]/20 rounded-[44px] blur-lg opacity-60 group-hover:opacity-100 transition duration-700" />
              <MobilePhoneFrame />
            </div>

            {/* Wear OS Watch Mockup (floating slightly) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative group md:-ml-12 lg:-ml-20 md:-mt-16 z-20"
            >
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#3DD1C4]/30 to-[#00F29D]/10 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-700" />
              <WearOSWatchFrame />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* DUAL APK DOWNLOAD BANNER */}
      <section id="downloads" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4">
            Direct Release Payloads
          </h2>
          <p className="text-slate-400 text-lg">
            DeenPulse remains fully isolated from Play Store tracking frameworks. Clean, untampered binaries available directly.
          </p>
        </div>

        {/* Release Stats Banner */}
        <div className="bg-[#0c1212]/75 border border-white/[0.06] rounded-3xl p-6 sm:p-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 flex-1 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#00F29D]/10 border border-[#00F29D]/20 flex items-center justify-center text-[#00F29D] flex-shrink-0 shadow-[0_0_15px_rgba(0,242,157,0.1)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <strong className="font-heading text-white text-lg font-bold">Latest Release: {releaseInfo.loading ? 'Checking...' : releaseInfo.version || 'Active'}</strong>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-slate-400 text-sm">
                {releaseInfo.loading ? 'Fetching release details...' : releaseInfo.publishedAt ? `Published on ${releaseInfo.publishedAt}. Verified integrity check.` : 'Direct clean APK payloads. Sideload ready.'}
              </span>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-12 bg-white/[0.08]" />
          
          <div className="flex flex-col gap-1 flex-shrink-0 text-left">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider font-mono">System compatibility</span>
            <span className="text-white text-base font-bold">Android 9.0+ / Wear OS 3.0+</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Mobile Client APK */}
          <div className="bg-[#0c1212]/70 rounded-3xl border border-white/[0.06] hover:border-[#00F29D]/30 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl pointer-events-none" />
            
            <div className="text-left">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-[#00F29D]/10 rounded-2xl text-[#00F29D] border border-[#00F29D]/20">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#00F29D] bg-[#00F29D]/10 px-2.5 py-1 rounded-full border border-[#00F29D]/20">
                    Latest Stable
                  </span>
                  <p className="text-xs text-slate-400 mt-2 font-mono">
                    {releaseInfo.loading ? 'Checking size...' : `${releaseInfo.version || 'Latest'} ${releaseInfo.mobileSize ? `• ${releaseInfo.mobileSize}` : ''}`}
                  </p>
                </div>
              </div>

              <h3 className="font-heading text-2xl font-bold text-white mb-2">Mobile Application</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Primary prayer time utility for Android. Uses low-power geolocation to cache monthly calendars locally, schedules background notifications, and runs a status bar capsule overlay.
              </p>

              <div className="space-y-3 mb-8 border-t border-white/[0.05] pt-6 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#00F29D] flex-shrink-0" />
                  <span>3-Tier OEM battery optimization profiles integrated</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#00F29D] flex-shrink-0" />
                  <span>Supports persistent status capsule or standard alarm schedules</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#00F29D] flex-shrink-0" />
                  <span>Privacy-first architecture with zero tracking coordinates</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <a 
                href={releaseInfo.mobileUrl}
                download={releaseInfo.mobileName}
                className="w-full py-4 bg-gradient-to-r from-[#00F29D]/10 to-[#3DD1C4]/10 hover:from-[#00F29D] hover:to-[#3DD1C4] hover:text-[#060a0a] border border-[#00F29D]/25 hover:border-transparent font-extrabold text-sm rounded-xl text-white transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-98"
              >
                <Download className="w-4.5 h-4.5" />
                <span>Download Mobile APK</span>
              </a>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>SHA-256 Checksum:</span>
                <span className="hover:text-white transition-colors cursor-pointer" title="Double click to copy">
                  5f2c...8dbe6ef
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Wear OS Client APK */}
          <div className="bg-[#0c1212]/70 rounded-3xl border border-white/[0.06] hover:border-[#3DD1C4]/30 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative group shadow-2xl text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#3DD1C4]/5 to-transparent rounded-tr-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-[#3DD1C4]/15 rounded-2xl text-[#3DD1C4] border border-[#3DD1C4]/20">
                  <Watch className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#3DD1C4] bg-[#3DD1C4]/10 px-2.5 py-1 rounded-full border border-[#3DD1C4]/20">
                    WearOS Companion
                  </span>
                  <p className="text-xs text-slate-400 mt-2 font-mono">
                    {releaseInfo.loading ? 'Checking size...' : `${releaseInfo.version || 'Latest'} ${releaseInfo.watchSize ? `• ${releaseInfo.watchSize}` : ''}`}
                  </p>
                </div>
              </div>

              <h3 className="font-heading text-2xl font-bold text-white mb-2">Wear OS companion</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Native smartwatch client module. Syncs prayer schedules silently over the Google Play Services DataClient to update circular komplikation complications and tiles.
              </p>

              <div className="space-y-3 mb-8 border-t border-white/[0.05] pt-6 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#3DD1C4] flex-shrink-0" />
                  <span>Supports standalone or synced complication feeds</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#3DD1C4] flex-shrink-0" />
                  <span>Optimized layout ratios for circular smartwatch models</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#3DD1C4] flex-shrink-0" />
                  <span>Low-overhead data syncing to minimize bluetooth wakes</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <a 
                href={releaseInfo.watchUrl}
                download={releaseInfo.watchName}
                className="w-full py-4 bg-gradient-to-r from-[#3DD1C4]/10 to-[#00F29D]/10 hover:from-[#3DD1C4] hover:to-[#00F29D] hover:text-[#060a0a] border border-[#3DD1C4]/25 hover:border-transparent font-extrabold text-sm rounded-xl text-white transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-98"
              >
                <Download className="w-4.5 h-4.5" />
                <span>Download Watch APK</span>
              </a>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>SHA-256 Checksum:</span>
                <span className="hover:text-white transition-colors cursor-pointer" title="Double click to copy">
                  9b1e...0cca54d
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* BENTO GRID FEATURES */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Engineered for quiet resilience.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            DeenPulse solves the background reliability problem natively, ensuring your status updates are exact and your watch stays synced without cloud polling or telemetry logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Interactive Status Capsule Simulator (Col 7) */}
          <div className="md:col-span-7 bg-[#0c1212]/90 border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00F29D]/10 border border-[#00F29D]/25 flex items-center justify-center text-[#00F29D]">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-xl font-extrabold text-white">Live Status Bar Capsule</h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                    Android 16+ & Custom OEM Skins
                  </span>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6 text-left">
                Maintains a live countdown capsule on custom manufacturer skins (ColorOS/Funtouch OS) and standard Android 16+ devices using ongoing notification chips. Standard devices on older releases fall back to standard, non-pill notifications.
              </p>
            </div>

            {/* Interactive Capsule Simulation */}
            <div className="bg-[#050808] border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-6">
              <p className="text-xs font-mono text-slate-500 text-left uppercase tracking-wider">Interactive Pill Preview</p>
              
              {/* Mock Status Bar */}
              <div className="w-full h-12 bg-black rounded-full border border-white/10 px-6 flex items-center justify-between relative overflow-hidden">
                <span className="text-xs text-white font-semibold font-mono">08:00</span>
                
                {/* Simulated Notch / Dynamic Capsule Pill */}
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#0c1212] border border-white/15 h-8 px-4 rounded-full flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,157,0.1)] transition-all duration-500">
                  <Compass className="w-3.5 h-3.5 text-[#00F29D] animate-spin-slow" />
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    {simCapsuleFormat === 'name' && 'Fajr'}
                    {simCapsuleFormat === 'name_time' && 'Fajr at 04:15 AM'}
                    {simCapsuleFormat === 'time' && '04:15 AM'}
                    {simCapsuleFormat === 'name_countdown' && `Fajr: ${countdown}`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <WifiOff className="w-3.5 h-3.5 text-white/30" />
                  <span className="font-mono">82%</span>
                </div>
              </div>

              {/* Format Controls */}
              <div className="flex flex-wrap gap-2 justify-start">
                {(['name', 'name_time', 'time', 'name_countdown'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSimCapsuleFormat(fmt)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${simCapsuleFormat === fmt ? 'bg-[#00F29D]/10 text-[#00F29D] border-[#00F29D]/30' : 'bg-white/[0.02] text-slate-400 border-white/[0.05] hover:text-white'}`}
                  >
                    {fmt === 'name' && 'Name Only'}
                    {fmt === 'name_time' && 'Name + Time'}
                    {fmt === 'time' && 'Time Only'}
                    {fmt === 'name_countdown' && 'Name + Countdown'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: WearSync Data Layer Terminal (Col 5) */}
          <div className="md:col-span-5 bg-[#0c1212]/90 border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#3DD1C4]/5 to-transparent rounded-tr-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#3DD1C4]/10 border border-[#3DD1C4]/25 flex items-center justify-center text-[#3DD1C4]">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-xl font-extrabold text-white">Wear OS Companion</h3>
                  <span className="text-[10px] font-mono text-[#3DD1C4] bg-[#3DD1C4]/10 px-2 py-0.5 rounded border border-[#3DD1C4]/20 uppercase tracking-widest">
                    Google Wearable DataLayer
                  </span>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6 text-left">
                Pushes monthly timing databases and settings over Bluetooth using Wearable `DataClient` APIs. Circular complications and Tiles read directly from the watch's local cache.
              </p>
            </div>

            {/* Terminal simulation */}
            <div className="bg-[#050808] border border-white/[0.04] rounded-2xl p-5 flex flex-col gap-3 font-mono text-[11px] text-left">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-2 text-[10px] text-slate-500 uppercase tracking-wider">
                <span>WearSync DataClient Console</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              
              <div className="space-y-1.5 overflow-hidden h-[95px] scrollbar-none text-slate-400">
                {syncLogs.map((log, index) => (
                  <p key={index} className={log.includes('success') ? 'text-emerald-400' : ''}>
                    {log}
                  </p>
                ))}
              </div>

              <button
                onClick={triggerMockSync}
                className="w-full mt-2 py-2 bg-[#0c1212] hover:bg-[#3DD1C4]/10 hover:text-[#3DD1C4] border border-white/[0.05] hover:border-[#3DD1C4]/30 text-slate-300 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate Sync Broadcast</span>
              </button>
            </div>
          </div>

          {/* Card 3: OEM Battery Tier Profiler (Col 6) */}
          <div className="md:col-span-6 bg-[#0c1212]/90 border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-tr-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-xl font-extrabold text-white">OEM Optimization Handling</h3>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                    wakeLock mappings
                  </span>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6 text-left">
                Defeats non-standard background executors inside custom brand modifications. Maps target device manufacturers into three distinct behavioral categories.
              </p>
            </div>

            {/* Profile Configurator UI */}
            <div className="bg-[#050808] border border-white/[0.04] rounded-2xl p-5 flex flex-col gap-4 text-left">
              <div className="flex gap-2">
                {(['oppo', 'vivo', 'samsung'] as const).map((oem) => (
                  <button
                    key={oem}
                    onClick={() => setSelectedOemProfile(oem)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all uppercase ${selectedOemProfile === oem ? 'bg-amber-400/10 text-amber-400 border-amber-400/30' : 'bg-white/[0.02] text-slate-400 border-white/[0.05] hover:text-white'}`}
                  >
                    {oem === 'oppo' ? 'Oppo/1+' : oem === 'vivo' ? 'Vivo/iQOO' : 'Samsung/Pixel'}
                  </button>
                ))}
              </div>

              <div className="space-y-3 font-mono text-xs border-t border-white/[0.05] pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Device Tier:</span>
                  <span className="text-white font-bold">
                    {selectedOemProfile === 'oppo' ? 'Category 1 (Aggressive)' : selectedOemProfile === 'vivo' ? 'Category 2 (Moderate)' : 'Category 3 (AOSP Compliant)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Model:</span>
                  <span className="text-white">
                    {selectedOemProfile === 'oppo' ? 'Foreground capsule service overlay' : selectedOemProfile === 'vivo' ? 'Foreground clock hook service' : 'AlarmManager scheduling (default)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">wakeLockTimeout:</span>
                  <span className="text-amber-400 font-bold">
                    {selectedOemProfile === 'oppo' ? '15 minutes' : selectedOemProfile === 'vivo' ? '20 minutes' : 'Disabled (exact alarms)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Live Capsule Compatibility:</span>
                  <span className="text-emerald-400">
                    {selectedOemProfile === 'samsung' ? 'Android 16+ (Standard notifications prior)' : 'Cat 1 & 2 OEM skins / Android 16+'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Geolocation Fetch & Kill (Col 6) */}
          <div className="md:col-span-6 bg-[#0c1212]/90 border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00F29D]/10 border border-[#00F29D]/25 flex items-center justify-center text-[#00F29D]">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-xl font-extrabold text-white">Fetch & Kill Geolocation</h3>
                  <span className="text-[10px] font-mono text-[#00F29D] bg-[#00F29D]/10 px-2 py-0.5 rounded border border-[#00F29D]/20 uppercase tracking-widest">
                    Low-Power GPS Triangulation
                  </span>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6 text-left">
                A location routine that queries cell-tower coordinates for just 500ms once a month and instantly frees the system GPS lock. Completely avoids the continuous tracking cycles common in generic apps.
              </p>
            </div>

            {/* Battery comparison chart simulator */}
            <div className="bg-[#050808] border border-white/[0.04] rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>GPS HARDWARE WAKELOCKS OVER 24H</span>
                <span className="text-[#00F29D]">DeenPulse: 1x wake</span>
              </div>
              
              {/* Graphic line chart */}
              <div className="h-20 flex items-end gap-1 border-b border-l border-white/10 p-2 relative">
                
                {/* Standard app line */}
                <div className="absolute inset-x-0 bottom-1/2 h-0.5 bg-red-500/30 border-t border-dashed border-red-500" />
                <span className="absolute right-4 top-2 text-[9px] font-mono text-red-400">Standard apps (constant polling)</span>

                {/* DeenPulse Line */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <path 
                    d="M 10 70 L 100 70 L 105 10 L 110 70 L 400 70" 
                    fill="none" 
                    stroke="#00F29D" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    className="shadow-[0_0_10px_rgba(0,242,157,0.3)]"
                  />
                </svg>
                <span className="absolute left-32 bottom-2 text-[9px] font-mono text-emerald-400 font-bold">DeenPulse: Fetch & Kill (500ms)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE LOCAL ENGINE SIMULATOR */}
      <section id="simulator" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 text-left">
            <div className="inline-flex items-center gap-2 bg-[#00F29D]/10 text-[#00F29D] font-bold text-xs uppercase px-3 py-1.5 rounded-full mb-6 border border-[#00F29D]/20 font-mono">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Offline Engine telemetry</span>
            </div>
            
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              Offline Telemetry Simulator
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Play with the configurations below to see how DeenPulse re-aligns cached timetables, formats countdown ticks, shifts Asr timelines based on juristic rules, and translates timezone offsets locally on-device.
            </p>

            {/* Custom Control Hub Dashboard */}
            <div className="space-y-6 bg-[#0c1212]/80 p-6 rounded-3xl border border-white/[0.05] shadow-lg">
              
              {/* Selector 1: Location */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 font-mono">
                  Coordinate Seeds (Selected City)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['Karachi', 'Mecca', 'London', 'New York', 'Cairo', 'Jakarta', 'Dubai'] as Location[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${selectedLocation === loc ? 'bg-[#00F29D]/10 text-[#00F29D] border-[#00F29D]/30' : 'bg-[#050808]/70 text-slate-400 border-white/[0.04] hover:text-white hover:border-white/[0.08]'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-3 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F29D]" />
                  Coordinates: <span className="text-slate-300">{locationData[selectedLocation].lat}, {locationData[selectedLocation].lon}</span>
                </p>
              </div>

              {/* Selector 2: Juristic Rule */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 font-mono">
                  Juristic Rule (Asr Shadow method)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Standard', 'Hanafi'] as JuristicMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => setJuristicMethod(method)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${juristicMethod === method ? 'bg-[#00F29D]/10 text-[#00F29D] border-[#00F29D]/30' : 'bg-[#050808]/70 text-slate-400 border-white/[0.04] hover:text-white hover:border-white/[0.08]'}`}
                    >
                      {method === 'Standard' ? 'Standard (1x shadow)' : 'Hanafi (2x shadow)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 3: Astronomical Angle Calculation method */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 font-mono">
                  Calculation Rule Preset
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {(['Karachi', 'ISNA', 'MWL', 'Egypt', 'Makkah', 'Jakarta', 'Dubai'] as CalcMethod[]).map((meth) => (
                    <button
                      key={meth}
                      onClick={() => setCalcMethod(meth)}
                      className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${calcMethod === meth ? 'bg-[#00F29D]/10 text-[#00F29D] border-[#00F29D]/30' : 'bg-[#050808]/70 text-slate-400 border-white/[0.04] hover:text-white hover:border-white/[0.08]'}`}
                      title={
                        meth === 'Karachi' ? 'Karachi (18°)' : 
                        meth === 'ISNA' ? 'ISNA (15°)' : 
                        meth === 'MWL' ? 'MWL (18°)' : 
                        meth === 'Egypt' ? 'Egypt (19.5°)' :
                        meth === 'Makkah' ? 'Makkah (18.5°)' :
                        meth === 'Jakarta' ? 'Indonesia (20°)' :
                        'Dubai (16°)'
                      }
                    >
                      {meth}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Side: Telemetry Response timeline */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-[#0c1212]/80 rounded-3xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl" />
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <Cpu className="text-[#00F29D] w-5 h-5 animate-pulse" />
                  <span className="font-heading font-bold text-lg text-white">Local CPU Timetable</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                  100% Offline
                </span>
              </div>

              {/* Dynamic Timeline Layout */}
              <div className="relative pl-6 border-l border-white/[0.05] space-y-6 text-left">
                
                {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((name) => {
                  const time = calculatedTimes[name];
                  const isNext = name === nextPrayerName;
                  const isActive = name === activePrayerName;
                  
                  let label = 'Upcoming';
                  let borderClass = 'border-white/[0.02] bg-[#050808]/40';
                  let timelineDotClass = 'bg-slate-700 border-2 border-[#0c1212]';
                  let timeColor = 'text-slate-400';
                  let glowPill = null;

                  if (isActive) {
                    label = 'Active Now';
                    borderClass = 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.08)]';
                    timelineDotClass = 'bg-amber-500 ring-4 ring-amber-500/20';
                    timeColor = 'text-amber-400 font-extrabold';
                    glowPill = (
                      <span className="text-[8px] font-mono font-bold text-amber-400 bg-amber-400/15 border border-amber-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse ml-2">
                        Ongoing
                      </span>
                    );
                  } else if (isNext) {
                    label = `Next • ${countdown}`;
                    borderClass = 'border-[#00F29D]/30 bg-[#00F29D]/5 shadow-[0_0_20px_rgba(0,242,157,0.08)]';
                    timelineDotClass = 'bg-[#00F29D] ring-4 ring-[#00F29D]/20';
                    timeColor = 'text-[#00F29D] font-extrabold';
                    glowPill = (
                      <span className="text-[8px] font-mono font-bold text-[#00F29D] bg-[#00F29D]/15 border border-[#00F29D]/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse ml-2">
                        Countdown
                      </span>
                    );
                  } else {
                    const pDate = parseSimulatedTime(time);
                    if (pDate <= new Date()) {
                      label = 'Passed';
                      borderClass = 'opacity-50 border-transparent bg-transparent';
                      timelineDotClass = 'bg-slate-800 border border-white/10';
                      timeColor = 'text-slate-600 line-through';
                    }
                  }

                  const displayNames: Record<string, string> = {
                    Fajr: 'Fajr',
                    Dhuhr: 'Dhuhr',
                    Asr: 'Asr',
                    Maghrib: 'Maghrib',
                    Isha: 'Isha'
                  };

                  return (
                    <div key={name} className="relative group/time">
                      
                      {/* Left Dot on the border line */}
                      <div className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-10 transition-all duration-300 ${timelineDotClass}`} />
                      
                      <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${borderClass}`}>
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-white font-heading">{displayNames[name]}</span>
                            {glowPill}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block mt-1 uppercase tracking-wider">{label}</span>
                        </div>
                        <span className={`text-base font-mono font-bold ${timeColor}`}>{time}</span>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* Lat/Lon Stamp */}
              <div className="mt-8 pt-5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Calculated Seed:</span>
                <span className="text-slate-300">{locationData[selectedLocation].lat} / {locationData[selectedLocation].lon}</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CODEBASE BROWSER SECTION */}
      <section id="structure" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Production-grade architecture.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            DeenPulse architecture is cleanly modularized into a React Native core, a standalone Kotlin Wear OS engine, and shared database interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 bg-[#0c1212]/90 rounded-3xl border border-white/[0.06] p-5 shadow-2xl text-left overflow-hidden">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.05]">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="text-[11px] font-mono text-slate-500 ml-2">deen-pulse-app{releaseInfo.version ? `-${releaseInfo.version}` : ''}</span>
            </div>

            <div className="space-y-2 font-mono text-xs text-slate-400 select-none">
              
              {/* node: android */}
              <div>
                <div 
                  onClick={() => toggleNode('android')}
                  className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  {expandedNodes['android'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  <span className="text-amber-400 text-xs">📁</span>
                  <span className="font-bold text-slate-200">android</span>
                </div>

                {expandedNodes['android'] && (
                  <div className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1.5">
                    
                    {/* node: android/app */}
                    <div>
                      <div 
                        onClick={() => toggleNode('android/app')}
                        className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        {expandedNodes['android/app'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="text-amber-400 text-xs">📁</span>
                        <span className="text-slate-300">app</span>
                      </div>
                      
                      {expandedNodes['android/app'] && (
                        <div className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1">
                          <div 
                            onClick={() => setActiveFile('PrayerCapsuleForegroundService.kt')}
                            className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all ${activeFile === 'PrayerCapsuleForegroundService.kt' ? 'bg-[#3DD1C4]/10 text-[#3DD1C4]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                          >
                            <span className="text-[#3DD1C4] text-[10px] font-bold">KT</span>
                            <span>PrayerCapsuleForegroundService.kt</span>
                          </div>
                          <div 
                            onClick={() => setActiveFile('WearDataSyncService.kt')}
                            className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all ${activeFile === 'WearDataSyncService.kt' ? 'bg-[#3DD1C4]/10 text-[#3DD1C4]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                          >
                            <span className="text-[#3DD1C4] text-[10px] font-bold">KT</span>
                            <span>WearDataSyncService.kt</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* node: src */}
              <div>
                <div 
                  onClick={() => toggleNode('src')}
                  className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  {expandedNodes['src'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  <span className="text-amber-400 text-xs">📁</span>
                  <span className="font-bold text-slate-200">src</span>
                </div>
                {expandedNodes['src'] && (
                  <div className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1.5">
                    
                    {/* node: src/hooks */}
                    <div>
                      <div 
                        onClick={() => toggleNode('src/hooks')}
                        className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        {expandedNodes['src/hooks'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="text-amber-400 text-xs">📁</span>
                        <span className="text-slate-300">hooks</span>
                      </div>
                      {expandedNodes['src/hooks'] && (
                        <div className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1">
                          <div 
                            onClick={() => setActiveFile('usePrayerTimes.ts')}
                            className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all ${activeFile === 'usePrayerTimes.ts' ? 'bg-[#00F29D]/10 text-[#00F29D]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                          >
                            <span className="text-[#00F29D] text-[10px] font-bold">TS</span>
                            <span>usePrayerTimes.ts</span>
                          </div>
                          <div 
                            onClick={() => setActiveFile('usePrayerCountdown.ts')}
                            className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all ${activeFile === 'usePrayerCountdown.ts' ? 'bg-[#00F29D]/10 text-[#00F29D]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                          >
                            <span className="text-[#00F29D] text-[10px] font-bold">TS</span>
                            <span>usePrayerCountdown.ts</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* node: src/utils */}
                    <div>
                      <div 
                        onClick={() => toggleNode('src/utils')}
                        className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        {expandedNodes['src/utils'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="text-amber-400 text-xs">📁</span>
                        <span className="text-slate-300">utils</span>
                      </div>
                      {expandedNodes['src/utils'] && (
                        <div className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1">
                          <div 
                            onClick={() => setActiveFile('prayerEngine.ts')}
                            className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all ${activeFile === 'prayerEngine.ts' ? 'bg-[#00F29D]/10 text-[#00F29D]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                          >
                            <span className="text-[#00F29D] text-[10px] font-bold">TS</span>
                            <span>prayerEngine.ts</span>
                          </div>
                          <div 
                            onClick={() => setActiveFile('deviceProfiles.ts')}
                            className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all ${activeFile === 'deviceProfiles.ts' ? 'bg-[#00F29D]/10 text-[#00F29D]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                          >
                            <span className="text-[#00F29D] text-[10px] font-bold">TS</span>
                            <span>deviceProfiles.ts</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>

          {/* IDE-like Code Editor Panel (Col-span-8) */}
          <div className="lg:col-span-8 bg-[#090D0D] rounded-3xl border border-white/[0.06] overflow-hidden shadow-2xl flex flex-col h-[520px]">
            
            {/* Editor Tabs bar */}
            <div className="bg-[#050808]/70 px-4 border-b border-white/[0.05] flex items-center justify-between h-12">
              <div className="flex gap-1">
                <div className="bg-[#090D0D] border-x border-t border-white/[0.06] px-4 h-12 flex items-center gap-2 text-xs font-mono text-white font-semibold rounded-t-lg">
                  <Code className="w-3.5 h-3.5 text-[#00F29D]" />
                  <span>{activeFile}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={copyToClipboard}
                  className="px-2.5 py-1 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-slate-400 hover:text-white rounded-lg flex items-center gap-1.5 text-[10px] font-mono transition-all uppercase font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-2 py-1 rounded">
                  {activeFile.endsWith('.ts') ? 'TypeScript' : 'Kotlin'}
                </span>
              </div>
            </div>

            {/* Description tooltip */}
            <div className="bg-[#00F29D]/5 border-b border-white/[0.03] px-5 py-3.5 text-xs text-slate-400 text-left leading-relaxed">
              <span className="font-bold text-[#00F29D] font-mono mr-1">MODULE GOAL:</span> {fileContents[activeFile].desc}
            </div>

            {/* Code lines container */}
            <div className="flex-1 overflow-auto p-5 text-left font-mono text-xs leading-relaxed text-slate-300 bg-[#090D0D]/40 scrollbar-thin flex">
              
              {/* Fake line numbers */}
              <div className="pr-4 border-r border-white/[0.04] text-slate-600 text-right select-none space-y-0.5">
                {fileContents[activeFile].code.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code */}
              <pre className="pl-4 whitespace-pre select-text flex-1">
                <code dangerouslySetInnerHTML={highlightCode(fileContents[activeFile].code)} />
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto relative z-10 scroll-mt-20 text-left">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#3DD1C4]/10 text-[#3DD1C4] font-bold text-xs uppercase px-3 py-1.5 rounded-full mb-4 border border-[#3DD1C4]/20 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Common Queries</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to know about the DeenPulse offline model, sleep optimization bypasses, and releases.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Is DeenPulse really 100% offline?",
              a: "DeenPulse uses a local-first cache design. It retrieves coordinates via a low-power one-shot GPS query and fetches a monthly prayer calendar from the Aladhan API. Once cached, it runs 100% offline. The app performs zero network calls during daily use, and has a fallback mechanism to use any previously cached calendar if it cannot connect to the internet at the start of a new month."
            },
            {
              q: "Why is direct APK installation recommended?",
              a: "Installing the APKs directly from GitHub releases ensures you get the clean, untampered binaries with zero analytics, tracking, or telemetry libraries. It keeps the utility lightweight and isolated from Play Store background services."
            },
            {
              q: "How do custom OEM battery profiles work?",
              a: "Many manufacturers (like OPPO, OnePlus, Vivo, Xiaomi, and Samsung) use aggressive background task managers that kill long-running background services. DeenPulse maps devices into three optimization tiers. Category 1 (OPPO/OnePlus/Realme) and Category 2 (Vivo/iQOO) use custom Android notification APIs (setRequestPromotedOngoing) to keep the service active. Category 3 (Samsung, Xiaomi, Pixel) utilizes standard exact alarms on older Android versions, or standard notifications. The ongoing Live Capsule is supported natively on standard AOSP devices starting with Android 16+ using Google's new ongoing status bar chips, and on supported ColorOS/Funtouch OS OEM overlays."
            },
            {
              q: "Does the Wear OS synchronization drain the watch battery?",
              a: "No. The companion watch app uses the Google Play Services Wearable Data Layer. Instead of constant polling, it pushes configuration updates and prayer timetables only when settings change or fresh monthly calendars are loaded. The watch reads directly from its local data client cache, resulting in zero idle background battery usage."
            },
            {
              q: "How is my location data handled?",
              a: "Location coordinates are cached locally on your device in secure AsyncStorage. They are only used to query the monthly calendar and are never shared or sent to any telemetry or cloud databases."
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-[#0c1212]/60 border rounded-2xl transition-all duration-300 overflow-hidden ${openFaq === idx ? 'border-[#00F29D]/40 shadow-[0_8px_30px_rgba(0,242,157,0.03)]' : 'border-white/[0.06] hover:border-white/[0.12]'}`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-heading font-bold text-white text-base md:text-lg">{item.q}</span>
                <span className="flex-shrink-0 ml-4 p-1 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[#00F29D] transition-transform duration-300">
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === idx ? 'transform rotate-180' : ''}`} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/[0.04] pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0c1212]/30 border-t border-white/[0.06] relative z-10 pt-16 pb-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00F29D] to-[#3DD1C4] p-[1px] overflow-hidden shadow-[0_0_10px_rgba(0,242,157,0.1)]">
                <div className="w-full h-full bg-[#030606] rounded-[5px] flex items-center justify-center overflow-hidden p-1">
                  <img src={iconImg} alt="DeenPulse Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                Deen<span className="text-[#00F29D]">Pulse</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm text-center md:text-left max-w-sm leading-relaxed mt-2">
              An offline prayer companion designed to bypass aggressive OEM background limits and sync complications natively with Wear OS.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
            <p className="text-xs text-slate-400">
              Created under the MIT License by <span className="font-bold text-white">Syed Arham Raza</span>
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Copyright © 2026 DeenPulse App Project. All rights reserved.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://github.com/syedarhamraza/deen-pulse" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-[#00F29D] transition-all">GitHub Repo</a>
              <span className="text-white/10">•</span>
              <a href="#downloads" className="text-xs text-slate-500 hover:text-[#00F29D] transition-all">Download Binaries</a>
              <span className="text-white/10">•</span>
              <a href="#" className="text-xs text-slate-500 hover:text-[#00F29D] transition-all">Privacy Agreement</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

// ==========================================
// CUSTOM FRONTEND RE-CREATION SUBCOMPONENTS
// ==========================================

// 1. MOBILE PHONE FRAME COMPONENT
function MobilePhoneFrame() {
  return (
    <div className="w-[280px] h-[550px] bg-[#0c1212] rounded-[44px] border-[6px] border-white/[0.08] p-1 relative shadow-[0_25px_60px_rgba(0,10,10,0.9),0_0_1px_1px_rgba(255,255,255,0.05),inset_0_2px_4px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden transition-all duration-300 select-none">
      
      {/* Top Speaker grill & Bezel Detail */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-black rounded-full z-30" />

      {/* Screen Interface Frame */}
      <div className="flex-1 bg-[#060A0A] rounded-[36px] overflow-hidden relative border border-white/[0.03] flex flex-col">
        <img
          src={mainAppImg}
          alt="Phone screen: DeenPulse Dashboard"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

// 2. WEAR OS WATCH FRAME COMPONENT
function WearOSWatchFrame() {
  return (
    <div className="w-[190px] h-[190px] rounded-full bg-gradient-to-br from-[#121616] via-[#2a3030] to-[#040606] border-[5px] border-[#252828] p-1 relative flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.1)] select-none">
      
      {/* Side crown button */}
      <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#252828] rounded-r border border-l-0 border-white/10 shadow" />
      
      {/* Inner Screen circular viewport */}
      <div className="w-full h-full rounded-full bg-black relative overflow-hidden border border-white/[0.04] flex items-center justify-center">
        <img
          src={wearosImg}
          alt="Wear OS Complication Dial"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
