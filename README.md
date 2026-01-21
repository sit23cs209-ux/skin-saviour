# 🔬 Skin Saviour - AI-Powered Skin Condition Detection

A CNN-based mobile application for intelligent skin condition analysis using deep learning. Classifies skin images into three categories: **Skin Cancer**, **Pimples/Acne**, and **Normal Skin**.

## 📋 Overview

Skin Saviour uses a Convolutional Neural Network (CNN) with MobileNetV2/EfficientNet transfer learning to classify skin condition images. The application provides:

- **Multi-class Classification**: 3 classes (Skin Cancer, Pimples/Acne, Normal Skin)
- Image quality validation (blur, lighting, resolution)
- AI-powered intelligent detection based on lesion features
- GPS-based nearby doctor location tracking
- Medical information and educational content
- Medication guidance (informational only)
- Online consultation module
- Flutter mobile app with modern UI

## 🎓 One-Line Explanation for Viva

> The system uses a CNN-based multi-class classification model to intelligently analyze uploaded skin images and predict the correct skin condition (Skin Cancer, Pimples/Acne, or Normal Skin) based on lesion shape, color, texture, and borders - without hard-coding or default results.

## 🏗️ Architecture

### CNN Model
- **Base Architecture**: MobileNetV2 / EfficientNet (Transfer Learning)
- **Classification**: Multi-class (3 classes: Normal, Pimples, Skin Cancer)
- **Input Size**: 224×224 pixels (RGB)
- **Output**: Softmax activation (3-class probabilities)
- **Features Analyzed**: Lesion shape, color, texture, borders

### Components
1. **Model Training** (`model/train_model.py`): CNN training script for 3-class classification
2. **Model Utils** (`model/model_utils.py`): Model loading and prediction utilities
3. **Image Validation** (`utils/image_validation.py`): Quality checks (blur, lighting, resolution)
4. **Backend API** (`app.py`): Flask REST API with doctor location and consultation endpoints
5. **Mobile App** (`mobile_app/`): Flutter mobile application
   - Image upload (camera/gallery)
   - Prediction display
   - GPS-based doctor location
   - Medical information
   - Medication guidance
   - Online consultation

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Prepare Training Data (Optional)

If you have a dataset, organize it as follows for 3-class classification:

```
data/
├── normal/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── pimples/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
└── skin_cancer/
    ├── image1.jpg
    ├── image2.jpg
    └── ...
```

**Recommended Datasets:**
- ISIC (International Skin Imaging Collaboration)
- HAM10000
- Acne datasets from medical repositories

### Step 3: Train the Model (Optional)

If you have training data:

```bash
python model/train_model.py
```

This will create `model/skin_cancer_model.h5`.

**Note**: If no training data is available, the application will create a sample model structure. For production use, train with a proper medical dataset.

### Step 4: Run the Application

```bash
python app.py
```

The application will be available at: `http://localhost:5000`

## 📱 Usage

### Backend API
1. **Start the Flask server**: `python app.py`
2. **API will be available** at: `http://localhost:5000`

### Mobile App
1. **Navigate to mobile app**: `cd mobile_app`
2. **Install dependencies**: `flutter pub get`
3. **Update API URL** in `lib/services/api_service.dart`
4. **Run the app**: `flutter run`
5. **Upload image** from camera or gallery
6. **View prediction results** with medical information
7. **Find nearby doctors** using GPS location
8. **Access medication guidance** (informational only)

## 🔍 Features

### Image Validation
- **Blur Detection**: Uses Laplacian variance
- **Brightness Check**: Ensures adequate lighting
- **Resolution Check**: Validates minimum image size
- **File Type Validation**: Supports PNG, JPG, JPEG, GIF, BMP

### CNN Detection (3-Class Classification)
- **Preprocessing**: Resize to 224×224, normalize to [0,1]
- **Multi-class Classification**: Softmax output for 3 classes
- **Classes**: Normal Skin, Pimples/Acne, Skin Cancer
- **Intelligent Analysis**: Analyzes lesion shape, color, texture, borders
- **Confidence Scoring**: Probability for each class
- **Risk Assessment**: High (Cancer), Medium (Pimples), Low (Normal)

### User Interface
- Modern, responsive design
- Drag-and-drop image upload
- Real-time image preview
- Loading indicators
- Clear result visualization

## 📊 API Endpoints

### `GET /`
Serves the main web interface.

### `GET /api/health`
Health check endpoint.

### `POST /api/predict`
Predicts skin cancer from uploaded image.

**Request:**
- Form data with `image` file

**Response:**
```json
{
  "success": true,
  "prediction": {
    "condition": "Skin Cancer",
    "predicted_class": "skin_cancer",
    "confidence": 91.5,
    "risk_level": "High",
    "probabilities": {
      "normal": 2.3,
      "pimples": 6.2,
      "skin_cancer": 91.5
    },
    "disclaimer": "This is an AI-based preliminary analysis and not a medical diagnosis."
  }
}
```

### `POST /api/validate`
Validates image quality before prediction.

**Request:**
- Form data with `image` file

**Response:**
```json
{
  "success": true,
  "validation": {
    "is_valid": true,
    "errors": [],
    "warnings": [],
    "blur_score": 250.5,
    "brightness": 128.3,
    "resolution": [1024, 768]
  }
}
```

## ⚠️ Medical Disclaimer

**IMPORTANT**: This application is for **academic demonstration purposes only**. 

- The AI model results are **not a medical diagnosis**
- Always consult a certified dermatologist for professional evaluation
- Do not use this application as a substitute for medical advice
- The model accuracy depends on training data quality

## 🧪 Model Training Details

### Architecture
- **Base Model**: MobileNetV2 / EfficientNetB0 (pre-trained on ImageNet)
- **Transfer Learning**: Frozen base layers initially, then fine-tuned
- **Additional Layers**:
  - Global Average Pooling
  - Dropout (0.3)
  - Dense (256 units, ReLU)
  - Dropout (0.3)
  - Dense (128 units, ReLU)
  - Dropout (0.2)
  - Dense (3 units, Softmax) - 3-class output

### Training Process
1. **Initial Training**: Freeze base model, train top layers
2. **Fine-tuning**: Unfreeze last layers, lower learning rate
3. **Data Augmentation**: Rotation, horizontal flip, zoom (as per requirements)
4. **Callbacks**: Model checkpointing, early stopping, learning rate reduction

### Hyperparameters
- **Optimizer**: Adam
- **Learning Rate**: 0.0001 (initial), 0.00001 (fine-tuning)
- **Loss Function**: Categorical Crossentropy (multi-class)
- **Batch Size**: 32
- **Epochs**: 30 (initial) + 10 (fine-tuning)
- **Classes**: 3 (Normal, Pimples, Skin Cancer)

## 📁 Project Structure

```
SkinSaviour/
├── app.py                      # Flask backend API
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── PROJECT_STRUCTURE.md        # Detailed structure
├── model/
│   ├── train_model.py         # Model training (3-class)
│   ├── model_utils.py         # Model utilities
│   └── skin_cancer_model.h5   # Trained model (generated)
├── utils/
│   └── image_validation.py    # Image quality validation
├── mobile_app/                 # Flutter mobile app
│   ├── lib/
│   │   ├── main.dart
│   │   ├── screens/
│   │   ├── providers/
│   │   └── services/
│   ├── android/
│   └── ios/
├── templates/                  # Web templates (legacy)
├── static/                     # Web static files (legacy)
└── uploads/                   # Temporary upload directory
```

See `PROJECT_STRUCTURE.md` for complete details.

## 🔧 Configuration

You can modify these settings in `app.py`:

- `UPLOAD_FOLDER`: Directory for temporary file uploads
- `MAX_FILE_SIZE`: Maximum file size (default: 10MB)
- `ALLOWED_EXTENSIONS`: Supported image formats

## 📱 Mobile App Setup

### Prerequisites
- Flutter SDK 3.0.0 or higher
- Android Studio / Xcode
- Google Maps API key (for doctor location)

### Quick Start
```bash
cd mobile_app
flutter pub get
# Update API URL in lib/services/api_service.dart
flutter run
```

See `mobile_app/README.md` for detailed setup instructions.

## 🎯 Features Implemented

✅ Multi-class CNN classification (3 classes)
✅ Image quality validation
✅ GPS-based nearby doctor location
✅ Medical information display
✅ Medication guidance (informational)
✅ Online consultation module
✅ Flutter mobile app
✅ Intelligent detection (no hard-coding)

## 📝 License

This project is for academic/educational purposes only.

## 👥 Credits

Developed as a deep learning and medical AI application demonstration project.

---

**Remember**: This is a demonstration project. For real medical applications, extensive validation, regulatory approval, and professional medical oversight are required.

