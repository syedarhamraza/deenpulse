# DeenPulse Web Showcase

A premium, developer-focused showcase landing page for **DeenPulse**, the prayer companion for Android and Wear OS. 

This repository contains the web application demonstrating the app's native layout, bento-grid feature highlights, an offline calculation simulator, a local codebase explorer, and a dynamic GitHub Release sideload pipeline.

---

## Key Features

* **Dynamic Update Integration**: Fetches the latest stable releases directly from the GitHub repository (`syedarhamraza/deen-pulse`), resolving download links, publish dates, and calculating file sizes dynamically in Megabytes (MB).
* **Rate-Limit & Offline Safety Cache**: Implements a client-side `localStorage` cache for API responses (4-hour expiration) to prevent unauthenticated GitHub API rate-limiting and guarantee instant page loading.
* **Interactive Bento Matrix**:
  * *Live Status Bar Capsule Simulator*: Demonstrates the ticking countdown pill compatible with AOSP Android 16+ status bar chips and custom OEM skins.
  * *WearSync Bluetooth Terminal Console*: Simulates Bluetooth DataLayer sync broadcasts pushing prayer databases to circular Wear OS smartwatches.
  * *OEM Battery Profiler*: Visualizes vendor battery restriction tiers (Category 1/2/3) and custom foreground alarms logic.
  * *Fetch & Kill Triangulation Chart*: Compares DeenPulse's 500ms low-power cell-tower GPS queries with continuous GPS tracking drain models.
* **Telemetry Simulator Hub**: An offline calculations panel allowing users to test seed coordinates (Karachi, Mecca, London, Cairo, etc.), Asr shadow juristic methods (Standard/Hanafi), and calculation angle presets.
* **IDE Code Explorer**: A dark-theme code browser with line numbers and custom regex-based syntax highlighting, showcasing actual Kotlin background services and TypeScript hook logic.
* **Responsive Visuals**: A floating glassmorphic navigation bar, subtle neon mesh overlays, and absolute background assets constrained dynamically to prevent horizontal scroll shift.

---

## Technology Stack

* **Framework**: React 19 + TypeScript
* **Styling**: Tailwind CSS v4 (Vanilla theme variables)
* **Animations**: Motion (formerly Framer Motion)
* **Iconography**: Lucide React
* **Build Pipeline**: Vite + PostCSS

---

## Local Development

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)

### Setup & Run
1. **Clone & Enter Workspace**:
   ```bash
   cd deenpulse
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *The showcase will run on `http://localhost:3001` (or next available port).*

4. **Compile Production Bundle**:
   ```bash
   npm run build
   ```
   *Generates fully optimized, hashed index HTML and asset chunks inside the `dist/` directory.*

---

## Project Structure

```
deenpulse/
├── dist/                # Production build targets
├── src/
│   ├── assets/          # Brand icon, backdrops, and device mockups
│   ├── App.tsx          # Main showcase component and calculators
│   ├── main.tsx         # React root mounting node
│   ├── index.css        # Font imports and global scroll overrides
│   └── vite-env.d.ts    # TypeScript environment references
├── index.html           # Document template with SEO meta tags
├── package.json         # Scripts and dependencies
└── tsconfig.json        # TypeScript compiler options
```

---

## License

This project is open-source and available under the **GNU GPL v3 License**. Created by [Syed Arham Raza](https://github.com/syedarhamraza).
