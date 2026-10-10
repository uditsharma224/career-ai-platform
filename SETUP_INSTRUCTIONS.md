# 🚀 CareerAI Platform - Setup & Run Guide

## ✅ What Was Fixed

1. **Backend Consolidation**: Flask now handles all routes (removed confusing FastAPI conflict)
2. **CORS Configuration**: Frontend and backend can now communicate
3. **Authentication**: Proper login/logout with token-based auth
4. **Resume Upload**: Connected to backend API with analysis
5. **Dashboard**: Now properly loads user data after login

---

## 📋 Prerequisites

- Python 3.9+
- pip (Python package manager)
- Git
- Modern web browser (Chrome, Firefox, Edge)
- Two terminal windows (one for backend, one for frontend)

---

## 🔧 Setup Backend (Terminal 1)

### Step 1: Navigate to backend
```bash
cd backend
```

### Step 2: Create virtual environment
```bash
python -m venv venv
```

### Step 3: Activate virtual environment
**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

### Step 4: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Create .env file (optional)
```bash
cp .env.example .env
# Edit .env if needed (defaults are fine for local development)
```

### Step 6: Run backend
```bash
python main.py
```

**Expected output:**
```
============================================================
🚀 CareerAI Backend Started
============================================================
Server: http://0.0.0.0:5000
API Docs: http://localhost:5000/
Debug: True
============================================================
```

✅ **Backend is now running at http://localhost:5000**

---

## 🎨 Setup Frontend (Terminal 2)

### Step 1: Navigate to frontend
```bash
cd frontend
```

### Step 2: Run simple HTTP server
**Option A: Python (Recommended)**
```bash
python -m http.server 8000
```

**Option B: Node.js (if you have it)**
```bash
npx http-server -p 8000
```

**Option C: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

**Expected output:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

✅ **Frontend is now running at http://localhost:8000**

---

## 🧪 Testing the Application

### 1. **Test Health Check**
Open browser and go to: http://localhost:5000/
```json
{
  "message": "Welcome to CareerAI!",
  "status": "Backend is running",
  "version": "1.0.0"
}
```

### 2. **Test Frontend**
Open browser and go to: http://localhost:8000/
- You should see the landing page

### 3. **Test Complete Flow**
1. Click "Login" or go to http://localhost:8000/login.html
2. **No account yet?** Click "Create an account" to signup first
3. Register with:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. You should be logged in and redirected to dashboard
5. On dashboard, select a target role and click "Use sample data"
6. You should see skills and roadmap populate

---

## 🔍 Common Issues & Fixes

### ❌ Issue: "CORS error - Request blocked"
**Cause**: Frontend and backend not communicating
**Fix**: 
- Ensure backend is running on port 5000
- Ensure frontend is running on port 8000
- Check browser console for specific error

### ❌ Issue: "API_BASE_URL is not reachable"
**Cause**: Backend crashed or not running
**Fix**:
- Check Terminal 1 (backend)
- Run `python main.py` again
- Look for error messages

### ❌ Issue: "Login always fails"
**Cause**: Password validation
**Fix**:
- Password must be minimum 6 characters
- Use: `password123` (12 characters, safe)

### ❌ Issue: "Resume file upload doesn't work"
**Cause**: File type or size
**Fix**:
- Use PDF, DOC, DOCX, or TXT files only
- File size must be under 10MB
- Or use "Use sample data" button

### ❌ Issue: "Dashboard shows blank after login"
**Cause**: Browser caching
**Fix**:
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache

---

## 📊 API Endpoints Reference

### Authentication
```
POST   /api/auth/register          - Create new account
POST   /api/auth/login              - Login user
POST   /api/auth/logout             - Logout user
GET    /api/auth/me                 - Get current user info
```

### Resume
```
POST   /api/resume/upload           - Upload & analyze resume
GET    /api/resume/<id>             - Get resume analysis
POST   /api/analyze                 - Quick analysis (no auth needed)
```

### Health
```
GET    /                            - Health check
GET    /api/health                  - API health check
```

---

## 🚀 Next Steps

### To make this production-ready:

1. **Database** (PostgreSQL)
   - Replace `users_db` and `sessions_db` dicts with SQLAlchemy models
   - File: `backend/main.py` lines 53-54

2. **Password Hashing**
   - Use `bcrypt` instead of storing plain text
   - File: `backend/main.py` lines 130, 180

3. **JWT Tokens**
   - Replace simple MD5 tokens with PyJWT
   - Add expiration time

4. **Resume Parsing**
   - Replace mock analysis with real NLP using:
     - PyPDF2 for PDF extraction
     - spaCy or NLTK for skill detection
     - File: `backend/main.py` line 65

5. **Frontend Build**
   - Use Node.js + npm for asset bundling
   - Add webpack/Vite for optimization

6. **Deployment**
   - Use Docker for containerization
   - Deploy on Heroku, AWS, or DigitalOcean

---

## 📞 Troubleshooting

If something doesn't work:

1. **Check both terminals** - Is backend running? Is frontend running?
2. **Check browser console** - Open DevTools (F12) → Console tab
3. **Check backend console** - Look for error messages in Terminal 1
4. **Try fresh setup** - Delete `venv`, run setup steps again
5. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)

---

## ✨ That's it! 

Your CareerAI platform should now be:
- ✅ Properly authenticated
- ✅ Frontend-backend connected  
- ✅ Resume analysis working
- ✅ Data persisting in session
- ✅ Professional and functional

Happy coding! 🎉
