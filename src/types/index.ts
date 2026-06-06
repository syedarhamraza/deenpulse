export type Location = 'Mecca' | 'Karachi' | 'London' | 'New York' | 'Cairo' | 'Jakarta' | 'Dubai';
export type JuristicMethod = 'Standard' | 'Hanafi';
export type CalcMethod = 'Karachi' | 'ISNA' | 'MWL' | 'Egypt' | 'Makkah' | 'Jakarta' | 'Dubai';

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface ReleaseInfo {
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
}

export interface FileContent {
  desc: string;
  code: string;
  lang: string;
}
