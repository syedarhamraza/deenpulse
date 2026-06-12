import { useState, useEffect } from 'react';
import { Location, JuristicMethod, CalcMethod, PrayerTimes } from '../types';
import { locationData } from '../constants';
import { useAnimatedNumber } from './useAnimatedNumber';

export function usePrayerSimulator(
  selectedLocation: Location,
  juristicMethod: JuristicMethod,
  calcMethod: CalcMethod
) {
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

  const [countdownSecs, setCountdownSecs] = useState<number>(0);
  const animSecs = useAnimatedNumber(countdownSecs, { duration: 0.8, ease: 'power2.out' });
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
        setCountdownSecs(0);
      } else {
        setCountdownSecs(totalSecs);
      }
    };

    updateCountdownTimer();
    const interval = setInterval(updateCountdownTimer, 1000);
    return () => clearInterval(interval);
  }, [calculatedTimes]);

  const formatCountdown = (secsValue: number) => {
    if (secsValue <= 0) return 'Active';
    const totalSecsInt = Math.round(secsValue);
    const hours = Math.floor(totalSecsInt / 3600);
    const mins = Math.floor((totalSecsInt % 3600) / 60);
    const secs = totalSecsInt % 60;

    let str = '';
    if (hours > 0) {
      str += `${hours}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
      str += `${mins}m ${secs}s`;
    } else {
      str += `${secs}s`;
    }
    return str;
  };

  const countdown = formatCountdown(animSecs);

  return {
    calculatedTimes,
    countdown,
    nextPrayerName,
    activePrayerName,
    parseSimulatedTime
  };
}
