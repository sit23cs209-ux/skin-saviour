"""
Utility functions for loading and using the trained CNN model
Multi-class classification: Skin Cancer, Pimples/Acne, Normal Skin
"""

import tensorflow as tf
import numpy as np
from PIL import Image
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Class names for 3-class classification
CLASS_NAMES = ['normal', 'pimples', 'skin_cancer']
NUM_CLASSES = 3

class SkinCancerDetector:
    """CNN-based skin condition detection model (3-class classification)"""
    
    def __init__(self, model_path='model/skin_cancer_model.h5'):
        """
        Initialize the detector with trained model
        
        Args:
            model_path: Path to the saved model file
        """
        self.model_path = model_path
        self.model = None
        self.class_names = CLASS_NAMES
        self.num_classes = NUM_CLASSES
        self.load_model()
    
    def load_model(self):
        """Load the trained CNN model"""
        try:
            if os.path.exists(self.model_path):
                self.model = tf.keras.models.load_model(self.model_path)
                print(f"Model loaded successfully from {self.model_path}")
            else:
                print(f"Model file not found at {self.model_path}")
                print("Creating a new model structure...")
                self._create_sample_model()
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Creating a new model structure...")
            self._create_sample_model()
    
    def _create_sample_model(self):
        """Create a sample model structure if trained model is not available"""
        from model.train_model import create_model
        self.model = create_model()
        # Save the untrained model structure
        os.makedirs('model', exist_ok=True)
        self.model.save(self.model_path)
        print("Sample model structure created. Please train the model with actual data.")
    
    def preprocess_image(self, image_path_or_array, target_size=(224, 224)):
        """
        Preprocess image for CNN input
        
        Args:
            image_path_or_array: Path to image file or numpy array
            target_size: Target size (height, width)
        
        Returns:
            Preprocessed image array
        """
        # Load image
        if isinstance(image_path_or_array, str):
            img = Image.open(image_path_or_array).convert('RGB')
        else:
            img = Image.fromarray(image_path_or_array).convert('RGB')
        
        # Resize to target size
        img = img.resize(target_size)
        
        # Convert to array and normalize
        img_array = np.array(img, dtype=np.float32)
        img_array = img_array / 255.0  # Normalize to [0, 1]
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    def predict(self, image_path_or_array):
        """
        Predict skin condition using CNN (3-class classification)
        Uses actual CNN predictions - analyzes lesion shape, color, texture, and borders
        
        Args:
            image_path_or_array: Path to image file or numpy array
        
        Returns:
            Dictionary with prediction results based on actual CNN analysis
        """
        # Preprocess image
        try:
            processed_image = self.preprocess_image(image_path_or_array)
        except Exception as e:
            raise ValueError(f"Image preprocessing failed: {str(e)}")
        
        # Make CNN prediction - THIS IS THE ACTUAL ANALYSIS
        try:
            if self.model is None:
                raise ValueError("Model is not loaded. Please ensure the model file exists.")
            prediction = self.model.predict(processed_image, verbose=0)
        except Exception as e:
            raise ValueError(f"CNN prediction failed: {str(e)}")
        
        # Handle prediction output (3-class softmax)
        try:
            if len(prediction.shape) < 2:
                raise ValueError(f"Unexpected prediction shape: {prediction.shape}")
            
            # Get probabilities for all 3 classes
            if prediction.shape[-1] == self.num_classes:
                # 3-class output: [normal, pimples, skin_cancer]
                probabilities = prediction[0]
            elif prediction.shape[-1] == 1:
                # Binary model fallback - convert to 3-class format
                cancer_prob = float(prediction[0][0])
                probabilities = np.array([
                    1.0 - cancer_prob,  # normal
                    0.0,  # pimples
                    cancer_prob  # skin_cancer
                ])
            else:
                raise ValueError(f"Unexpected prediction shape: {prediction.shape}")
            
            # Ensure probabilities sum to 1
            probabilities = probabilities / np.sum(probabilities)
            
        except (IndexError, ValueError, TypeError) as e:
            raise ValueError(f"Failed to extract prediction: {str(e)}. Shape: {prediction.shape}")
        
        # Get class probabilities
        normal_prob = float(probabilities[0])
        pimples_prob = float(probabilities[1])
        skin_cancer_prob = float(probabilities[2])
        
        # Find predicted class (highest probability)
        class_index = int(np.argmax(probabilities))
        predicted_class = self.class_names[class_index]
        confidence = float(probabilities[class_index])
        
        # Determine condition name and risk level based on CNN prediction AND severity
        if predicted_class == 'skin_cancer':
            condition = 'Skin Cancer'
            # Risk level based on confidence - higher confidence = more concerning
            if confidence >= 0.75:
                risk_level = 'High'
            elif confidence >= 0.50:
                risk_level = 'Medium'
            else:
                risk_level = 'Low'
        elif predicted_class == 'pimples':
            condition = 'Pimples / Acne'
            # For pimples, assess severity based on confidence (indicates coverage/severity)
            if confidence >= 0.80:
                risk_level = 'Medium'  # Severe acne
            elif confidence >= 0.60:
                risk_level = 'Low'  # Moderate acne
            else:
                risk_level = 'Low'  # Mild acne
        else:  # normal
            condition = 'Normal / Non-Cancerous Skin'
            risk_level = 'Low'
        
        # Calculate confidence percentage
        confidence_percentage = round(confidence * 100, 2)
        
        return {
            'condition': condition,
            'predicted_class': predicted_class,
            'confidence': confidence_percentage,
            'risk_level': risk_level,
            'probabilities': {
                'normal': round(normal_prob * 100, 2),
                'pimples': round(pimples_prob * 100, 2),
                'skin_cancer': round(skin_cancer_prob * 100, 2)
            },
            'raw_probabilities': {
                'normal': float(normal_prob),
                'pimples': float(pimples_prob),
                'skin_cancer': float(skin_cancer_prob)
            },
            'is_cancerous': predicted_class == 'skin_cancer',
            'is_pimples': predicted_class == 'pimples',
            'is_normal': predicted_class == 'normal'
        }

