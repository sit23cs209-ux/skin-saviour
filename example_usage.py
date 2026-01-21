"""
Example usage of Skin Saviour detection system
This script demonstrates how to use the SkinCancerDetector programmatically
"""

from model.model_utils import SkinCancerDetector
from utils.image_validation import validate_image_quality
import os

def example_usage():
    """Example of using the skin cancer detection system"""
    
    print("=" * 60)
    print("Skin Saviour - Example Usage")
    print("=" * 60)
    
    # Initialize detector
    print("\n1. Initializing Skin Cancer Detector...")
    detector = SkinCancerDetector()
    
    # Example: Validate an image
    print("\n2. Image Validation Example:")
    print("   To validate an image, use:")
    print("   validation_result = validate_image_quality('path/to/image.jpg')")
    print("   print(validation_result)")
    
    # Example: Make a prediction
    print("\n3. Prediction Example:")
    print("   To predict skin cancer, use:")
    print("   result = detector.predict('path/to/image.jpg')")
    print("   print(result)")
    
    print("\n" + "=" * 60)
    print("Note: Replace 'path/to/image.jpg' with an actual image path")
    print("=" * 60)

if __name__ == "__main__":
    example_usage()

