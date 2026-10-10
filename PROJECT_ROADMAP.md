# Career AI Platform - Complete Development Roadmap

## 🎯 Project Overview
**AI-Powered Student Career & Skill Intelligence Platform**
- Resume Analysis (AI-powered skill extraction)
- Job Role Matching (ML-based recommendations)
- Skill Gap Analysis (Data-driven insights)
- Personalized Learning Roadmap (Adaptive recommendations)

---

## 📋 Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla + Chart.js)
- **Backend**: Python (Flask/FastAPI)
- **Database**: PostgreSQL / SQLite
- **ML/AI**: Scikit-learn, spaCy, TF-IDF, Pandas, NumPy
- **Deployment**: Render.com
- **Version Control**: GitHub

---

## 🏗️ Project Structure

```
career-ai-platform/
│
├── backend/
│   ├── app.py                    # Main Flask app
│   ├── requirements.txt          # Python dependencies
│   ├── config.py                 # DB & app config
│   │
│   ├── models/
│   │   ├── database.py           # SQLAlchemy models
│   │   ├── user.py
│   │   ├── resume.py
│   │   ├── skill.py
│   │   └── job_role.py
│   │
│   ├── ml_engine/
│   │   ├── resume_parser.py      # Extract text from PDF/DOCX
│   │   ├── skill_extractor.py    # NLP-based skill extraction
│   │   ├── job_matcher.py        # ML-based job matching
│   │   ├── skill_gap_analyzer.py # Gap analysis engine
│   │   ├── roadmap_generator.py  # Learning path generator
│   │   └── vectorizer.py         # TF-IDF & embeddings
│   │
│   ├── api/
│   │   ├── auth.py               # Login/Register endpoints
│   │   ├── resume.py             # Resume upload/analysis endpoints
│   │   ├── jobs.py               # Job matching endpoints
│   │   ├── skills.py             # Skill-related endpoints
│   │   └── roadmap.py            # Roadmap endpoints
│   │
│   ├── data/
│   │   ├── job_roles.csv         # Job role database
│   │   ├── skills_taxonomy.csv   # Skill taxonomy
│   │   └── courses.csv           # Course/resource database
│   │
│   └── utils/
│       ├── file_handler.py       # File upload handling
│       └── logger.py             # Logging utility
│
├── frontend/
│   ├── index.html                # Main page
│   ├── dashboard.html            # User dashboard
│   ├── upload.html               # Resume upload
│   ├── results.html              # Analysis results
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── app.js                # Main app logic
│   │   ├── api.js                # API calls
│   │   ├── chart.js              # Chart visualization
│   │   ├── auth.js               # Authentication
│   │   └── utils.js              # Helper functions
│   │
│   └── assets/
│       └── (images, icons)
│
├── database/
│   └── schema.sql                # Database schema
│
├── .gitignore
├── README.md
├── requirements.txt              # Backend dependencies
└── Procfile                      # Render deployment config
```

---

## 🚀 Implementation Steps (4 Weeks)

### **WEEK 1: Setup + Database + Backend Skeleton**

#### Step 1.1: Initialize Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install flask flask-cors flask-sqlalchemy python-dotenv
pip install pandas numpy scikit-learn spacy pdfplumber python-docx
pip install gunicorn  # For Render deployment
```

#### Step 1.2: Create Database Schema
Database models:
- **Users** (id, email, password, name, created_at)
- **Resumes** (id, user_id, filename, extracted_text, parsed_skills, created_at)
- **Skills** (id, name, category, proficiency_level)
- **UserSkills** (id, user_id, skill_id, years_of_experience)
- **JobRoles** (id, title, required_skills, description, level)
- **LearningRoadmap** (id, user_id, target_role, skills_to_learn, status)

#### Step 1.3: Create Flask App Structure
```python
# backend/app.py
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# DB config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///career_ai.db'
db = SQLAlchemy(app)

# Import blueprints
from api import auth, resume, jobs, skills, roadmap

app.register_blueprint(auth.bp)
app.register_blueprint(resume.bp)
app.register_blueprint(jobs.bp)
app.register_blueprint(skills.bp)
app.register_blueprint(roadmap.bp)

if __name__ == '__main__':
    app.run(debug=True)
```

---

### **WEEK 2: Resume Parsing + Skill Extraction (AI Core)**

#### Step 2.1: Resume Parser
```python
# backend/ml_engine/resume_parser.py
import PyPDF2
from docx import Document

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text
```

#### Step 2.2: Skill Extraction Engine (NLP)
```python
# backend/ml_engine/skill_extractor.py
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

class SkillExtractor:
    def __init__(self):
        # Load pre-trained NLP model
        self.nlp = spacy.load("en_core_web_sm")
        # Load skill taxonomy
        self.skills_db = pd.read_csv('data/skills_taxonomy.csv')
        self.all_skills = self.skills_db['skill'].tolist()
    
    def extract_skills(self, resume_text):
        """Extract skills from resume text using NLP + pattern matching"""
        extracted_skills = []
        
        # Method 1: Exact keyword matching
        for skill in self.all_skills:
            if skill.lower() in resume_text.lower():
                extracted_skills.append(skill)
        
        # Method 2: NLP-based (noun chunks, entities)
        doc = self.nlp(resume_text)
        for token in doc.noun_chunks:
            if token.text.lower() in [s.lower() for s in self.all_skills]:
                if token.text not in extracted_skills:
                    extracted_skills.append(token.text)
        
        return extracted_skills
    
    def categorize_skills(self, skills):
        """Categorize skills into Technical, Soft, Domain"""
        categorized = {}
        for skill in skills:
            skill_info = self.skills_db[self.skills_db['skill'].str.lower() == skill.lower()]
            if not skill_info.empty:
                category = skill_info['category'].values[0]
                if category not in categorized:
                    categorized[category] = []
                categorized[category].append(skill)
        return categorized
```

#### Step 2.3: Skills Taxonomy CSV
```csv
# data/skills_taxonomy.csv
skill,category,level_required
Python,Technical - Programming,Intermediate
JavaScript,Technical - Programming,Intermediate
SQL,Technical - Database,Intermediate
React,Technical - Frontend,Intermediate
Machine Learning,Technical - AI/ML,Advanced
Data Analysis,Technical - Data Science,Intermediate
Communication,Soft Skills,Intermediate
Team Leadership,Soft Skills,Advanced
Problem Solving,Soft Skills,Intermediate
```

---

### **WEEK 3: Job Matching + Skill Gap Analysis**

#### Step 3.1: Job Matcher (ML-Based)
```python
# backend/ml_engine/job_matcher.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class JobMatcher:
    def __init__(self):
        self.job_roles = pd.read_csv('data/job_roles.csv')
        self.vectorizer = TfidfVectorizer()
    
    def match_jobs(self, candidate_skills, experience_level):
        """
        Match candidate to suitable job roles using ML
        Returns: List of jobs with match score
        """
        matches = []
        
        # Convert skills to text representation
        candidate_text = " ".join(candidate_skills)
        
        # Vectorize job descriptions
        job_texts = self.job_roles['required_skills'].tolist()
        all_texts = [candidate_text] + job_texts
        
        tfidf_matrix = self.vectorizer.fit_transform(all_texts)
        candidate_vector = tfidf_matrix[0]
        job_vectors = tfidf_matrix[1:]
        
        # Calculate similarity
        similarities = cosine_similarity(candidate_vector, job_vectors)[0]
        
        # Score and rank
        for idx, similarity_score in enumerate(similarities):
            job = self.job_roles.iloc[idx]
            
            # Boost score if experience level matches
            if job['level'] == experience_level:
                similarity_score *= 1.2
            
            matches.append({
                'job_title': job['title'],
                'match_score': round(similarity_score * 100, 2),
                'required_skills': job['required_skills'].split(','),
                'level': job['level'],
                'description': job['description']
            })
        
        # Sort by score
        matches = sorted(matches, key=lambda x: x['match_score'], reverse=True)
        return matches[:5]  # Top 5 matches
```

#### Step 3.2: Skill Gap Analyzer
```python
# backend/ml_engine/skill_gap_analyzer.py
class SkillGapAnalyzer:
    def analyze_gaps(self, candidate_skills, target_job_skills):
        """
        Analyze skill gaps between candidate and target job
        Returns: matched, missing, optional skills
        """
        candidate_set = set([s.lower() for s in candidate_skills])
        target_set = set([s.lower() for s in target_job_skills])
        
        matched_skills = candidate_set & target_set
        missing_skills = target_set - candidate_set
        optional_skills = candidate_set - target_set
        
        gap_score = len(matched_skills) / len(target_set) * 100
        
        return {
            'gap_percentage': round(100 - gap_score, 2),
            'matched_skills': list(matched_skills),
            'missing_skills': list(missing_skills),
            'optional_skills': list(optional_skills),
            'readiness_score': round(gap_score, 2)
        }
```

#### Step 3.3: Job Roles Database
```csv
# data/job_roles.csv
title,required_skills,description,level,salary_range
Frontend Developer,"HTML,CSS,JavaScript,React,REST API",Build user interfaces,Junior,30-50k
Backend Developer,"Python,SQL,API Design,System Design,Database",Build server-side logic,Junior,35-55k
Data Analyst,"SQL,Excel,Python,Data Visualization,Statistics",Analyze business data,Junior,40-60k
ML Engineer,"Python,Machine Learning,SQL,Deep Learning,Statistics",Build ML models,Senior,60-100k
Product Manager,"Leadership,Communication,Data Analysis,Strategy",Manage product roadmap,Mid,50-80k
```

---

### **WEEK 4: Learning Roadmap + Frontend Integration + Deployment**

#### Step 4.1: Roadmap Generator
```python
# backend/ml_engine/roadmap_generator.py
class RoadmapGenerator:
    def __init__(self):
        self.courses = pd.read_csv('data/courses.csv')
    
    def generate_roadmap(self, missing_skills, candidate_level, timeframe_weeks=8):
        """
        Generate personalized learning roadmap
        Returns: week-by-week plan with resources
        """
        roadmap = []
        weeks_per_skill = timeframe_weeks / len(missing_skills)
        
        for idx, skill in enumerate(missing_skills):
            # Find best resources for skill
            resources = self.courses[self.courses['skill'].str.lower() == skill.lower()]
            
            if len(resources) > 0:
                best_resource = resources.iloc[0]
                
                week_start = idx * weeks_per_skill + 1
                week_end = (idx + 1) * weeks_per_skill
                
                roadmap.append({
                    'skill': skill,
                    'week_start': int(week_start),
                    'week_end': int(week_end),
                    'duration_hours': best_resource['duration_hours'],
                    'course_name': best_resource['course_name'],
                    'resource_url': best_resource['url'],
                    'difficulty': best_resource['difficulty'],
                    'practice_project': best_resource['practice_project']
                })
        
        return roadmap
```

#### Step 4.2: Courses Database
```csv
# data/courses.csv
skill,course_name,platform,duration_hours,difficulty,url,practice_project
Python,Python for Beginners,Udemy,20,Beginner,https://udemy.com/...,Build a Calculator
React,React Basics,Udemy,15,Beginner,https://udemy.com/...,Build a Todo App
SQL,SQL Mastery,DataCamp,25,Intermediate,https://datacamp.com/...,Build a Database
Machine Learning,ML Fundamentals,Coursera,40,Intermediate,https://coursera.org/...,Predict House Prices
```

#### Step 4.3: Frontend - Upload Resume
```html
<!-- frontend/upload.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Resume - Career AI</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <div class="upload-section">
            <h1>📄 Upload Your Resume</h1>
            <p>Let our AI analyze your resume and find your perfect career path</p>
            
            <form id="resumeForm">
                <input type="file" id="resumeFile" accept=".pdf,.doc,.docx" required>
                <input type="text" id="targetRole" placeholder="Target Job Role (Optional)">
                <select id="experience" required>
                    <option value="">Select Experience Level</option>
                    <option value="Junior">Fresher / Junior</option>
                    <option value="Mid">Mid-Level</option>
                    <option value="Senior">Senior</option>
                </select>
                <button type="submit">Analyze Resume</button>
            </form>
            
            <div id="loading" style="display:none;">
                <p>🤖 AI is analyzing your resume...</p>
                <div class="progress-bar"></div>
            </div>
        </div>
    </div>
    
    <script src="js/api.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

#### Step 4.4: Frontend - Results & Visualization
```html
<!-- frontend/results.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Analysis Results - Career AI</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="results-container">
        <!-- Skills Extracted -->
        <section class="skill-section">
            <h2>🎯 Skills Detected</h2>
            <div id="skillsChart"></div>
            <div id="skillsList"></div>
        </section>
        
        <!-- Job Matching -->
        <section class="job-section">
            <h2>💼 Matched Job Roles</h2>
            <div id="jobMatches"></div>
        </section>
        
        <!-- Skill Gaps -->
        <section class="gap-section">
            <h2>📊 Skill Gap Analysis</h2>
            <div id="gapChart"></div>
            <div id="gapDetails"></div>
        </section>
        
        <!-- Learning Roadmap -->
        <section class="roadmap-section">
            <h2>🚀 Your 8-Week Learning Roadmap</h2>
            <div id="roadmap"></div>
        </section>
    </div>
    
    <script src="js/chart.js"></script>
    <script src="js/results.js"></script>
</body>
</html>
```

#### Step 4.5: API Endpoints
```python
# backend/api/resume.py
from flask import Blueprint, request, jsonify
from ml_engine.resume_parser import extract_text_from_pdf, extract_text_from_docx
from ml_engine.skill_extractor import SkillExtractor
from ml_engine.job_matcher import JobMatcher
from ml_engine.skill_gap_analyzer import SkillGapAnalyzer
from ml_engine.roadmap_generator import RoadmapGenerator

bp = Blueprint('resume', __name__, url_prefix='/api')

skill_extractor = SkillExtractor()
job_matcher = JobMatcher()
gap_analyzer = SkillGapAnalyzer()
roadmap_gen = RoadmapGenerator()

@bp.route('/analyze', methods=['POST'])
def analyze_resume():
    """Main endpoint: Upload resume and get full analysis"""
    try:
        file = request.files['resume']
        experience_level = request.form.get('experience')
        target_role = request.form.get('target_role', '')
        
        # 1. Extract text
        if file.filename.endswith('.pdf'):
            resume_text = extract_text_from_pdf(file)
        else:
            resume_text = extract_text_from_docx(file)
        
        # 2. Extract skills
        skills = skill_extractor.extract_skills(resume_text)
        categorized_skills = skill_extractor.categorize_skills(skills)
        
        # 3. Match jobs
        job_matches = job_matcher.match_jobs(skills, experience_level)
        
        # 4. Analyze gaps (for target role)
        gap_analysis = None
        roadmap = None
        if target_role or job_matches:
            target_skills = job_matches[0]['required_skills']
            gap_analysis = gap_analyzer.analyze_gaps(skills, target_skills)
            roadmap = roadmap_gen.generate_roadmap(gap_analysis['missing_skills'], experience_level)
        
        return jsonify({
            'success': True,
            'extracted_skills': categorized_skills,
            'job_matches': job_matches,
            'skill_gaps': gap_analysis,
            'learning_roadmap': roadmap
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
```

#### Step 4.6: Frontend API Handler
```javascript
// frontend/js/api.js
const API_BASE = 'https://your-render-app.onrender.com/api';

async function analyzeResume(formData) {
    try {
        const response = await fetch(`${API_BASE}/analyze`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data);
        } else {
            showError(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to analyze resume');
    }
}

function displayResults(data) {
    // Display skills
    displaySkills(data.extracted_skills);
    
    // Display job matches
    displayJobMatches(data.job_matches);
    
    // Display skill gaps
    if (data.skill_gaps) {
        displaySkillGaps(data.skill_gaps);
    }
    
    // Display roadmap
    if (data.learning_roadmap) {
        displayRoadmap(data.learning_roadmap);
    }
}
```

---

### **WEEK 4: Deployment on Render.com**

#### Step 4.7: Prepare for Deployment
```
# requirements.txt
Flask==2.3.0
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.0.5
python-dotenv==1.0.0
pandas==2.0.0
numpy==1.24.0
scikit-learn==1.2.0
spacy==3.5.0
PyPDF2==3.0.1
python-docx==0.8.11
gunicorn==20.1.0
```

```python
# Procfile
web: gunicorn app:app
```

#### Step 4.8: GitHub Push & Render Deploy
```bash
git add .
git commit -m "Initial project setup with ML engines"
git push origin main

# On Render.com:
# 1. Connect GitHub repo
# 2. Set environment variables
# 3. Deploy
```

---

## 📊 AI Integration Points

| Feature | AI/ML Technology | Why Real |
|---------|-----------------|----------|
| **Skill Extraction** | spaCy NLP + Keyword Matching + TF-IDF | Analyzes actual resume text, finds real skills |
| **Job Matching** | Cosine Similarity + TF-IDF Vectorization | Compares candidate skills against 50+ job profiles |
| **Skill Gap Analysis** | Set Theory + Scoring Algorithm | Calculates exact percentage of missing skills |
| **Roadmap Generation** | Rule-based + Database Lookup | Assigns real courses/projects with durations |

---

## ✅ Checklist

- [ ] Week 1: Backend setup + Database
- [ ] Week 2: Resume parser + Skill extractor working
- [ ] Week 3: Job matcher + Gap analyzer MVP
- [ ] Week 4: Roadmap generator + Frontend integration + Deploy
- [ ] Add authentication (Login/Register)
- [ ] Add user history (Save previous analyses)
- [ ] Add export functionality (PDF report)
- [ ] Improve UI/UX with charts
- [ ] Test end-to-end flow

---

## 🎯 Phase 2 (After MVP)

1. **Advanced NLP**: Use transformer models (BERT, Sentence-BERT)
2. **Resume Scoring**: Add overall resume quality score
3. **Real Job API**: Integrate with LinkedIn/Indeed API
4. **Skill Assessment**: Add skill tests/quizzes
5. **Mentor Matching**: Match students with mentors
6. **Interview Prep**: Add interview question generator

