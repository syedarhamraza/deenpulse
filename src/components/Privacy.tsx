import { Shield, Lock, EyeOff, FileText, Cpu, Globe } from 'lucide-react';
import { PremiumButton } from './ui/PremiumButton';

export function PrivacyAgreement() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16 relative z-10 min-h-screen">

      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white tracking-tight leading-tight">
          Privacy <span className="bg-gradient-to-r from-[#00F29D] to-[#3DD1C4] bg-clip-text text-transparent">Agreement</span>
        </h1>
        <p className="text-slate-400 mt-3 max-w-2xl text-base md:text-lg">
          DeenPulse is committed to absolute data privacy. Read our transparent policies on local execution and data sovereignty.
        </p>
        <p className="text-xs text-slate-500 font-mono mt-2">
          Last updated: June 6, 2026
        </p>
      </div>

      {/* Content Container */}
      <div className="bg-[#060a0a]/40 backdrop-blur-md border border-white/[0.05] rounded-2xl p-6 md:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.4)] space-y-8">

        {/* Intro */}
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-[#00F29D]/10 flex items-center justify-center text-[#00F29D] shrink-0">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sovereignty Over Your Personal Data</h2>
            <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
              Unlike mainstream utility apps, DeenPulse does not require user accounts, email sign-ups, or social logins. We do not transmit coordinates, prayer schedules, or usage metrics to external servers. Your religious schedule and daily habits are entirely private to you.
            </p>
          </div>
        </div>

        <div className="h-px bg-white/[0.05]" />

        {/* Section 1: Location Data */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#3DD1C4]" />
            1. Geolocation and Location Calculation
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            DeenPulse requests the device's Location permission solely to compute the local sunrise, sunset, and prayer times according to astronomical calculations.
          </p>
          <div className="bg-[#0c1212]/50 border border-white/[0.04] p-4.5 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00F29D] uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-[#00F29D]" />
              On-Device Calculation Loop
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              When location updates are requested, the device executes a low-power GPS triangulation cycle. Once latitude and longitude coordinates are obtained, they are saved locally in the app's sandboxed storage (<code className="text-slate-300 font-mono text-[11px] bg-white/5 px-1 py-0.5 rounded">SharedPreferences</code>) and used directly for local mathematical equations. They are never transmitted over HTTP/HTTPS connections.
            </p>
          </div>
        </div>

        {/* Section 2: Zero Trackers */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <EyeOff className="w-5 h-5 text-[#3DD1C4]" />
            2. Ad and Tracker Free Policy
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            DeenPulse contains:
          </p>
          <ul className="text-slate-400 text-xs md:text-sm list-disc pl-5 space-y-1.5 leading-relaxed">
            <li><strong className="text-white">Zero Advertising</strong>: No third-party ad networks (like AdMob or Unity Ads) are integrated. There are no tracking scripts running in the background.</li>
            <li><strong className="text-white">Zero Telemetry/Analytics</strong>: No crash reports, usage metrics, or screen tracking analytics (like Firebase Analytics or Mixpanel) are loaded. Your navigation path remains isolated on your device.</li>
            <li><strong className="text-white">No Push-Notification Tracking</strong>: Prayer alerts are scheduled via local alarms (<code className="text-slate-300 font-mono text-[11px] bg-white/5 px-1 py-0.5 rounded">AlarmManager</code>), bypassing remote Firebase Cloud Messages (FCM) tracking channels.</li>
          </ul>
        </div>

        {/* Section 3: Wear OS Companion */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#3DD1C4]" />
            3. Smartwatch Companion Synchronization
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            The Wear OS watch companion synchronizes data locally from your phone using Google's Google Play Services Wearable APIs.
          </p>
          <ul className="text-slate-400 text-xs md:text-sm list-disc pl-5 space-y-1.5 leading-relaxed">
            <li>Coordinate updates are sent via the local Bluetooth/Wi-Fi Google Wearable Data Layer.</li>
            <li>No watch complications or active tile updates send telemetry reports to external servers.</li>
          </ul>
        </div>

        {/* Section 4: GNU GPL License */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#3DD1C4]" />
            4. Licensing and Source Code Verification
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            As open-source software licensed under the <strong className="text-white">GNU GPL v3 License</strong>, you can fully audit the security and data-handling features of DeenPulse by checking our public repository:
          </p>
          <PremiumButton
            variant="primary"
            href="https://github.com/syedarhamraza/deen-pulse"
            target="_blank"
            rel="noreferrer"
            icon="github"
            size="sm"
            className="inline-block uppercase tracking-wider"
          >
            Verify Source Code on GitHub
          </PremiumButton>
        </div>

      </div>

    </div>
  );
}
