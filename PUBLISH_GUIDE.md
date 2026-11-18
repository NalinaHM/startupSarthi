# 🚀 Publishing StartupSarthi (Web PWA + Google Play Store Android App)

Your app is now structured for **two-channel publishing** from one codebase:
1. **Free Live Web App & Installable PWA (Vercel)** — Anyone on Android, iPhone, or Desktop can open the link and tap **"Install App"** to add StartupSarthi to their home screen, with offline support for the Loan/Subsidy Calculator and Saved Plans!
2. **Android App (`.aab` / `.apk`) for Google Play Store (Capacitor)** — Wraps the exact same React app into a native Android project (`com.nalinahm.startupsarthi`).

---

## Part 1: Publish Live on Vercel (Free — 3 Minutes)

Because we added [`api/analyze.js`](./api/analyze.js), your `GEMINI_API_KEY` stays **100% hidden on the server** — never exposed to browser users!

1. Push your latest code to GitHub (`NalinaHM/startup-validator`).
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → Import `NalinaHM/startup-validator`.
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = your Google Gemini API key (from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
   - `VITE_GEMINI_MODEL` = `gemini-2.5-flash`
4. Click **Deploy**.
5. Once live (e.g., `https://startupsarthi.vercel.app`), open it on your Android phone in Chrome → tap **Install App**!

---

## Part 2: Build & Publish on Google Play Store (Android via Capacitor)

Once your Vercel URL is live (e.g. `https://startupsarthi.vercel.app`):

1. **Install Prerequisites**:
   - [Android Studio](https://developer.android.com/studio) (includes Android SDK & Gradle)
2. **Point your mobile build to your live Vercel API**:
   Add this line to `.env.production`:
   ```env
   VITE_API_BASE_URL=https://your-live-app.vercel.app
   ```
3. **Initialize & Sync Android Project**:
   ```bash
   npm run android:init
   npm run android:sync
   ```
4. **Open in Android Studio & Build Signed Release Bundle**:
   ```bash
   npm run android:open
   ```
   - In Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle (`.aab`)**.
   - Create a keystore (keep it safe!).
5. **Upload to Google Play Console**:
   - Create a developer account at [play.google.com/console](https://play.google.com/console) (one-time \$25 fee).
   - Upload your signed `.aab`, attach your icon (`public/icons/icon-512.png`), add screenshots, and submit for review!

> **Tip (Free Play Store Alternative)**: You can also share the built `.apk` directly, or use [PWABuilder.com](https://www.pwabuilder.com/) with your live Vercel URL to generate a Play Store Trusted Web Activity (TWA) `.aab` package in 2 minutes without even opening Android Studio!
