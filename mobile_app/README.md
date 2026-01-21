# Skin Saviour Mobile App

Flutter mobile application for AI-powered skin condition detection.

## Features

- 📸 Image upload from camera or gallery
- 🤖 AI-based skin condition classification (3 classes)
- 📍 GPS-based nearby doctor location
- 💊 Medication guidance (informational only)
- 🩺 Online consultation module
- 📊 Medical information display

## Setup Instructions

### Prerequisites

1. Install Flutter SDK (3.0.0 or higher)
2. Install Android Studio / Xcode for mobile development
3. Ensure your Flask backend is running

### Installation

1. Navigate to the mobile_app directory:
```bash
cd mobile_app
```

2. Install dependencies:
```bash
flutter pub get
```

3. Update API URL in `lib/services/api_service.dart`:
   - For Android Emulator: `http://10.0.2.2:5000/api`
   - For iOS Simulator: `http://localhost:5000/api`
   - For Physical Device: `http://YOUR_COMPUTER_IP:5000/api`

4. Run the app:
```bash
flutter run
```

## Android Setup

1. Add permissions in `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

2. For Google Maps, add your API key in `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
```

## iOS Setup

1. Add permissions in `ios/Runner/Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to find nearby doctors</string>
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos of skin conditions</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select images</string>
```

2. For Google Maps, add your API key in `ios/Runner/AppDelegate.swift`

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── screens/                  # UI screens
│   ├── home_screen.dart
│   ├── scan_screen.dart
│   ├── result_screen.dart
│   ├── nearby_doctors_screen.dart
│   ├── consultation_screen.dart
│   └── medication_guidance_screen.dart
├── providers/                # State management
│   ├── prediction_provider.dart
│   └── location_provider.dart
└── services/                 # API services
    └── api_service.dart
```

## Notes

- The app requires an active internet connection to communicate with the Flask backend
- Location services must be enabled for nearby doctor features
- Camera/gallery permissions are required for image upload
- Google Maps API key is required for map functionality (get one from Google Cloud Console)


