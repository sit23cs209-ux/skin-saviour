"""
Image quality validation utilities
"""

import cv2
import numpy as np
from PIL import Image
import os

def calculate_blur_score(image_path_or_array):
    """
    Calculate blur score using Laplacian variance
    
    Args:
        image_path_or_array: Path to image or numpy array
    
    Returns:
        Blur score (higher = less blurry)
    """
    # Load image
    if isinstance(image_path_or_array, str):
        img = cv2.imread(image_path_or_array)
    else:
        img = cv2.cvtColor(image_path_or_array, cv2.COLOR_RGB2BGR)
    
    if img is None:
        return 0
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Calculate Laplacian variance
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    return laplacian_var

def calculate_brightness(image_path_or_array):
    """
    Calculate average brightness of image
    
    Args:
        image_path_or_array: Path to image or numpy array
    
    Returns:
        Average brightness (0-255)
    """
    # Load image
    if isinstance(image_path_or_array, str):
        img = Image.open(image_path_or_array).convert('RGB')
        img_array = np.array(img)
    else:
        img_array = image_path_or_array
    
    # Calculate average brightness
    brightness = np.mean(img_array)
    
    return brightness

def check_resolution(image_path_or_array, min_resolution=(224, 224)):
    """
    Check if image meets minimum resolution requirements
    
    Args:
        image_path_or_array: Path to image or numpy array
        min_resolution: Minimum (width, height) required
    
    Returns:
        Tuple (meets_requirement, actual_resolution)
    """
    # Load image
    if isinstance(image_path_or_array, str):
        img = Image.open(image_path_or_array)
    else:
        img = Image.fromarray(image_path_or_array)
    
    width, height = img.size
    min_width, min_height = min_resolution
    
    meets_requirement = width >= min_width and height >= min_height
    
    return meets_requirement, (width, height)

def detect_pimple_acne(image_path_or_array):
    """
    Detect if image contains pimples or acne (benign skin condition)
    Pimples have distinct characteristics: raised bumps, red/pink color, circular shape
    
    Args:
        image_path_or_array: Path to image or numpy array
    
    Returns:
        Dictionary with pimple detection results
    """
    try:
        # Load image
        if isinstance(image_path_or_array, str):
            img = cv2.imread(image_path_or_array)
        else:
            img = cv2.cvtColor(image_path_or_array, cv2.COLOR_RGB2BGR)
        
        if img is None:
            return {'is_pimple': False, 'confidence': 0.0, 'reason': 'Could not load image'}
        
        # Convert to HSV for better color analysis
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # Detect red/pink colors (typical of pimples)
        # Red range in HSV: (0-10, 100-255, 50-255) and (170-180, 100-255, 50-255)
        lower_red1 = np.array([0, 100, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 100, 50])
        upper_red2 = np.array([180, 255, 255])
        
        mask_red1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask_red2 = cv2.inRange(hsv, lower_red2, upper_red2)
        red_mask = cv2.bitwise_or(mask_red1, mask_red2)
        
        # Calculate red/pink pixel percentage
        red_pixel_ratio = np.sum(red_mask > 0) / (img.shape[0] * img.shape[1])
        
        # Detect circular/round shapes (pimples are typically round)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (9, 9), 2)
        
        # Detect circles using HoughCircles
        circles = cv2.HoughCircles(
            blurred,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=30,
            param1=50,
            param2=30,
            minRadius=5,
            maxRadius=50
        )
        
        circle_count = 0
        if circles is not None:
            circle_count = len(circles[0])
        
        # Detect contours (bumps/raised areas)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filter small circular contours (typical of pimples)
        small_circular_contours = 0
        for contour in contours:
            area = cv2.contourArea(contour)
            if 50 < area < 2000:  # Pimple size range
                perimeter = cv2.arcLength(contour, True)
                if perimeter > 0:
                    circularity = 4 * np.pi * area / (perimeter * perimeter)
                    if circularity > 0.7:  # High circularity indicates pimple
                        small_circular_contours += 1
        
        # Calculate pimple score
        # Higher score = more likely to be pimple
        pimple_score = (
            (red_pixel_ratio * 10) +  # Red/pink color presence
            (min(circle_count, 5) * 2) +  # Circular shapes detected
            (min(small_circular_contours, 10) * 1.5)  # Small circular contours
        )
        
        # Stricter threshold for pimple detection - only detect if VERY confident
        # This prevents false positives that would reduce actual cancer predictions
        is_pimple = pimple_score > 5.0  # Increased threshold for more confidence
        confidence = min(pimple_score / 15.0, 1.0)  # Adjusted confidence calculation
        
        reason = ""
        if is_pimple:
            if red_pixel_ratio > 0.1:
                reason = "Image appears to show pimples/acne (red/pink raised bumps detected)"
            elif circle_count > 0:
                reason = "Circular raised bumps detected, likely pimples or acne"
            else:
                reason = "Small circular lesions detected, may be pimples"
        
        return {
            'is_pimple': bool(is_pimple),
            'confidence': float(confidence),
            'pimple_score': float(pimple_score),
            'red_pixel_ratio': float(red_pixel_ratio),
            'circle_count': int(circle_count),
            'contour_count': int(small_circular_contours),
            'reason': reason
        }
    
    except Exception as e:
        return {
            'is_pimple': False,
            'confidence': 0.0,
            'reason': f'Could not analyze for pimples: {str(e)}'
        }

def detect_skin_lesion(image_path_or_array):
    """
    Detect if image contains a visible skin lesion
    Uses edge detection and contrast analysis to identify lesions
    
    Args:
        image_path_or_array: Path to image or numpy array
    
    Returns:
        Dictionary with lesion detection results
    """
    try:
        # Load image
        if isinstance(image_path_or_array, str):
            img = cv2.imread(image_path_or_array)
        else:
            img = cv2.cvtColor(image_path_or_array, cv2.COLOR_RGB2BGR)
        
        if img is None:
            return {'has_lesion': False, 'confidence': 0.0, 'reason': 'Could not load image'}
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Calculate standard deviation (contrast measure)
        # Clear skin has low contrast, lesions have higher contrast
        std_dev = np.std(gray)
        
        # Calculate edge density using Canny edge detection
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
        
        # Calculate color variance (lesions often have different colors)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        hue_std = np.std(hsv[:, :, 0])
        saturation_std = np.std(hsv[:, :, 1])
        
        # Combined score for lesion detection
        # Higher values indicate presence of lesion-like features
        lesion_score = (std_dev / 50.0) + (edge_density * 100) + (hue_std / 10.0) + (saturation_std / 50.0)
        
        # Stricter threshold: if score is too low, likely clear skin without visible lesion
        # Lower threshold = more sensitive to clear skin detection
        has_lesion = lesion_score > 3.0  # Increased threshold - clearer distinction
        confidence = min(lesion_score / 8.0, 1.0)  # Adjusted confidence calculation
        
        # Additional check: if std_dev is very low, it's likely clear/uniform skin
        if std_dev < 12:
            has_lesion = False
            confidence = max(0.0, confidence - 0.3)  # Reduce confidence for clear skin
        
        reason = ""
        if not has_lesion:
            if std_dev < 15:
                reason = "Image appears to show clear/uniform skin without visible lesions"
            elif edge_density < 0.01:
                reason = "No distinct features or lesions detected in the image"
            else:
                reason = "Image may not contain a visible skin lesion"
        
        return {
            'has_lesion': has_lesion,
            'confidence': float(confidence),
            'lesion_score': float(lesion_score),
            'std_dev': float(std_dev),
            'edge_density': float(edge_density),
            'reason': reason
        }
    
    except Exception as e:
        return {
            'has_lesion': True,  # Assume has lesion if detection fails
            'confidence': 0.5,
            'reason': f'Could not analyze image: {str(e)}'
        }

def validate_image_quality(image_path_or_array):
    """
    Comprehensive image quality validation
    
    Args:
        image_path_or_array: Path to image or numpy array
    
    Returns:
        Dictionary with validation results
    """
    results = {
        'is_valid': True,
        'errors': [],
        'warnings': [],
        'blur_score': 0,
        'brightness': 0,
        'resolution': (0, 0),
        'lesion_detection': None
    }
    
    try:
        # Check if file exists (if path provided)
        if isinstance(image_path_or_array, str):
            if not os.path.exists(image_path_or_array):
                results['is_valid'] = False
                results['errors'].append('Image file not found')
                return results
        
        # Check resolution
        meets_res, resolution = check_resolution(image_path_or_array)
        results['resolution'] = resolution
        
        if not meets_res:
            results['warnings'].append(f'Image resolution ({resolution[0]}x{resolution[1]}) is below recommended minimum (224x224)')
        
        # Check blur
        blur_score = calculate_blur_score(image_path_or_array)
        results['blur_score'] = blur_score
        
        if blur_score < 100:  # Threshold for blur detection
            results['is_valid'] = False
            results['errors'].append('Image is too blurry. Please take a clearer photo.')
        
        # Check brightness
        brightness = calculate_brightness(image_path_or_array)
        results['brightness'] = brightness
        
        if brightness < 50:
            results['warnings'].append('Image is too dark. Better lighting is recommended.')
        elif brightness > 200:
            results['warnings'].append('Image is too bright. May affect detection accuracy.')
        
        # Detect if image contains a visible skin lesion
        lesion_detection = detect_skin_lesion(image_path_or_array)
        results['lesion_detection'] = lesion_detection
        
        if not lesion_detection['has_lesion']:
            results['warnings'].append(lesion_detection['reason'])
        
        # Check file size (if path provided)
        if isinstance(image_path_or_array, str):
            file_size = os.path.getsize(image_path_or_array) / (1024 * 1024)  # MB
            if file_size > 10:
                results['warnings'].append('Image file is very large. Processing may be slow.')
        
    except Exception as e:
        results['is_valid'] = False
        results['errors'].append(f'Error validating image: {str(e)}')
    
    return results

