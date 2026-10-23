# Android APK Build & Installation Guide
## QC Defect Rate Calculator

This application can be packaged into a standalone Android APK file (`.apk`) using several simple methods:

---

### Option 1: Instant Standalone APK via PWABuilder (Fastest — 1 Minute)

Google and Microsoft provide [PWABuilder](https://www.pwabuilder.com/) to automatically generate signed Android APK packages from web apps.

1. Open **[PWABuilder.com](https://www.pwabuilder.com/)** in your browser.
2. Enter your live app URL:
   ```
   https://ais-dev-oyy3chc2zdazyv4cjbozxv-974758255987.asia-southeast1.run.app
   ```
3. Click **Start**. PWABuilder verifies the manifest and service worker.
4. Click **Package for Android**.
5. Select **Generate APK / Android Package**.
6. Download the resulting `.apk` or `.aab` file directly to your computer or phone!

---

### Option 2: Direct Android Installation (WebAPK — No Compilation Needed)

On Android devices (using Google Chrome, Samsung Internet, or Brave):
1. Open the app URL on your Android device.
2. Tap the **"APK / Android App"** button in the app header, or tap the browser's menu (⋮).
3. Select **"Install app"** or **"Add to Home screen"**.
4. Android automatically generates a real **WebAPK** on the phone, creating a native app launcher icon in your app drawer with standalone windowing and full offline capability.

---

### Option 3: Build Standalone APK with Capacitor & Android Studio

To compile a native debug `.apk` file using Android Studio:

```bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor project
npx cap init "QC Defect Calculator" "com.qc.defectcalc" --web-dir dist

# 3. Build production web assets
npm run build

# 4. Add the Android native platform
npx cap add android

# 5. Open in Android Studio and build APK
npx cap open android
```

In Android Studio:
- Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
- The compiled `.apk` will be in `android/app/build/outputs/apk/debug/app-debug.apk`.

---

### Option 4: Build APK via Google Bubblewrap CLI (TWA)

Google's official CLI tool for packaging PWAs into Android APKs:

```bash
# Install Bubblewrap CLI
npm install -g @bubblewrap/cli

# Initialize and generate Android project
bubblewrap init --manifest="https://ais-dev-oyy3chc2zdazyv4cjbozxv-974758255987.asia-southeast1.run.app/manifest.json"

# Build signed APK
bubblewrap build
```

This generates `app-release-signed.apk` ready for sideloading or Google Play deployment.
