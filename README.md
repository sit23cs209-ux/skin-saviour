# 🔬 Skin Saviour - AI-Powered Skin Condition Detection

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20.0-orange.svg)](https://www.tensorflow.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.0%2B-blue.svg)](https://flutter.dev/)

A cutting-edge web application leveraging deep learning and computer vision to detect skin conditions through intelligent image analysis. Built with Flask, TensorFlow, and a CNN-based model for multi-class classification.

## 📋 Project Summary

**Skin Saviour** is an AI-powered web application that uses deep learning to analyze skin images and classify them into three categories: **Skin Cancer**, **Pimples/Acne**, and **Normal Skin**. The system employs a Convolutional Neural Network (CNN) trained on medical image datasets to provide preliminary skin condition assessments.

### Key Features:
- **🤖 AI-Powered Detection**: CNN-based multi-class classification using TensorFlow/Keras
- **🔍 Intelligent Analysis**: Analyzes lesion shape, color, texture, and borders
- **✅ Image Quality Validation**: Pre-processing with blur detection, brightness check, and resolution validation
- **🌐 Web Interface**: Modern, responsive UI with drag-and-drop image upload
- **👤 User Authentication**: Secure login/registration system with session management
- **📊 Dashboard Analytics**: Track scan history and risk assessments
- **🏥 Healthcare Integration**: GPS-based nearby doctor search and online consultation
- **📱 Mobile Ready**: Flutter mobile app included for cross-platform support
- **🔒 Privacy Focused**: Local processing with temporary file handling

### Technology Stack:
- **Backend**: Flask (Python 3.12), TensorFlow 2.20.0, Keras
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Deep Learning**: CNN with MobileNetV2/EfficientNet transfer learning
- **Mobile**: Flutter 3.0+ (Android/iOS)
- **Database**: JSON-based user storage (scalable to SQL)
- **Image Processing**: PIL, OpenCV, NumPy

## 🎯 Use Cases

1. **Early Detection**: Preliminary screening for suspicious skin lesions
2. **Educational Tool**: Learning resource for understanding skin conditions
3. **Telemedicine Support**: Remote consultation assistance
4. **Research**: Academic study of AI in healthcare applications

## 🎓 For Academic Presentations (Viva/Demo)

### One-Line Explanation
> Skin Saviour is a CNN-based web application that analyzes uploaded skin images using deep learning to classify them into Normal Skin, Pimples/Acne, or Skin Cancer with confidence percentages and risk assessment.

### Key Technical Points
1. **Transfer Learning**: Uses pre-trained MobileNetV2/EfficientNet models
2. **Multi-class Classification**: Softmax activation for 3-class output (Normal, Pimples, Skin Cancer)
3. **Image Preprocessing**: Resize to 224×224, normalize to [0,1], batch processing
4. **Quality Validation**: Laplacian variance for blur, brightness thresholding, resolution checks
5. **RESTful API**: Flask backend with `/api/predict` and `/api/validate` endpoints
6. **User Experience**: Drag-and-drop upload, real-time preview, visual confidence display

### Demo Flow
1. Login/Register → Dashboard
2. Navigate to Scan page
3. Upload skin image (drag-and-drop or file picker)
4. System validates image quality
5. CNN analyzes and predicts condition
6. Display results with probabilities and recommendations
7. View scan history and analytics

### Expected Questions & Answers

**Q: How does the model classify images?**
A: The CNN extracts features from the image through convolutional layers, then uses a softmax classifier to output probabilities for each of the 3 classes. The class with the highest probability is the predicted condition.

**Q: What is the model architecture?**
A: We use transfer learning with MobileNetV2 as the base model (pre-trained on ImageNet), followed by Global Average Pooling, Dropout layers, and Dense layers with ReLU activation, ending with a 3-unit softmax output layer.

**Q: How do you ensure image quality?**
A: We implement three validation checks: (1) Blur detection using Laplacian variance, (2) Brightness analysis to ensure adequate lighting, (3) Resolution check to ensure minimum image size of 100×100 pixels.

**Q: What datasets did you use?**
A: The model is designed to be trained on medical datasets like ISIC, HAM10000, and acne image databases. The current implementation includes the model structure ready for training with appropriate data.

**Q: Is this meant for real medical diagnosis?**
A: No, this is an academic demonstration project. The application includes disclaimers stating it's for preliminary screening only and users must consult certified dermatologists for professional medical evaluation.

**Q: How accurate is the model?**
A: Model accuracy depends on the training dataset quality and size. With proper training on validated medical datasets, CNN models can achieve 85-95% accuracy in multi-class skin condition classification.

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

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (Python 3.12 recommended)
- pip package manager
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sit23cs209-ux/skin-saviour.git
   cd skin-saviour
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   
   Required packages:
   - tensorflow==2.20.0 (or latest compatible)
   - flask==3.0.0
   - flask-cors==4.0.0
   - pillow==10.1.0
   - numpy
   - opencv-python
   - scikit-image
   - werkzeug
   - requests

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open in browser**
   ```
   http://localhost:5000
   ```

### Default Login Credentials
- **Username**: admin
- **Password**: admin123

### Windows Users
Use the provided batch script for easy setup:
```bash
run.bat
```

## 💻 System Requirements

- **Operating System**: Windows 10/11, Linux, macOS
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space
- **Python**: 3.8 or higher (3.12 tested)
- **Browser**: Chrome, Firefox, Edge (latest versions)

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

## � Project Structure

```
SkinSaviour/
├── app.py                          # Main Flask application (679 lines)
├── requirements.txt                # Python dependencies
├── run.bat / run.sh               # Quick start scripts
├── users.json                      # User database (auto-generated)
├── 
├── model/                          # AI Model Components
│   ├── train_model.py             # CNN training script (3-class)
│   ├── model_utils.py             # Model loading & prediction (183 lines)
│   ├── skin_cancer_model.h5       # Trained model weights
│   └── __init__.py
│
├── utils/                          # Utility Functions
│   ├── image_validation.py        # Quality checks (blur, brightness, resolution)
│   └── __init__.py
│
├── templates/                      # HTML Templates
│   ├── login.html                 # Login page
│   ├── register.html              # Registration page
│   ├── dashboard.html             # User dashboard with analytics
│   ├── index.html                 # Scan/upload page
│   ├── history.html               # Scan history
│   ├── info.html                  # Medical information
│   ├── consultation.html          # Online consultation
│   ├── nearby-doctors.html        # GPS-based doctor finder
│   └── tracking.html              # Condition tracking
│
├── static/                         # Static Assets
│   ├── css/
│   │   ├── style.css             # Main styles
│   │   ├── login.css             # Authentication styles
│   │   ├── dashboard.css         # Dashboard styles
│   │   └── ...
│   └── js/
│       ├── app.js                # Main application logic (431 lines)
│       ├── dashboard.js          # Dashboard functionality
│       ├── login.js              # Login handling
│       └── ...
│
├── mobile_app/                     # Flutter Mobile Application
│   ├── lib/
│   │   ├── main.dart
│   │   ├── screens/              # App screens
│   │   ├── providers/            # State management
│   │   └── services/             # API integration
│   ├── android/                   # Android configuration
│   ├── ios/                       # iOS configuration
│   └── pubspec.yaml              # Flutter dependencies
│
├── uploads/                        # Temporary image uploads (auto-cleaned)
├── 
├── Documentation/
│   ├── README.md                  # This file
│   ├── PROJECT_STRUCTURE.md       # Detailed architecture
│   ├── RUN_INSTRUCTIONS.md        # Setup guide
│   ├── IMPLEMENTATION_SUMMARY.md  # Technical details
│   └── PREDICTION_EXPLANATION.md  # Model explanation
│
└── .gitignore                      # Git ignore rules
```

**Key Files:**
- **app.py** (679 lines): Main Flask server with all routes and API endpoints
- **model_utils.py** (183 lines): CNN model loading, preprocessing, and prediction logic
- **app.js** (431 lines): Frontend JavaScript for image upload and result display

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

### Core Features
✅ **AI-Powered Detection**: CNN-based multi-class classification (3 classes)  
✅ **Image Quality Validation**: Blur detection, brightness check, resolution validation  
✅ **User Authentication**: Secure login/registration with password hashing  
✅ **Dashboard Analytics**: Scan history, risk statistics, visual charts  
✅ **Responsive UI**: Modern design with drag-and-drop upload  
✅ **Session Management**: Secure user sessions with protected routes  
✅ **Real-time Processing**: Instant prediction with visual feedback  

### Healthcare Features
✅ **Risk Assessment**: High/Medium/Low risk categorization  
✅ **Confidence Scoring**: Percentage probabilities for each class  
✅ **Medical Recommendations**: Automated guidance based on results  
✅ **GPS Doctor Finder**: Nearby dermatologist location (mobile app)  
✅ **Online Consultation**: Virtual consultation module  
✅ **Medication Guidance**: Informational medication database  
✅ **Condition Tracking**: Historical scan tracking and monitoring  

### Technical Features
✅ **RESTful API**: Well-documented endpoints (`/api/predict`, `/api/validate`, `/api/login`)  
✅ **CORS Support**: Cross-origin resource sharing enabled  
✅ **File Upload Handling**: Secure file processing with validation  
✅ **Error Handling**: Comprehensive error messages and debugging  
✅ **Mobile App**: Flutter-based cross-platform mobile application  
✅ **Image Preprocessing**: Automated resize, normalization, and augmentation  
✅ **Model Serialization**: Saved model weights (`.h5` format)  

## 📊 System Workflow

```
User Input
    ↓
[Image Upload] → Image Validation (blur, brightness, resolution)
    ↓
[Preprocessing] → Resize to 224×224, Normalize to [0,1]
    ↓
[CNN Model] → Feature Extraction → Classification
    ↓
[Softmax Output] → Probabilities: [Normal, Pimples, Cancer]
    ↓
[Post-processing] → Risk Assessment, Recommendations
    ↓
[Response] → Display Results + Save to History
```

## 🔐 Security Features

- **Password Hashing**: werkzeug.security for secure password storage
- **Session Management**: Flask session with secret key
- **Protected Routes**: Login required decorator for sensitive pages
- **File Validation**: Extension and size checks before processing
- **Temporary Storage**: Automatic cleanup of uploaded files
- **Input Sanitization**: Secure filename handling with werkzeug

## 📝 Development Information

### Version History
- **v2.0** (Jan 2026): Fixed undefined condition display bug, improved frontend-backend integration
- **v1.0** (Jan 2026): Initial release with full features

### Git Repository
- **GitHub**: [https://github.com/sit23cs209-ux/skin-saviour](https://github.com/sit23cs209-ux/skin-saviour)
- **Commits**: 2+ commits with comprehensive change tracking
- **Branches**: main (production-ready)

### Contributors
Developed as an academic project demonstrating:
- Deep Learning in Healthcare
- Web Application Development
- Full-stack Integration (Frontend + Backend + ML)
- Medical AI Ethics and Responsible Development

### Future Enhancements
- [ ] Integration with larger medical datasets (HAM10000, ISIC)
- [ ] Support for additional skin conditions (eczema, rosacea, melanoma subtypes)
- [ ] Real-time model training and updates
- [ ] Advanced image segmentation for lesion boundary detection
- [ ] Integration with electronic health records (EHR)
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) for offline functionality
- [ ] Push notifications for follow-up reminders

## 🤝 Contributing

This is an academic project. For suggestions or improvements:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📄 License

This project is for **academic and educational purposes only**. Not licensed for commercial use or real medical diagnosis.

## ⚠️ Important Disclaimers

### Medical Disclaimer
- **NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE**
- This application provides preliminary screening only
- AI predictions are not medical diagnoses
- Always consult certified dermatologists for professional evaluation
- Do not make medical decisions based solely on this application
- In case of suspicious lesions, seek immediate medical attention

### Accuracy Disclaimer
- Model accuracy depends on training data quality and quantity
- Results may vary based on image quality, lighting, and angles
- The system is designed for demonstration and educational purposes
- Clinical validation is required before any medical application

### Privacy Disclaimer
- Uploaded images are temporarily stored and automatically deleted
- User data is stored locally (JSON format)
- No data is shared with third parties
- For production use, implement proper database security and HIPAA compliance

## 📞 Support

For questions, issues, or demonstrations:
- **GitHub Issues**: [Report a bug](https://github.com/sit23cs209-ux/skin-saviour/issues)
- **Documentation**: See `PROJECT_STRUCTURE.md` and `RUN_INSTRUCTIONS.md`
- **Email**: Contact through GitHub profile

## 🙏 Acknowledgments

- **TensorFlow/Keras**: Deep learning framework
- **Flask**: Web framework
- **MobileNetV2/EfficientNet**: Pre-trained model architectures
- **ISIC Archive**: Medical image datasets reference
- **OpenCV**: Image processing library
- **Medical AI Community**: Research papers and best practices

---

**📌 Quick Links:**
- [GitHub Repository](https://github.com/sit23cs209-ux/skin-saviour)
- [Project Structure](PROJECT_STRUCTURE.md)
- [Run Instructions](RUN_INSTRUCTIONS.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)

---

**⚡ Remember**: This is a demonstration of AI in healthcare. Real medical applications require:
- Regulatory approval (FDA, CE marking)
- Clinical trials and validation
- Professional medical oversight
- HIPAA compliance (for US)
- Continuous monitoring and updates
- Ethical review board approval

**Made with ❤️ for advancing AI in Healthcare Education**

