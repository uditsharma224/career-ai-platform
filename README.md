# 🚀 CareerAI - Your AI Career Companion

<div align="center">

**AI-powered platform that analyzes student resumes, identifies skill gaps, matches job roles, and generates personalized career learning roadmaps.**

[Live Demo](#) • [Documentation](#getting-started) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## 📌 Overview

CareerAI is an intelligent career guidance platform designed for students and job seekers. Upload your resume, and our AI will:

- 📄 **Extract your skills & experience** from your resume
- 🎯 **Analyze skill gaps** for your dream job roles  
- 🗺️ **Generate personalized learning roadmaps** to bridge the gap
- 💼 **Match relevant job opportunities** based on your profile

Whether you're exploring career options or preparing for a specific role, CareerAI provides data-driven insights to accelerate your career growth.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📤 **Resume Upload** | Simple drag-and-drop resume upload (PDF support) |
| 🤖 **AI Skill Analysis** | Automatically extracts skills from your resume |
| 🔍 **Skill Gap Detection** | Identifies missing skills for target roles |
| 📚 **Learning Roadmap** | Personalized step-by-step learning path |
| 💼 **Job Matching** | Matches you with relevant job opportunities |
| 📊 **Career Dashboard** | Track progress and manage multiple profiles |
| 🎨 **Responsive UI** | Works seamlessly on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and animations
- **JavaScript (ES6+)** - Interactive UI and client-side logic
- **Responsive Design** - Mobile-first approach

### Backend
- **Python 3.9+** - Core language
- **FastAPI** - Modern async web framework
- **Uvicorn** - ASGI server
- **PyPDF2** / **pdfplumber** - PDF parsing (planned)
- **OpenAI API** / **Hugging Face** - AI capabilities (planned)

### Development
- **Git & GitHub** - Version control
- **Virtual Environment** - Python dependency isolation

---

## 📁 Project Structure

```
career-ai-platform/
│
├── 📄 README.md                    # Project documentation
├── 📄 .gitignore                   # Git ignore rules
├── 📄 requirements.txt             # Python dependencies
├── 📄 .env.example                 # Environment variables template
│
├── 🐍 backend/
│   ├── main.py                     # FastAPI application entry point
│   ├── config.py                   # Configuration settings
│   ├── requirements.txt            # Backend dependencies
│   │
│   ├── routes/
│   │   ├── auth.py                 # Authentication endpoints
│   │   ├── resume.py               # Resume upload & analysis
│   │   └── recommendations.py      # Learning roadmap generation
│   │
│   ├── services/
│   │   ├── resume_parser.py        # Resume parsing logic
│   │   ├── skill_analyzer.py       # Skill extraction & analysis
│   │   └── recommendation_engine.py # Roadmap generation
│   │
│   └── models/
│       ├── user.py                 # User database model
│       └── skill.py                # Skill database model
│
├── 🎨 frontend/
│   ├── index.html                  # Landing page
│   ├── dashboard.html              # User dashboard
│   ├── login.html                  # Login page
│   ├── signup.html                 # Registration page
│   ├── profile.html                # User profile page
│   ├── roadmap.html                # Learning roadmap display
│   │
│   ├── css/
│   │   ├── style.css               # Main stylesheet
│   │   ├── dashboard.css           # Dashboard specific styles
│   │   └── responsive.css          # Mobile responsive styles
│   │
│   └── js/
│       ├── script.js               # Main JavaScript
│       ├── api-client.js           # Backend API communication
│       ├── resume-handler.js       # Resume upload logic
│       └── utils.js                # Utility functions
│
└── 📋 docs/
    ├── API.md                      # API documentation
    ├── SETUP.md                    # Detailed setup guide
    └── CONTRIBUTING.md             # Contribution guidelines
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start (5 minutes)

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/uditsharma224/career-ai-platform.git
cd career-ai-platform
```

#### 2️⃣ Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3️⃣ Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# (Add API keys, database URL, etc.)
```

#### 4️⃣ Run Backend Server

```bash
# From backend directory with venv activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend running at: `http://localhost:8000`

#### 5️⃣ Run Frontend

**Option A: Simple HTTP Server**
```bash
cd ../frontend
python -m http.server 8000
```

**Option B: Live Server (if using VS Code)**
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

✅ Frontend available at: `http://localhost:8000` (or as shown in your server)

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Health Check
```http
GET /
```
Response:
```json
{
  "message": "Welcome to CareerAI!",
  "status": "Backend is running"
}
```

#### User Authentication (Coming Soon)
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

#### Resume Processing (Coming Soon)
```http
POST /api/resume/upload
GET /api/resume/{resume_id}
DELETE /api/resume/{resume_id}
```

#### Skill Analysis (Coming Soon)
```http
POST /api/analyze/skills
GET /api/analyze/report/{resume_id}
```

#### Recommendations (Coming Soon)
```http
POST /api/recommendations/roadmap
GET /api/recommendations/{user_id}
```

Full API documentation: [See API.md](./docs/API.md)

---

## 💻 Development

### Project Setup for Development

```bash
# Install development dependencies
pip install -r requirements.txt
pip install pytest pytest-cov black flake8

# Format code
black backend/

# Run linter
flake8 backend/

# Run tests
pytest backend/tests/
```

### File Structure During Development

- **Create feature branches**: `git checkout -b feature/feature-name`
- **Follow naming conventions**: `components`, `services`, `models`
- **Write tests** for new features
- **Update documentation** as you go

---

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Landing page & UI design
- [x] Basic authentication setup
- [ ] Resume upload functionality
- [ ] PDF parsing & text extraction

### Phase 2: AI Integration
- [ ] Skill extraction using NLP
- [ ] Job role matching
- [ ] Skill gap analysis
- [ ] Learning resource recommendations

### Phase 3: Enhanced Features
- [ ] Personalized learning dashboard
- [ ] Career progress tracking
- [ ] Interview preparation module
- [ ] Networking suggestions

### Phase 4: Production Ready
- [ ] Database integration (PostgreSQL)
- [ ] User authentication (JWT)
- [ ] Deployment (Docker, Heroku/AWS)
- [ ] Performance optimization
- [ ] Security audit & hardening

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Steps to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow PEP 8 (Python) and standard CSS/JS conventions
- Write meaningful commit messages
- Add tests for new features
- Update README if needed
- Be respectful and constructive in discussions

---

## 📝 License

This project is currently **unlicensed**. Please contact the repository owner before using it in production or redistributing.

---

## 👤 Author

**Udit Sharma**  
GitHub: [@uditsharma224](https://github.com/uditsharma224)

---

## 🙏 Acknowledgments

- Built with ❤️ for students and career seekers
- Inspired by the need for data-driven career guidance
- Thanks to all contributors and supporters

---

## 📧 Support & Contact

- 📋 Create an [Issue](https://github.com/uditsharma224/career-ai-platform/issues) for bugs
- 💡 Start a [Discussion](https://github.com/uditsharma224/career-ai-platform/discussions) for ideas
- 🌐 Visit the [Repository](https://github.com/uditsharma224/career-ai-platform)

---

<div align="center">

**Made with ❤️ by Udit Sharma**

⭐ If this project helped you, please consider giving it a star!

</div>
