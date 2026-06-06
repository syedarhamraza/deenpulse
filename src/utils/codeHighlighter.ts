export const highlightCode = (code: string) => {
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
