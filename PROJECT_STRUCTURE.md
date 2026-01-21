# Skin Saviour - Complete Project Structure

## Overview
AI-powered mobile application for skin condition detection using CNN-based deep learning.

## Project Structure

```
SkinSaviour/
├── app.py                          # Flask backend API
├── requirements.txt                 # Python dependencies
├── README.md                       # Main documentation
├── RUN_INSTRUCTIONS.md            # How to run the application
├── PROJECT_STRUCTURE.md            # This file
│
├── model/                          # CNN Model
│   ├── __init__.py
│   ├── train_model.py              # Model training script (3-class classification)
│   ├── model_utils.py              # Model loading and prediction utilities
│   └── skin_cancer_model.h5        # Trained model file (generated)
│
├── utils/                          # Utility functions
│   ├── __init__.py
│   └── image_validation.py         # Image quality validation (blur, lighting, resolution)
│
├── mobile_app/                     # Flutter Mobile Application
│   ├── pubspec.yaml                # Flutter dependencies
│   ├── README.md                   # Mobile app setup instructions
│   │
│   ├── lib/
│   │   ├── main.dart               # App entry point
│   │   │
│   │   ├── screens/                # UI Screens
│   │   │   ├── home_screen.dart
│   │   │   ├── scan_screen.dart
│   │   │   ├── result_screen.dart
│   │   │   ├── nearby_doctors_screen.dart
│   │   │   ├── consultation_screen.dart
│   │   │   └── medication_guidance_screen.dart
│   │   │
│   │   ├── providers/              # State Management
│   │   │   ├── prediction_provider.dart
│   │   │   └── location_provider.dart
│   │   │
│   │   └── services/               # API Services
│   │       └── api_service.dart
│   │
│   ├── android/                    # Android configuration
│   │   └── app/src/main/
│   │       └── AndroidManifest.xml
│   │
│   └── ios/                        # iOS configuration
│       └── Runner/
│           └── Info.plist
│
├── templates/                      # Web templates (legacy)
├── static/                         # Web static files (legacy)
├── uploads/                        # Temporary image uploads
└── users.json                      # User storage (demo)

```

## Key Features

### 1. CNN Model (3-Class Classification)
- **Classes**: Normal Skin, Pimples/Acne, Skin Cancer
- **Architecture**: MobileNetV2/EfficientNet transfer learning
- **Input**: 224×224 RGB images
- **Output**: Softmax probabilities for 3 classes

### 2. Backend API (Flask)
- `/api/predict` - Image prediction endpoint
- `/api/validate` - Image quality validation
- `/api/medical-info` - Medical information by condition
- `/api/nearby-doctors` - GPS-based doctor location
- `/api/medication-guidance` - OTC medication suggestions

### 3. Mobile App (Flutter)
- Image upload (camera/gallery)
- Real-time prediction display
- GPS-based nearby doctors map
- Medical information display
- Medication guidance (informational)
- Online consultation module

## Technology Stack

### Backend
- Python 3.8+
- Flask 3.0.0
- TensorFlow 2.15.0
- OpenCV 4.8.1
- NumPy, Pillow

### Mobile
- Flutter 3.0+
- Provider (state management)
- HTTP (API calls)
- Image Picker (camera/gallery)
- Geolocator (GPS)
- Google Maps Flutter

## Data Structure

### Training Data Organization
```
data/
├── normal/
│   ├── image1.jpg
│   └── ...
├── pimples/
│   ├── image1.jpg
│   └── ...
└── skin_cancer/
    ├── image1.jpg
    └── ...
```

## API Endpoints

### Prediction
- **POST** `/api/predict`
  - Request: Multipart form with `image` file
  - Response: Prediction result with condition, confidence, risk level

### Validation
- **POST** `/api/validate`
  - Request: Multipart form with `image` file
  - Response: Image quality validation results

### Medical Information
- **GET** `/api/medical-info?condition={condition}`
  - Conditions: `normal`, `pimples`, `skin_cancer`
  - Response: Educational information

### Nearby Doctors
- **GET** `/api/nearby-doctors?lat={lat}&lng={lng}&radius={radius}`
  - Response: List of nearby dermatologists with locations

### Medication Guidance
- **GET** `/api/medication-guidance?condition={condition}`
  - Response: OTC medication suggestions (informational only)

## Setup Instructions

### Backend Setup
1. Install Python dependencies: `pip install -r requirements.txt`
2. Train model (optional): `python model/train_model.py`
3. Run Flask server: `python app.py`

### Mobile App Setup
1. Install Flutter SDK
2. Navigate to `mobile_app/`
3. Install dependencies: `flutter pub get`
4. Update API URL in `lib/services/api_service.dart`
5. Add Google Maps API key (Android/iOS)
6. Run: `flutter run`

## Important Notes

- **Medical Disclaimer**: All predictions are AI-based preliminary analysis, not medical diagnosis
- **Medication Guidance**: Informational only, always consult a certified doctor
- **Model Training**: Requires proper medical dataset (ISIC, HAM10000, etc.)
- **Google Maps**: Requires API key from Google Cloud Console
- **Location Services**: Must be enabled for nearby doctors feature

## Development Notes

- Model uses transfer learning for efficient training
- Image preprocessing: Resize to 224×224, normalize to [0,1]
- Data augmentation: Rotation, zoom, horizontal flip
- Multi-class classification with softmax output
- Real-time GPS tracking for doctor locations
- Clean, commented, beginner-friendly code


