# Trading Dashboard

A real-time cryptocurrency trading dashboard built with React Native. This app connects to Binance's WebSocket streams to display live price updates with high-performance animations and 60 FPS scrolling.

## Architecture Highlights
- **Real-Time Data Layer**: Uses `WebSocketService` to manage raw Binance payloads, handle exponential backoff reconnections, and batch updates to prevent UI thread thrashing.
- **Global Store**: Zustand is used for fast `O(1)` memory lookups of trading pairs.
- **UI & Performance**: Powered by `@shopify/flash-list` for optimal large-list rendering, and `react-native-reanimated` for smooth UI-thread Native animations on price changes.

---

## 🛠 Prerequisites & Environment Setup

This project uses the **React Native CLI** (not Expo) and requires a properly configured macOS environment for both iOS and Android build systems.

### 1. General Requirements
- **Node.js** (v18+)
- **npm** or **Yarn**
- **Watchman** (`brew install watchman`)

### 2. iOS Development Setup
To run the app on an iPhone or iOS Simulator:
1. Install **Xcode** from the Mac App Store.
2. Install **CocoaPods** to manage Objective-C/Swift dependencies:
   ```bash
   sudo gem install cocoapods
   ```

### 3. Android Development Setup
React Native requires **Java 17** and the **Android SDK** to compile the Android app. 

#### Step 1: Install Java 17
Do not use Java 11. The Gradle build requires JDK 17.
```bash
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Step 2: Install Android Studio
1. Download and install [Android Studio](https://developer.android.com/studio).
2. Follow the setup wizard to install the **Android SDK**, **Android SDK Platform**, and an **Android Virtual Device** (emulator).
3. Ensure Android 14/15 (API level 34 or 35) is installed in the SDK Manager.

#### Step 3: Configure Environment Variables
Tell your shell where the Android SDK is located. Add these lines to your `~/.zshrc` or `~/.bash_profile`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
Then run `source ~/.zshrc`.

---

## 🚀 Running the App

### 1. Install Dependencies
Clone the repository and install the Node modules:
```bash
npm install
```

### 2. Install iOS Pods
Navigate to the `ios` directory and install the native pods:
```bash
cd ios
pod install
cd ..
```

### 3. Start the Metro Bundler
Start the React Native package manager in a separate terminal window:
```bash
npm start
```

### 4. Run on iOS
```bash
npm run ios
```
*Note: You can specify a device by adding `--device='iPhone 15 Pro'`.*

### 5. Run on Android
*Make sure you have an Android emulator running first (opened via Android Studio's Virtual Device Manager).*
```bash
npm run android
```

---

## Troubleshooting

- **`pod: command not found`**: You need to install CocoaPods (`sudo gem install cocoapods`).
- **`Gradle requires JVM 17 or later`**: Your system is defaulting to an older version of Java. Follow the Java 17 Homebrew installation steps above and ensure your `PATH` is updated.
- **`adb: command not found` / `SDK location not found`**: Your `ANDROID_HOME` environment variables are not set properly in your `.zshrc` file, or Android Studio is not installed.
