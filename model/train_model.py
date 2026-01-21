"""
CNN Model Training Script for Skin Saviour
Multi-class classification: Skin Cancer, Pimples/Acne, Normal Skin
Uses MobileNetV2/EfficientNet transfer learning
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2, EfficientNetB0
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import os

# Set random seeds for reproducibility
tf.random.set_seed(42)
np.random.seed(42)

# Class names for 3-class classification
CLASS_NAMES = ['normal', 'pimples', 'skin_cancer']
NUM_CLASSES = 3

def create_model(input_shape=(224, 224, 3), base_model_type='mobilenet'):
    """
    Create CNN model using transfer learning for 3-class classification
    
    Args:
        input_shape: Input image shape (height, width, channels)
        base_model_type: 'mobilenet' or 'efficientnet'
    
    Returns:
        Compiled Keras model
    """
    # Load pre-trained base model (without top layers)
    if base_model_type == 'efficientnet':
        base_model = EfficientNetB0(
            input_shape=input_shape,
            include_top=False,
            weights='imagenet'
        )
    else:  # Default to MobileNetV2
        base_model = MobileNetV2(
            input_shape=input_shape,
            include_top=False,
            weights='imagenet'
        )
    
    # Freeze base model layers initially
    base_model.trainable = False
    
    # Build the model with 3-class output
    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(NUM_CLASSES, activation='softmax')  # 3-class classification
    ])
    
    # Compile the model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy', 'top_k_categorical_accuracy']
    )
    
    return model

def train_model(data_dir, epochs=30, batch_size=32, validation_split=0.2, base_model_type='mobilenet'):
    """
    Train the CNN model on skin condition images (3-class classification)
    
    Args:
        data_dir: Directory containing 'normal', 'pimples', and 'skin_cancer' subdirectories
        epochs: Number of training epochs
        batch_size: Batch size for training
        validation_split: Fraction of data to use for validation
        base_model_type: 'mobilenet' or 'efficientnet'
    """
    # Create model
    model = create_model(base_model_type=base_model_type)
    
    # Data augmentation for training (as per requirements)
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=validation_split,
        rotation_range=30,  # Rotation augmentation
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,  # Horizontal flip
        zoom_range=0.2,  # Zoom augmentation
        brightness_range=[0.8, 1.2],
        shear_range=0.2,
        fill_mode='nearest'
    )
    
    # Validation data generator (no augmentation)
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=validation_split
    )
    
    # Training generator (categorical for multi-class)
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',  # Multi-class classification
        subset='training',
        shuffle=True
    )
    
    # Validation generator
    val_generator = val_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',  # Multi-class classification
        subset='validation',
        shuffle=False
    )
    
    # Print class indices for reference
    print("\nClass indices:", train_generator.class_indices)
    
    # Callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            'model/skin_cancer_model.h5',
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7
        )
    ]
    
    # Train the model
    print("Starting model training...")
    history = model.fit(
        train_generator,
        epochs=epochs,
        validation_data=val_generator,
        callbacks=callbacks,
        verbose=1
    )
    
    # Fine-tuning: Unfreeze some layers
    print("\nStarting fine-tuning...")
    base_model = model.layers[0]
    base_model.trainable = True
    
    # Freeze first 100 layers, unfreeze the rest
    for layer in base_model.layers[:100]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.00001),
        loss='categorical_crossentropy',
        metrics=['accuracy', 'top_k_categorical_accuracy']
    )
    
    # Continue training
    history_fine = model.fit(
        train_generator,
        epochs=10,
        initial_epoch=history.epoch[-1],
        validation_data=val_generator,
        callbacks=callbacks,
        verbose=1
    )
    
    # Save final model
    model.save('model/skin_cancer_model.h5')
    print("\nModel training completed and saved to 'model/skin_cancer_model.h5'")
    
    return model, history

if __name__ == "__main__":
    # Example usage
    # Make sure your data directory has this structure:
    # data/
    #   ├── normal/
    #   │   ├── image1.jpg
    #   │   └── ...
    #   ├── pimples/
    #   │   ├── image1.jpg
    #   │   └── ...
    #   └── skin_cancer/
    #       ├── image1.jpg
    #       └── ...
    
    data_directory = "data"  # Update this path
    
    if os.path.exists(data_directory):
        model, history = train_model(
            data_dir=data_directory,
            epochs=30,
            batch_size=32,
            base_model_type='mobilenet'  # or 'efficientnet'
        )
    else:
        print(f"Data directory '{data_directory}' not found.")
        print("Please organize your data as:")
        print("  data/normal/")
        print("  data/pimples/")
        print("  data/skin_cancer/")
        print("\nCreating a sample model structure for demonstration...")
        model = create_model()
        os.makedirs('model', exist_ok=True)
        model.save('model/skin_cancer_model.h5')
        print("Sample model structure saved. Train with actual data when available.")

