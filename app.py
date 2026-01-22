"""
Flask Backend API for Skin Cancer Detection
"""

from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from functools import wraps
import os
import json
from PIL import Image
import numpy as np

from model.model_utils import SkinCancerDetector
from utils.image_validation import validate_image_quality

app = Flask(__name__)
CORS(app)

# Secret key for sessions (change in production!)
app.config['SECRET_KEY'] = 'skin-saviour-secret-key-2024-change-in-production'

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create upload directory
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# User storage file (simple file-based storage for demo)
USERS_FILE = 'users.json'
HISTORY_FILE = 'prediction_history.json'
KNOWLEDGE_FILE = 'medical_knowledge.json'

# Initialize detector
detector = SkinCancerDetector()

# Helper functions for user management
def load_users():
    """Load users from file"""
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_users(users):
    """Save users to file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def load_prediction_history():
    """Load prediction history from file"""
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_prediction_history(history):
    """Save prediction history to file"""
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2)

def add_prediction_to_history(user_id, image_filename, prediction_result, image_metadata=None):
    """Add a new prediction to history"""
    from datetime import datetime
    
    history = load_prediction_history()
    
    prediction_entry = {
        'prediction_id': f"pred_{len(history) + 1}_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        'user_id': user_id,
        'timestamp': datetime.now().isoformat(),
        'image_filename': image_filename,
        'condition': prediction_result.get('condition'),
        'confidence': prediction_result.get('confidence'),
        'risk_level': prediction_result.get('risk_level'),
        'is_cancerous': prediction_result.get('is_cancerous'),
        'probabilities': prediction_result.get('probabilities'),
        'metadata': image_metadata or {}
    }
    
    history.append(prediction_entry)
    save_prediction_history(history)
    
    return prediction_entry['prediction_id']

def get_analytics_summary(user_id=None):
    """Generate analytics summary from prediction history"""
    history = load_prediction_history()
    
    if user_id:
        history = [p for p in history if p.get('user_id') == user_id]
    
    if not history:
        return {
            'total_predictions': 0,
            'high_risk_count': 0,
            'medium_risk_count': 0,
            'low_risk_count': 0,
            'condition_distribution': {},
            'recent_predictions': []
        }
    
    analytics = {
        'total_predictions': len(history),
        'high_risk_count': sum(1 for p in history if p.get('risk_level') == 'High'),
        'medium_risk_count': sum(1 for p in history if p.get('risk_level') == 'Medium'),
        'low_risk_count': sum(1 for p in history if p.get('risk_level') == 'Low'),
        'condition_distribution': {},
        'recent_predictions': sorted(history, key=lambda x: x.get('timestamp', ''), reverse=True)[:5]
    }
    
    for prediction in history:
        condition = prediction.get('condition', 'Unknown')
        analytics['condition_distribution'][condition] = analytics['condition_distribution'].get(condition, 0) + 1
    
    return analytics

def load_medical_knowledge():
    """Load medical knowledge base"""
    if os.path.exists(KNOWLEDGE_FILE):
        try:
            with open(KNOWLEDGE_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def init_default_user():
    """Initialize default user for demo"""
    users = load_users()
    if not users:
        # Create default user: username: admin, password: admin123
        users = {
            'admin': {
                'username': 'admin',
                'email': 'admin@skinsaviour.com',
                'password': generate_password_hash('admin123')
            }
        }
        save_users(users)
        print("Default user created: username='admin', password='admin123'")

# Initialize default user on startup
init_default_user()

# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
@login_required
def index():
    """Redirect to dashboard after login"""
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
@login_required
def dashboard():
    """Serve the dashboard page (protected)"""
    return render_template('dashboard.html')

@app.route('/scan')
@login_required
def scan():
    """Serve the scan/image upload page (protected)"""
    return render_template('index.html')

@app.route('/history')
@login_required
def history():
    """Serve the scan history page (protected)"""
    return render_template('history.html')

@app.route('/info')
@login_required
def info():
    """Serve the information page (protected)"""
    return render_template('info.html')

@app.route('/consultation')
@login_required
def consultation():
    """Serve the doctor consultation page (protected)"""
    return render_template('consultation.html')

@app.route('/nearby-doctors')
@login_required
def nearby_doctors_page():
    """Serve the nearby doctors page (protected)"""
    return render_template('nearby-doctors.html')

@app.route('/tracking')
@login_required
def tracking():
    """Serve the tracking page (protected)"""
    return render_template('tracking.html')

@app.route('/login', methods=['GET'])
def login():
    """Serve the login page"""
    if 'user_id' in session:
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/register', methods=['GET'])
def register():
    """Serve the registration page"""
    if 'user_id' in session:
        return redirect(url_for('index'))
    return render_template('register.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    """Handle login request"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        remember_me = data.get('remember_me', False)
        
        if not username or not password:
            return jsonify({
                'success': False,
                'message': 'Username and password are required'
            }), 400
        
        users = load_users()
        
        if username not in users:
            return jsonify({
                'success': False,
                'message': 'Invalid username or password'
            }), 401
        
        user = users[username]
        
        if not check_password_hash(user['password'], password):
            return jsonify({
                'success': False,
                'message': 'Invalid username or password'
            }), 401
        
        # Login successful - create session
        session['user_id'] = username
        session['username'] = username
        session.permanent = remember_me
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'username': username,
            'redirect': '/dashboard'
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Login error: {str(e)}'
        }), 500

@app.route('/api/register', methods=['POST'])
def api_register():
    """Handle registration request"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not username or not email or not password:
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400
        
        if len(password) < 6:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 6 characters long'
            }), 400
        
        users = load_users()
        
        if username in users:
            return jsonify({
                'success': False,
                'message': 'Username already exists'
            }), 400
        
        # Check if email already exists
        for user in users.values():
            if user.get('email') == email:
                return jsonify({
                    'success': False,
                    'message': 'Email already registered'
                }), 400
        
        # Create new user
        users[username] = {
            'username': username,
            'email': email,
            'password': generate_password_hash(password)
        }
        save_users(users)
        
        return jsonify({
            'success': True,
            'message': 'Account created successfully'
        }), 201
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Registration error: {str(e)}'
        }), 500

@app.route('/api/logout', methods=['POST'])
def api_logout():
    """Handle logout request"""
    session.clear()
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200

@app.route('/logout')
def logout():
    """Logout and redirect to login"""
    session.clear()
    return redirect(url_for('login'))

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Skin Saviour API is running'
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict skin condition from uploaded image (3-class classification)
    Classes: Skin Cancer, Pimples/Acne, Normal Skin
    
    Expected request:
    - POST with 'image' file in form data
    """
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({
                'error': 'No file selected'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, GIF, BMP'
            }), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Validate image quality
        validation_result = validate_image_quality(filepath)
        
        if not validation_result['is_valid']:
            # Clean up uploaded file
            os.remove(filepath)
            return jsonify({
                'error': 'Image quality validation failed',
                'details': validation_result['errors'],
                'warnings': validation_result['warnings']
            }), 400
        
        # Make prediction using CNN
        try:
            prediction_result = detector.predict(filepath)
        except Exception as pred_error:
            # Clean up uploaded file
            if os.path.exists(filepath):
                os.remove(filepath)
            import traceback
            error_trace = traceback.format_exc()
            print(f"Prediction error details: {error_trace}")
            return jsonify({
                'error': 'Prediction failed',
                'message': f'Model prediction error: {str(pred_error)}',
                'details': 'Please ensure the model is properly loaded and the image is valid.',
                'traceback': error_trace if app.debug else None
            }), 500
        
        # Add validation warnings to result
        if validation_result['warnings']:
            prediction_result['warnings'] = validation_result['warnings']
        
        # Add medical disclaimer
        prediction_result['disclaimer'] = 'This is an AI-based preliminary analysis and not a medical diagnosis.'
        
        # Store prediction in history
        user_id = session.get('user_id', 'guest')
        image_metadata = {
            'original_filename': file.filename,
            'file_size': len(file.read()),
            'validation_warnings': validation_result.get('warnings', [])
        }
        file.seek(0)  # Reset file pointer after reading size
        
        try:
            prediction_id = add_prediction_to_history(
                user_id=user_id,
                image_filename=filename,
                prediction_result=prediction_result,
                image_metadata=image_metadata
            )
            prediction_result['prediction_id'] = prediction_id
        except Exception as storage_error:
            print(f"Warning: Failed to store prediction history: {storage_error}")
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify({
            'success': True,
            'prediction': prediction_result
        }), 200
    
    except Exception as e:
        # Clean up file if it exists
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in prediction endpoint: {error_details}")
        
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e),
            'details': 'Please check the server logs for more information.'
        }), 500

@app.route('/api/validate', methods=['POST'])
def validate():
    """
    Validate image quality before prediction
    
    Expected request:
    - POST with 'image' file in form data
    """
    try:
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({
                'error': 'No file selected'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, GIF, BMP'
            }), 400
        
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Validate image quality
        validation_result = validate_image_quality(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify({
            'success': True,
            'validation': validation_result
        }), 200
    
    except Exception as e:
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        
        return jsonify({
            'error': 'Validation failed',
            'message': str(e)
        }), 500

@app.route('/api/medical-info', methods=['GET'])
def medical_info():
    """
    Get medical information based on condition type
    
    Query params:
    - condition: 'skin_cancer', 'pimples', or 'normal'
    """
    condition = request.args.get('condition', '').lower()
    
    info_data = {
        'skin_cancer': {
            'title': 'Skin Cancer Information',
            'what_is': 'Skin cancer is the abnormal growth of skin cells, most often developing on skin exposed to the sun. The three main types are basal cell carcinoma, squamous cell carcinoma, and melanoma.',
            'early_symptoms': [
                'New or changing moles or growths',
                'Asymmetrical shape',
                'Irregular borders',
                'Varied colors',
                'Diameter larger than 6mm',
                'Evolving size, shape, or color'
            ],
            'importance': 'Early detection is crucial for successful treatment. Regular skin examinations and prompt medical attention can significantly improve outcomes.',
            'recommendation': 'Please consult a dermatologist immediately for professional evaluation and diagnosis.'
        },
        'pimples': {
            'title': 'Pimples / Acne Information',
            'what_is': 'Pimples (acne) are a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells. They typically appear as red, raised bumps on the skin.',
            'causes': [
                'Excess oil (sebum) production',
                'Hair follicles clogged by oil and dead skin cells',
                'Bacteria (Propionibacterium acnes)',
                'Hormonal changes',
                'Certain medications',
                'Diet and stress'
            ],
            'skincare_tips': [
                'Wash face twice daily with gentle cleanser',
                'Avoid touching or picking at pimples',
                'Use non-comedogenic (non-pore-clogging) products',
                'Keep skin moisturized',
                'Protect skin from sun exposure',
                'Consider over-the-counter treatments with benzoyl peroxide or salicylic acid'
            ],
            'recommendation': 'For persistent or severe acne, consult a dermatologist for personalized treatment.'
        },
        'normal': {
            'title': 'Normal Skin Care',
            'what_is': 'Your skin appears healthy with no concerning lesions detected.',
            'maintenance_tips': [
                'Use sunscreen daily (SPF 30 or higher)',
                'Stay hydrated',
                'Eat a balanced diet rich in antioxidants',
                'Avoid excessive sun exposure',
                'Perform regular self-examinations',
                'Keep skin clean and moisturized'
            ],
            'prevention': [
                'Regular skin checks',
                'Protect from UV radiation',
                'Avoid tanning beds',
                'Know your family history',
                'Monitor changes in moles or skin growths'
            ],
            'recommendation': 'Continue maintaining healthy skin practices and consult a dermatologist for regular check-ups.'
        }
    }
    
    if condition not in info_data:
        return jsonify({
            'error': 'Invalid condition type',
            'available_conditions': list(info_data.keys())
        }), 400
    
    return jsonify({
        'success': True,
        'condition': condition,
        'information': info_data[condition]
    }), 200

@app.route('/api/nearby-doctors', methods=['GET'])
def nearby_doctors_api():
    """
    Get nearby dermatologists based on user location
    
    Query params:
    - lat: Latitude
    - lng: Longitude
    - radius: Search radius in km (default: 10)
    """
    try:
        lat = float(request.args.get('lat', 0))
        lng = float(request.args.get('lng', 0))
        radius = float(request.args.get('radius', 10))
        
        if lat == 0 and lng == 0:
            return jsonify({
                'error': 'Location coordinates required'
            }), 400
        
        # Sample doctor data (in production, this would query a database or Google Places API)
        # For demonstration, return sample data
        sample_doctors = [
            {
                'id': 1,
                'name': 'Dr. Sarah Johnson',
                'specialization': 'Dermatologist',
                'hospital': 'City Medical Center',
                'address': '123 Medical Street, City',
                'phone': '+1-234-567-8900',
                'distance_km': round(2.5, 2),
                'rating': 4.8,
                'lat': lat + 0.01,
                'lng': lng + 0.01
            },
            {
                'id': 2,
                'name': 'Dr. Michael Chen',
                'specialization': 'Dermatologist',
                'hospital': 'Regional Skin Clinic',
                'address': '456 Health Avenue, City',
                'phone': '+1-234-567-8901',
                'distance_km': round(5.2, 2),
                'rating': 4.6,
                'lat': lat + 0.02,
                'lng': lng - 0.01
            },
            {
                'id': 3,
                'name': 'Dr. Emily Rodriguez',
                'specialization': 'Dermatologist',
                'hospital': 'University Hospital',
                'address': '789 University Drive, City',
                'phone': '+1-234-567-8902',
                'distance_km': round(7.8, 2),
                'rating': 4.9,
                'lat': lat - 0.015,
                'lng': lng + 0.02
            }
        ]
        
        # Filter by radius (simple distance calculation)
        nearby = [doc for doc in sample_doctors if doc['distance_km'] <= radius]
        
        return jsonify({
            'success': True,
            'user_location': {'lat': lat, 'lng': lng},
            'radius_km': radius,
            'doctors': nearby,
            'count': len(nearby)
        }), 200
    
    except ValueError:
        return jsonify({
            'error': 'Invalid location coordinates'
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Failed to fetch nearby doctors',
            'message': str(e)
        }), 500

@app.route('/api/medication-guidance', methods=['GET'])
def medication_guidance():
    """
    Get informational medication guidance (non-prescription only)
    
    Query params:
    - condition: 'skin_cancer', 'pimples', or 'normal'
    """
    condition = request.args.get('condition', '').lower()
    
    guidance_data = {
        'skin_cancer': {
            'title': 'Important Notice',
            'message': 'Skin cancer requires professional medical treatment. Do not attempt self-medication.',
            'recommendations': [
                'Consult a certified dermatologist immediately',
                'Follow medical professional advice',
                'Do not use over-the-counter treatments for suspected cancer',
                'Early professional intervention is critical'
            ],
            'disclaimer': 'This is not medical advice. Always consult a certified doctor before any treatment.'
        },
        'pimples': {
            'title': 'Over-the-Counter Skincare Suggestions',
            'message': 'For mild to moderate acne, consider these non-prescription options:',
            'suggestions': [
                {
                    'product_type': 'Benzoyl Peroxide',
                    'strength': '2.5% - 10%',
                    'usage': 'Apply once or twice daily to affected areas',
                    'note': 'May cause dryness, start with lower concentration'
                },
                {
                    'product_type': 'Salicylic Acid',
                    'strength': '0.5% - 2%',
                    'usage': 'Use as cleanser or spot treatment',
                    'note': 'Helps unclog pores and reduce inflammation'
                },
                {
                    'product_type': 'Retinoids (Adapalene)',
                    'strength': '0.1%',
                    'usage': 'Apply at night, start with every other day',
                    'note': 'Available over-the-counter, may cause initial irritation'
                },
                {
                    'product_type': 'Gentle Cleanser',
                    'usage': 'Wash face twice daily',
                    'note': 'Non-comedogenic, fragrance-free products recommended'
                }
            ],
            'disclaimer': 'Medication guidance is informational only. Consult a certified doctor before use. Results may vary. Discontinue if irritation occurs.'
        },
        'normal': {
            'title': 'Maintenance Skincare',
            'message': 'For healthy skin maintenance:',
            'suggestions': [
                {
                    'product_type': 'Sunscreen',
                    'spf': 'SPF 30 or higher',
                    'usage': 'Apply daily, reapply every 2 hours if outdoors',
                    'note': 'Essential for skin cancer prevention'
                },
                {
                    'product_type': 'Moisturizer',
                    'usage': 'Apply daily to maintain skin barrier',
                    'note': 'Choose non-comedogenic products'
                },
                {
                    'product_type': 'Gentle Cleanser',
                    'usage': 'Wash face twice daily',
                    'note': 'Maintains skin health without over-drying'
                }
            ],
            'disclaimer': 'These are general skincare recommendations. Consult a dermatologist for personalized advice.'
        }
    }
    
    if condition not in guidance_data:
        return jsonify({
            'error': 'Invalid condition type',
            'available_conditions': list(guidance_data.keys())
        }), 400
    
    return jsonify({
        'success': True,
        'condition': condition,
        'guidance': guidance_data[condition]
    }), 200

@app.route('/api/prediction-history', methods=['GET'])
def get_prediction_history():
    """Get prediction history for the current user"""
    try:
        user_id = session.get('user_id', 'guest')
        history = load_prediction_history()
        
        # Filter by user
        user_history = [p for p in history if p.get('user_id') == user_id]
        
        # Sort by timestamp (newest first)
        user_history = sorted(user_history, key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'count': len(user_history),
            'predictions': user_history
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics summary for the current user"""
    try:
        user_id = session.get('user_id', 'guest')
        analytics = get_analytics_summary(user_id)
        
        return jsonify({
            'success': True,
            'analytics': analytics
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/condition-info/<condition>', methods=['GET'])
def get_condition_info(condition):
    """Get detailed medical information about a condition"""
    try:
        knowledge = load_medical_knowledge()
        conditions = knowledge.get('conditions', {})
        
        condition_lower = condition.lower().replace(' ', '_')
        
        if condition_lower not in conditions:
            return jsonify({
                'success': False,
                'error': 'Condition not found',
                'available_conditions': list(conditions.keys())
            }), 404
        
        return jsonify({
            'success': True,
            'condition': condition_lower,
            'information': conditions[condition_lower]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/prediction/<prediction_id>', methods=['GET'])
def get_prediction_detail(prediction_id):
    """Get details of a specific prediction"""
    try:
        history = load_prediction_history()
        
        prediction = next((p for p in history if p.get('prediction_id') == prediction_id), None)
        
        if not prediction:
            return jsonify({
                'success': False,
                'error': 'Prediction not found'
            }), 404
        
        # Check if user has access to this prediction
        user_id = session.get('user_id', 'guest')
        if prediction.get('user_id') != user_id:
            return jsonify({
                'success': False,
                'error': 'Access denied'
            }), 403
        
        return jsonify({
            'success': True,
            'prediction': prediction
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    """Get comprehensive dashboard statistics"""
    try:
        user_id = session.get('user_id', 'guest')
        analytics = get_analytics_summary(user_id)
        
        # Calculate additional statistics
        history = load_prediction_history()
        user_history = [p for p in history if p.get('user_id') == user_id]
        
        stats = {
            'total_scans': analytics['total_predictions'],
            'high_risk_count': analytics['high_risk_count'],
            'medium_risk_count': analytics['medium_risk_count'],
            'low_risk_count': analytics['low_risk_count'],
            'condition_distribution': analytics['condition_distribution'],
            'recent_scans': analytics['recent_predictions'][:10]
        }
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Skin Saviour API...")
    print("Model loaded:", detector.model is not None)
    print("Multi-class classification: Normal, Pimples, Skin Cancer")
    app.run(debug=True, host='0.0.0.0', port=5000)

