import { useState, useEffect } from 'react';
import { ReleaseInfo } from '../types';

export function useLatestRelease() {
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo>({
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

  return releaseInfo;
}
