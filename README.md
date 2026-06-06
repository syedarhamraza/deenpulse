# DeenPulse Showcase

[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-GNU_GPL_v3-green?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0.html)

A developer-focused landing showcase page for **DeenPulse**, the offline prayer companion and status tracker for Android and Wear OS. 

This web application simulates the application's native features, details battery limits workaround strategies, hosts an offline calculation simulator, explores the source code modules, and dynamically integrates with GitHub Release binaries.

---

## Key Showcase Sections

### 1. Interactive Bento Grid
* **Live Status Bar Capsule Simulator**: Test and preview the ongoing notification pill. Compatible with Android 16+ status bar chips and custom OEM skins like ColorOS and OxygenOS.
* **WearSync Bluetooth Terminal**: Simulates low-power synchronization broadcasts updating Circular Wear OS watch databases.
* **OEM Custom Styles Mappings**: Shows the alignment layout logic used to dodge background limits on strict skins (e.g., Category 2 for Vivo Funtouch OS ticker modifications).
* **Fetch & Kill Wakelock Chart**: Graphic representation of the 500ms coordinates check designed to replace battery-heavy constant GPS queries.

### 2. Astronomical Calculation Simulator
A fully interactive on-device calculations panel simulating how the offline engine translates inputs locally:
* **Coordinate Seeds**: Test with preset cities (Karachi, Mecca, London, Cairo, Jakarta, Dubai, New York).
* **Juristic Rule**: Toggle between standard shadow length rules (Maliki, Shafi'i, Hanbali) and double shadow length checks (Hanafi).
* **Preset Rules**: Supports major angle standards: Karachi (18°), ISNA (15°), MWL (18°), Egypt (19.5°), Makkah (18.5°), Jakarta (20°), and Dubai (16°).
* **Live Timetable Timeline**: A dynamic list displaying passed, active, and countdown-guided upcoming prayers.

### 3. Integrated IDE Code Browser
An editor container equipped with custom code syntax highlighting and line numbers for reviewing main modules:
* `PrayerCapsuleForegroundService.kt`: Kotlin service managing ongoing notifications.
* `WearDataSyncService.kt`: Bluetooth client communication logs using Google Wearable API.
* `usePrayerTimes.ts` & `usePrayerCountdown.ts`: Core calculation hooks.
* `prayerEngine.ts` & `deviceProfiles.ts`: Profile mappings and trigonometry formulas.

### 4. Technical Docs & Releases
* **Battery Restrictions Guide**: Documentation explaining background restrictions and white-listing guidelines.
* **Direct sideload links**: Real-time integration with GitHub releases to dynamically resolve sizes, checksums, and package links.

---

## Technology Stack

* **Core Structure**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Styling System**: [Tailwind CSS v4](https://tailwindcss.com/) (using native CSS themes)
* **Animation Engine**: [Motion](https://motion.dev/) (Framer Motion)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Build Engine**: [Vite](https://vite.dev/)

---

## Project Directory Layout

```
deenpulse/
├── dist/                # Optimized production assets
├── src/
│   ├── assets/          # SVG overlays, backdrop assets, and brand logos
│   ├── components/      # Modular showcase page segments
│   │   ├── Navbar.tsx      # Floating glass header (mobile drawer ready)
│   │   ├── Hero.tsx        # High-impact typography and mockups
│   │   ├── Features.tsx    # Interactive Bento grid card handlers
│   │   ├── Simulator.tsx   # Offline calculations playground
│   │   ├── CodeBrowser.tsx # Code snippet syntax highlight panel
│   │   ├── Docs.tsx        # Background limitation guides
│   │   ├── Downloads.tsx   # GitHub release binaries fetcher
│   │   ├── FAQ.tsx         # Toggle FAQ accordions
│   │   ├── Footer.tsx      # Credits and responsive links
│   │   └── DeviceFrames.tsx# Phone and Circular smartwatch styling structures
│   ├── constants/       # Predefined timetables, code contents, and seeds
│   ├── hooks/           # Countdown tracking & timing modules
│   ├── utils/           # Math libraries & search highlights
│   ├── App.tsx          # Master template wrapper and state hub
│   ├── index.css        # Theme variables, custom scrollbars, and fonts
│   └── main.tsx         # React mounting entry-point
├── index.html           # Main document template (SEO optimized)
├── package.json         # Project tasks and node package lists
└── tsconfig.json        # Type safety validation settings
```

---

## License & Credit

This project is open-source and licensed under the **GNU GPL v3 License**.

* Created by **[Syed Arham Raza](https://github.com/syedarhamraza)**.
