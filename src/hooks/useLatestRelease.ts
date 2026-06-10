import { useState, useEffect } from 'react';
import { ReleaseInfo, GitHubRelease } from '../types';

function parseGithubRelease(release: any): GitHubRelease {
  const version = `v${(release.tag_name || '').replace(/^v/, '')}`;
  const publishedAt = release.published_at ? new Date(release.published_at).toLocaleDateString() : null;
  const body = release.body || null;
  
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

  return {
    version,
    publishedAt,
    body,
    mobileUrl: mobileAsset?.browser_download_url || `https://github.com/syedarhamraza/deen-pulse/releases/download/${version}/${mobileAsset?.name || 'DeenPulse-Phone-v2.0.3.apk'}`,
    mobileSize: mobileAsset?.size ? `${(mobileAsset.size / (1024 * 1024)).toFixed(1)} MB` : null,
    mobileName: mobileAsset?.name || 'DeenPulse-Phone-v2.0.3.apk',
    watchUrl: watchAsset?.browser_download_url || `https://github.com/syedarhamraza/deen-pulse/releases/download/${version}/${watchAsset?.name || 'DeenPulse-WearOS-v2.0.3.apk'}`,
    watchSize: watchAsset?.size ? `${(watchAsset.size / (1024 * 1024)).toFixed(1)} MB` : null,
    watchName: watchAsset?.name || 'DeenPulse-WearOS-v2.0.3.apk',
  };
}

export function useLatestRelease() {
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo>({
    version: null,
    publishedAt: null,
    mobileUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
    mobileSize: null,
    mobileName: 'DeenPulse-Phone-v2.0.3.apk',
    watchUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
    watchSize: null,
    watchName: 'DeenPulse-WearOS-v2.0.3.apk',
    loading: true,
    error: false,
    body: null,
    releases: [],
  });

  useEffect(() => {
    const fetchReleases = async () => {
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
        // Correct cached repo name if cached under old name
        const hasOldFormat = cachedData.mobileUrl && cachedData.mobileUrl.includes('deenpulse');
        if (!hasOldFormat) {
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
            body: cachedData.body || null,
            releases: cachedData.releases || [],
          }));

          // If the cache is still fresh, bypass network request completely
          if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
            return;
          }
        }
      }

      try {
        const res = await fetch('https://api.github.com/repos/syedarhamraza/deen-pulse/releases', {
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
            mobileName: 'DeenPulse-Phone-v2.0.3.apk',
            watchUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
            watchSize: null,
            watchName: 'DeenPulse-WearOS-v2.0.3.apk',
            loading: false,
            error: true,
            releases: [],
          });
          return;
        }
        
        const releasesData = await res.json();
        const parsedReleases = Array.isArray(releasesData) ? releasesData.map(parseGithubRelease) : [];
        
        if (parsedReleases.length === 0) {
          throw new Error('No releases found');
        }
        
        const latest = parsedReleases[0];
        const freshDetails: ReleaseInfo = {
          version: latest.version,
          publishedAt: latest.publishedAt,
          mobileUrl: latest.mobileUrl,
          mobileSize: latest.mobileSize,
          mobileName: latest.mobileName,
          watchUrl: latest.watchUrl,
          watchSize: latest.watchSize,
          watchName: latest.watchName,
          body: latest.body,
          loading: false,
          error: false,
          releases: parsedReleases,
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
          mobileName: 'DeenPulse-Phone-v2.0.3.apk',
          watchUrl: 'https://github.com/syedarhamraza/deen-pulse/releases/latest',
          watchSize: null,
          watchName: 'DeenPulse-WearOS-v2.0.3.apk',
          loading: false,
          error: true,
          releases: [],
        });
      }
    };
    fetchReleases();
  }, []);

  return releaseInfo;
}
