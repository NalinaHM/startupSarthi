# 🚀 Publishing StartupSarthi (Web PWA + Google Play Store Android App)

Your app is now structured for **two-channel publishing** from one codebase:
1. **Free Live Web App & Installable PWA (Vercel)** — Anyone on Android, iPhone, or Desktop can open the link and tap **"Install App"** to add StartupSarthi to their home screen, with offline support for the Loan/Subsidy Calculator and Saved Plans!
2. **Android App (`.aab` / `.apk`) for Google Play Store (Capacitor)** — Wraps the exact same React app into a native Android project (`com.nalinahm.startupsarthi`).

---

## Part 1: Publish Live on Vercel (Free — 3 Minutes)

Because we added [`api/analyze.js`](./api/analyze.js), your `GEMINI_API_KEY` stays **100% hidden on the server** — never exposed to browser users!

1. Push your latest code to GitHub (`NalinaHM/startupSarthi`).
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → Import `NalinaHM/startupSarthi`.
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = your Google Gemini API key (from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
   - `VITE_GEMINI_MODEL` = `gemini-2.5-flash`
4. Click **Deploy**.
5. Once live (e.g., `https://startupsarthi.vercel.app`), open it on your Android phone in Chrome → tap **Install App**!

---

## Part 2: Build & Publish on Google Play Store (Android App)

We have already configured your native Android app with:
- **App Name**: `StartupSarthi`
- **Package ID**: `com.nalinahm.startupsarthi`
- **Launcher Icons**: High-res StartupSarthi icons generated for all Android densities (MDPI to XXXHDPI).
- **Automated Cloud Build**: `.github/workflows/build-android.yml` automatically builds your Android APK on every GitHub push!

### Option A: Automatic Cloud Build via GitHub (No Android Studio Needed!)
1. As soon as you push this code to GitHub, go to your repository: `https://github.com/NalinaHM/startupSarthi/actions`.
2. Click on the **Build StartupSarthi Android APK** workflow.
3. Once completed (approx 3 minutes), scroll to **Artifacts** and download **`StartupSarthi-Android-APK`**!
4. Install this `.apk` directly on any Android phone to test the native app!

### Option B: Local Build via Android Studio (For Play Store .aab Release)
1. **Install [Android Studio](https://developer.android.com/studio)**.
2. Open the project in Android Studio:
   ```bash
   npm run android:open
   ```
3. In Android Studio:
   - Click **Build → Generate Signed Bundle / APK**.
   - Choose **Android App Bundle (`.aab`)** (required by Google Play Store).
   - Create or choose your keystore file.
   - Click **Create Release Bundle**.
4. **Publish to Google Play Store**:
   - Open [Google Play Console](https://play.google.com/console).
   - Create an app listing for **StartupSarthi**.
   - Upload the `.aab` file from `android/app/release/`.
   - Add your icon from `public/icons/icon-512.png`, app description, and submit for review!

---

> **Tip (Instant Play Store Alternative via PWABuilder)**:
> Once your Vercel URL is live (e.g. `https://startupsarthi.vercel.app`), you can also go to [PWABuilder.com](https://www.pwabuilder.com/), enter your URL, and click **Package for Android (Google Play Store)** to generate a signed Google Play `.aab` package online in 2 minutes!
