# Android APK Build Guide

This guide covers the **best ways** to generate APK files for your React Native Expo project.

## 🏆 Method 1: EAS Build (Recommended - Best for Expo)

**Why it's best:**
- ✅ Cloud-based (no local Android SDK setup needed)
- ✅ Handles code signing automatically
- ✅ Supports multiple build profiles
- ✅ Official Expo solution
- ✅ Free tier available

### Setup Steps:

1. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure EAS (already done - eas.json exists):**
   The `eas.json` file has been created with three profiles:
   - `development` - For development builds
   - `preview` - For testing/internal distribution (APK)
   - `production` - For production release (APK)

4. **Build APK:**
   ```bash
   # For preview/testing (APK)
   npm run build:eas:preview
   # OR
   eas build --platform android --profile preview

   # For production (APK)
   npm run build:eas:production
   # OR
   eas build --platform android --profile production
   ```

5. **Download APK:**
   - After build completes, EAS will provide a download link
   - Or use: `eas build:list` to see all builds

**Note:** First build may take 10-15 minutes. Subsequent builds are faster.

---

## 🔧 Method 2: Local Gradle Build (Fast for Development)

**Why use it:**
- ✅ Fast for local testing
- ✅ No internet required after setup
- ✅ Full control over build process
- ⚠️ Requires Android SDK setup

### Prerequisites:
- Android Studio installed
- Android SDK configured
- JAVA_HOME environment variable set
- `ANDROID_HOME` environment variable set

### Build Steps:

1. **Debug APK (for testing):**
   ```bash
   npm run build:android:debug
   # APK location: android/app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Release APK (for distribution):**
   ```bash
   npm run build:android:local
   # APK location: android/app/build/outputs/apk/release/app-release.apk
   ```

3. **AAB (Android App Bundle - for Play Store):**
   ```bash
   npm run build:android:bundle
   # AAB location: android/app/build/outputs/bundle/release/app-release.aab
   ```

### Important Notes:
- **Release APK is signed with debug keystore** (not for production)
- For production, you need to create a proper keystore (see Method 3)

---

## 🔐 Method 3: Local Build with Production Signing

**For production-ready APKs with proper signing:**

### Step 1: Generate Keystore

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Create `android/keystore.properties`

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

### Step 3: Update `android/app/build.gradle`

Add signing config:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['MYAPP_RELEASE_STORE_FILE'])
                storePassword keystoreProperties['MYAPP_RELEASE_KEY_PASSWORD']
                keyAlias keystoreProperties['MYAPP_RELEASE_KEY_ALIAS']
                keyPassword keystoreProperties['MYAPP_RELEASE_KEY_PASSWORD']
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ... rest of config
        }
    }
}
```

### Step 4: Build

```bash
npm run build:android:local
```

---

## 📊 Comparison Table

| Method | Speed | Setup Complexity | Best For |
|--------|-------|------------------|----------|
| **EAS Build** | Medium (10-15 min first time) | Easy | Production, CI/CD |
| **Local Gradle (Debug)** | Fast (2-5 min) | Medium | Quick testing |
| **Local Gradle (Release)** | Fast (2-5 min) | Medium | Local production builds |

---

## 🚀 Quick Start (Recommended)

For most users, start with **EAS Build**:

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Build preview APK
npm run build:eas:preview

# 4. Download when ready
```

---

## 📝 Additional Notes

- **APK vs AAB**: APK is for direct installation, AAB is for Google Play Store
- **Debug vs Release**: Debug includes debugging symbols, Release is optimized
- **Keystore**: Keep your production keystore safe! You'll need it for updates
- **Version Code**: Update `versionCode` in `android/app/build.gradle` for each release

---

## 🆘 Troubleshooting

### EAS Build Issues:
- Check Expo account is logged in: `eas whoami`
- Verify `eas.json` configuration
- Check build logs: `eas build:list`

### Local Build Issues:
- Ensure Android SDK is installed: `echo $ANDROID_HOME`
- Check Java version: `java -version` (should be 17+)
- Clean build: `cd android && ./gradlew clean`

---

## 📚 Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Android App Signing](https://reactnative.dev/docs/signed-apk-android)
- [Gradle Build Guide](https://developer.android.com/studio/build)

