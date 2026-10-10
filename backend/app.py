from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from config import Config

# Import ML modules
from ml_engine.resume_parser import parse_resume
from ml_engine.skill_extractor import extract_skills, categorize_skills
from ml_engine.job_matcher import match_jobs
from ml_engine.skill_gap_analyzer import analyze_skill_gap
from ml_engine.roadmap_generator import generate_learning_roadmap

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Create upload folder
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ============= HEALTH CHECK =============

@app.route('/')
def home():
    return jsonify({
        'message': 'CareerAI Platform API',
        'status': 'running',
        'version': '1.0.0'
    }), 200

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'}), 200

# ============= MAIN ANALYZE ENDPOINT =============

@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    """Main endpoint: Upload resume and get full analysis"""
    
    # Check if file exists
    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file provided'}), 400
    
    file = request.files['resume']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed. Use PDF, DOC, DOCX, or TXT'}), 400
    
    try:
        # Save file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Parse resume
        resume_text = parse_resume(file_path)
        
        if not resume_text:
            return jsonify({'error': 'Could not parse resume file'}), 400
        
        # Extract skills
        extracted_skills = extract_skills(resume_text)
        categorized = categorize_skills(extracted_skills)
        
        # Match jobs
        job_matches = match_jobs(extracted_skills)
        
        # Analyze skill gaps (against top matched job)
        skill_gaps = None
        roadmap = None
        
        if job_matches:
            target_skills = job_matches[0]['required_skills']
            skill_gaps = analyze_skill_gap(extracted_skills, target_skills)
            roadmap = generate_learning_roadmap(skill_gaps['missing_skills'])
        
        # Cleanup
        os.remove(file_path)
        
        return jsonify({
            'success': True,
            'resume_text': resume_text[:300] + '...',
            'skills_detected': extracted_skills,
            'skills_categorized': categorized,
            'job_matches': job_matches,
            'skill_gaps': skill_gaps,
            'learning_roadmap': roadmap,
            'total_skills': len(extracted_skills),
            'top_match_score': job_matches[0]['match_score'] if job_matches else 0
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

# ============= ERROR HANDLERS =============

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(
        debug=app.config['DEBUG'],
        host=app.config.get('HOST', '0.0.0.0'),
        port=int(app.config.get('PORT', 5000))
    )
