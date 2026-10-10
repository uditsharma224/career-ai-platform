"""
CareerAI Backend - Main Application Entry Point
Flask-based backend with CORS enabled for frontend communication
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from datetime import datetime
import json

# Import ML modules (will be implemented)
# from ml_engine.resume_parser import parse_resume
# from ml_engine.skill_extractor import extract_skills, categorize_skills
# from ml_engine.job_matcher import match_jobs
# from ml_engine.skill_gap_analyzer import analyze_skill_gap
# from ml_engine.roadmap_generator import generate_learning_roadmap

# ============= CONFIGURATION =============
app = Flask(__name__)

# CORS Configuration - Allow frontend to communicate
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8000", "http://localhost:5000", "http://127.0.0.1:8000", "http://127.0.0.1:5000"],
        "methods": ["GET", "POST", "OPTIONS", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# App Configuration
app.config['DEBUG'] = os.getenv('DEBUG', 'True').lower() == 'true'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'careerai-dev-key-change-in-production')
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max upload
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')

# Create upload folder
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ============= MOCK DATA (Replace with DB later) =============
users_db = {}  # {email: {password, name, etc}}
sessions_db = {}  # {token: {user_email, timestamp}}


# ============= UTILITY FUNCTIONS =============
def generate_token(email):
    """Generate simple auth token"""
    import hashlib
    return hashlib.md5(f"{email}{datetime.now()}".encode()).hexdigest()


def mock_analyze_resume(file_path, target_role=None):
    """Mock resume analysis - replace with real ML later"""
    # In production: parse PDF, extract skills with NLP
    return {
        'skills_detected': ['Python', 'JavaScript', 'SQL', 'React', 'Project Management'],
        'skills_categorized': {
            'Technical': ['Python', 'JavaScript', 'SQL', 'React'],
            'Soft Skills': ['Project Management', 'Communication']
        },
        'job_matches': [
            {
                'title': 'Backend Developer',
                'level': 'Mid-level',
                'match_score': 78,
                'description': 'Build scalable APIs and services',
                'required_skills': ['Python', 'SQL', 'APIs', 'System Design']
            },
            {
                'title': 'Full Stack Developer',
                'level': 'Mid-level',
                'match_score': 72,
                'description': 'Work on both frontend and backend',
                'required_skills': ['JavaScript', 'Python', 'React', 'SQL']
            }
        ],
        'skill_gaps': {
            'readiness_score': 78,
            'gap_percentage': 22,
            'matched_skills': ['Python', 'JavaScript', 'SQL'],
            'missing_skills': ['System Design', 'APIs', 'Docker', 'Kubernetes']
        },
        'learning_roadmap': [
            {
                'week': 'Week 1',
                'skill': 'API Design Fundamentals',
                'course': 'REST API Design Best Practices',
                'difficulty': 'Intermediate',
                'duration': '8 hours',
                'tasks': ['Learn HTTP concepts', 'Design simple API', 'Practice with Postman']
            },
            {
                'week': 'Week 2',
                'skill': 'Database Optimization',
                'course': 'Advanced SQL Patterns',
                'difficulty': 'Intermediate',
                'duration': '10 hours',
                'tasks': ['Learn query optimization', 'Practice indexing', 'Study transactions']
            }
        ]
    }


# ============= HEALTH & STATUS =============
@app.route('/', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'message': 'Welcome to CareerAI!',
        'status': 'Backend is running',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/health', methods=['GET'])
def api_health():
    """API health check"""
    return jsonify({'status': 'ok', 'service': 'careerAI-api'}), 200


# ============= AUTHENTICATION ENDPOINTS =============
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register new user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'error': 'Missing required fields: email, password, name'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        name = data['name'].strip()
        
        # Basic validation
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        if email in users_db:
            return jsonify({'error': 'User already exists'}), 409
        
        # Store user (in production: hash password with bcrypt)
        users_db[email] = {
            'password': password,  # TODO: Hash this!
            'name': name,
            'created_at': datetime.now().isoformat(),
            'resume': None
        }
        
        # Generate token
        token = generate_token(email)
        sessions_db[token] = {'user_email': email, 'created_at': datetime.now().isoformat()}
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'user': {'email': email, 'name': name},
            'token': token
        }), 201
    
    except Exception as e:
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Missing email or password'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Check user exists (TODO: verify password hash)
        if email not in users_db or users_db[email]['password'] != password:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate token
        token = generate_token(email)
        sessions_db[token] = {'user_email': email, 'created_at': datetime.now().isoformat()}
        
        user = users_db[email]
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'email': email,
                'name': user['name']
            },
            'token': token
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if token in sessions_db:
            del sessions_db[token]
        
        return jsonify({'success': True, 'message': 'Logged out successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': f'Logout failed: {str(e)}'}), 500


@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Get current user info"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if token not in sessions_db:
            return jsonify({'error': 'Unauthorized'}), 401
        
        user_email = sessions_db[token]['user_email']
        user = users_db.get(user_email)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'email': user_email,
            'name': user['name'],
            'created_at': user['created_at']
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Failed to fetch user: {str(e)}'}), 500


# ============= RESUME & ANALYSIS ENDPOINTS =============
@app.route('/api/resume/upload', methods=['POST'])
def upload_resume():
    """Upload and analyze resume"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if token not in sessions_db:
            return jsonify({'error': 'Unauthorized'}), 401
        
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Get target role if provided
        target_role = request.form.get('target_role', 'Data Scientist')
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filename = timestamp + filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Analyze resume
        analysis = mock_analyze_resume(file_path, target_role)
        
        # Store resume path for user
        user_email = sessions_db[token]['user_email']
        users_db[user_email]['resume'] = {
            'filename': filename,
            'target_role': target_role,
            'analysis': analysis,
            'uploaded_at': datetime.now().isoformat()
        }
        
        # Clean up uploaded file
        os.remove(file_path)
        
        return jsonify({
            'success': True,
            'message': 'Resume analyzed successfully',
            'data': analysis
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500


@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    """Main analyze endpoint (for compatibility)"""
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        target_role = request.form.get('target_role', 'Data Scientist')
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Analyze resume
        analysis = mock_analyze_resume(file_path, target_role)
        
        # Clean up
        os.remove(file_path)
        
        return jsonify({
            'success': True,
            **analysis,
            'total_skills': len(analysis['skills_detected']),
            'top_match_score': analysis['job_matches'][0]['match_score'] if analysis['job_matches'] else 0
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500


@app.route('/api/resume/<resume_id>', methods=['GET'])
def get_resume(resume_id):
    """Get specific resume analysis"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if token not in sessions_db:
            return jsonify({'error': 'Unauthorized'}), 401
        
        user_email = sessions_db[token]['user_email']
        user = users_db.get(user_email)
        
        if not user or not user.get('resume'):
            return jsonify({'error': 'Resume not found'}), 404
        
        return jsonify({
            'success': True,
            'data': user['resume']
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Failed to fetch resume: {str(e)}'}), 500


# ============= ERROR HANDLERS =============
@app.errorhandler(404)
def not_found(error):
    """404 error handler"""
    return jsonify({'error': 'Endpoint not found', 'status': 404}), 404


@app.errorhandler(500)
def internal_error(error):
    """500 error handler"""
    return jsonify({'error': 'Internal server error', 'status': 500}), 500


# ============= MAIN =============
if __name__ == '__main__':
    print("=" * 60)
    print("🚀 CareerAI Backend Started")
    print("=" * 60)
    print(f"Server: http://0.0.0.0:5000")
    print(f"API Docs: http://localhost:5000/")
    print(f"Debug: {app.config['DEBUG']}")
    print("=" * 60)
    
    app.run(
        debug=app.config['DEBUG'],
        host='0.0.0.0',
        port=5000
    )
