# Webliox 📱
> "Turn Any Website Into an App."

Webliox is a lightweight, high-performance personal web-app ecosystem. It serves as a modular WebHub Launcher designed to eliminate device bloat, storage clutter, and background battery drain by running favorite web services inside a beautifully optimized, native Android WebView sandbox environment.

---

## 🛠️ First-Time Installation (Fresh Clone Setup)

If you are a new developer or just freshly cloned this repository from Git, follow these commands in order using your VS Code terminal to initialize the environment:

### 1. Install Base Dependencies
Download the standard project modules and core structure:
```bash
npm install
```

### 2. Install Mobile Wrapper Packages
Explicitly secure the necessary Capacitor core and native Android plugins:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/browser --save
```

### 3. Initialize App Configuration Profiles
Generate the foundational deployment blueprints linking the web directory to the mobile container:
```bash
npx cap init Webliox com.webliox.app --web-dir=dist
```

### 4. Create the Production Build
Compile your TypeScript and React source files into optimized static web layers:
```bash
npm run build
```

### 5. Generate the Android Environment Folder
Inject the core native Android shell components:
```bash
npx cap add android
```

### 6. Synchronize Configuration Assets
Push the freshly generated build data cleanly into your Android framework files:
```bash
npx cap sync android
```

---

## 🚀 Everyday Developer Workflow (Applying Project Changes)

Use this rapid 4-step workflow whenever you make UI updates or code modifications inside VS Code and want to push them to your physical testing device:

### 1. Pull Latest Changes (If collaborating)
```bash
git pull
```

### 2. Recompile Source Code
Build your updated React changes into fresh production-ready assets:
```bash
npm run build
```

### 3. Synchronize Web Assets with Android Native
Push the newly generated web build straight into your underlying Android folder structure:
```bash
npx cap sync android
```

### 4. Launch Android Studio Containers
Boot up your native workspace environment to compile the package:
```bash
npx cap open android
```

---

## 📦 How to Generate Your Final APK File

Once Android Studio automatically opens up via your terminal commands:

1. **Await Gradle Sync**: Look at the bottom status bar and wait roughly 1-3 minutes until **"Gradle Sync Syncing..."** and indexing complete fully. Do not click anything until the loading bars disappear.
2. **Compile Package**: Go to the top application menu bar and navigate to:
   `Build` ➔ `Build Bundle(s) / APK(s)` ➔ **`Build APK(s)`**.
3. **Locate APK**: Wait 30-60 seconds for the compilation script to finish. Click the blue **"Locate"** link inside the success bubble notification pop-up at the bottom-right corner.
4. **Deploy**: Copy the generated **`app-debug.apk`** file from the Windows File Explorer window and send it directly to your target mobile device to install and test!
