# 🚀 How to Run Skin Saviour

## Step-by-Step Instructions

### Prerequisites
- Python 3.8 or higher installed
- pip package manager

---

## Method 1: Quick Start (Recommended)

### Step 1: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac/Linux**: Open Terminal

### Step 2: Navigate to Project Directory
```bash
cd "C:\Users\Jayapriya\Downloads\Skin Saviour"
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

**Note**: This may take a few minutes as TensorFlow is a large package.

### Step 4: Run the Application
```bash
python app.py
```

### Step 5: Open in Browser
Once you see the message "Starting Skin Saviour API..." and "Model loaded: True/False", open your web browser and go to:

```
http://localhost:5000
```

---

## Method 2: Using Virtual Environment (Recommended for Production)

### Step 1: Create Virtual Environment
```bash
python -m venv venv
```

### Step 2: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the Application
```bash
python app.py
```

### Step 5: Open in Browser
```
http://localhost:5000
```

---

## Troubleshooting

### Issue: "Module not found" error
**Solution**: Make sure all dependencies are installed:
```bash
pip install -r requirements.txt
```

### Issue: "Port 5000 already in use"
**Solution**: Change the port in `app.py` (last line):
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change to 5001 or any available port
```

### Issue: "Model file not found"
**Solution**: This is normal! The app will create a sample model structure. For actual predictions, you need to train the model with data:
```bash
python model/train_model.py
```

### Issue: TensorFlow installation fails
**Solution**: Try installing TensorFlow separately:
```bash
pip install tensorflow==2.15.0
```

---

## Optional: Training the Model

If you have training data organized as:
```
data/
├── cancerous/
│   └── (images)
└── non_cancerous/
    └── (images)
```

Run:
```bash
python model/train_model.py
```

This will create `model/skin_cancer_model.h5` with trained weights.

---

## Testing the Application

1. **Upload an Image**: Click the upload area or drag & drop an image
2. **Click "Analyze Image"**: Wait for processing
3. **View Results**: See detection result, confidence score, and risk level
4. **Follow Recommendations**: Based on the results

---

## Stopping the Application

Press `Ctrl + C` in the terminal to stop the server.

---

## Quick Test

To test if everything is installed correctly:
```bash
python -c "import tensorflow as tf; import flask; print('All dependencies installed successfully!')"
```

