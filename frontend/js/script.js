/**
 * CareerAI Frontend - Main Application Script
 * Handles: Authentication, Dashboard, Resume Upload
 * API: http://localhost:5000
 */

// ============= CONFIGURATION =============
const API_BASE_URL = 'http://localhost:5000';
let currentToken = localStorage.getItem('careerai_token');
let currentUser = JSON.parse(localStorage.getItem('careerai_user') || 'null');

// ============= UTILITY FUNCTIONS =============
/**
 * Make authenticated API call
 */
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(currentToken && { 'Authorization': `Bearer ${currentToken}` })
    }
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Upload file with FormData
 */
async function uploadFile(endpoint, file, additionalData = {}) {
  const formData = new FormData();
  formData.append('resume', file);

  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(currentToken && { 'Authorization': `Bearer ${currentToken}` })
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Upload Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  return !!currentToken && !!currentUser;
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

/**
 * Show message to user
 */
function showMessage(elementId, message, type = 'info') {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
    messageEl.style.display = 'block';
  }
}

/**
 * Clear message
 */
function clearMessage(elementId) {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.textContent = '';
    messageEl.style.display = 'none';
  }
}

/**
 * Set loading state
 */
function setLoading(buttonId, isLoading, originalText = 'Submit') {
  const button = document.getElementById(buttonId);
  if (button) {
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = '⏳ Processing...';
    } else {
      button.disabled = false;
      button.innerHTML = originalText;
    }
  }
}


// ============= LOGIN PAGE =============
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const signupForm = document.getElementById('signup-form');
  
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  // Dashboard initialization
  if (document.getElementById('dashboard-page')) {
    requireAuth();
    initializeDashboard();
  }

  // Index page - add login redirect
  if (document.getElementById('analyzeBtn')) {
    document.getElementById('analyzeBtn').addEventListener('click', (e) => {
      e.preventDefault();
      if (!isAuthenticated()) {
        alert('Please login first');
        window.location.href = 'login.html';
      }
    });
  }
});


// ============= LOGIN HANDLER =============
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const messageEl = document.getElementById('login-message');

  clearMessage('login-message');

  if (!email || !password) {
    showMessage('login-message', '❌ Please fill in both fields', 'error');
    return;
  }

  setLoading('login-form', true, 'Log in');

  try {
    const response = await apiCall('/api/auth/login', 'POST', { email, password });

    if (response.success) {
      // Store auth data
      localStorage.setItem('careerai_token', response.token);
      localStorage.setItem('careerai_user', JSON.stringify(response.user));

      currentToken = response.token;
      currentUser = response.user;

      showMessage('login-message', '✅ Login successful. Redirecting...', 'success');
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } else {
      showMessage('login-message', '❌ ' + (response.error || 'Login failed'), 'error');
    }
  } catch (error) {
    showMessage('login-message', '❌ ' + error.message, 'error');
  } finally {
    setLoading('login-form', false, 'Log in');
  }
}


// ============= SIGNUP HANDLER =============
async function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const messageEl = document.getElementById('signup-message');

  clearMessage('signup-message');

  if (!name || !email || !password) {
    showMessage('signup-message', '❌ Please fill in all fields', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('signup-message', '❌ Password must be at least 6 characters', 'error');
    return;
  }

  setLoading('signup-form', true, 'Create account');

  try {
    const response = await apiCall('/api/auth/register', 'POST', { name, email, password });

    if (response.success) {
      // Store auth data
      localStorage.setItem('careerai_token', response.token);
      localStorage.setItem('careerai_user', JSON.stringify(response.user));

      currentToken = response.token;
      currentUser = response.user;

      showMessage('signup-message', '✅ Account created! Redirecting...', 'success');
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } else {
      showMessage('signup-message', '❌ ' + (response.error || 'Signup failed'), 'error');
    }
  } catch (error) {
    showMessage('signup-message', '❌ ' + error.message, 'error');
  } finally {
    setLoading('signup-form', false, 'Create account');
  }
}


// ============= DASHBOARD INITIALIZATION =============
function initializeDashboard() {
  // Update user info
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const welcomeTitle = document.getElementById('welcome-title');
  const avatar = document.getElementById('user-avatar');

  if (currentUser && currentUser.name) {
    const firstName = currentUser.name.split(' ')[0];
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    welcomeTitle.textContent = `Welcome back, ${firstName}`;
    avatar.textContent = currentUser.name.charAt(0).toUpperCase();
  }

  // Setup event listeners
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  const resumeForm = document.getElementById('resume-form');
  if (resumeForm) {
    resumeForm.addEventListener('submit', handleResumeUpload);
  }

  const seedBtn = document.getElementById('seed-btn');
  if (seedBtn) {
    seedBtn.addEventListener('click', loadSampleData);
  }
}


// ============= RESUME UPLOAD HANDLER =============
async function handleResumeUpload(event) {
  event.preventDefault();

  const fileInput = document.getElementById('resume-file');
  const targetRole = document.getElementById('target-role').value;

  if (!fileInput.files.length) {
    alert('❌ Please select a resume file');
    return;
  }

  const file = fileInput.files[0];

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  if (!allowedTypes.includes(file.type)) {
    alert('❌ Please upload a PDF, DOC, DOCX, or TXT file');
    return;
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    alert('❌ File size exceeds 10MB limit');
    return;
  }

  try {
    // Show loading state
    const submitBtn = document.querySelector('#resume-form .btn-primary');
    const originalText = submitBtn.textContent;
    setLoading('resume-form', true);

    // Upload resume
    const response = await uploadFile('/api/resume/upload', file, { target_role: targetRole });

    if (response.success) {
      // Update UI with results
      displayAnalysisResults(response.data, targetRole);
      alert(`✅ Resume analyzed for ${targetRole}`);
    } else {
      alert('❌ ' + (response.error || 'Analysis failed'));
    }
  } catch (error) {
    alert('❌ ' + error.message);
  } finally {
    // Reset button
    const submitBtn = document.querySelector('#resume-form .btn-primary');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Analyze resume';
  }
}


// ============= DISPLAY ANALYSIS RESULTS =============
function displayAnalysisResults(data, targetRole) {
  // Update detected skills
  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = '';
  if (data.skills_detected && Array.isArray(data.skills_detected)) {
    data.skills_detected.forEach(skill => {
      const skillEl = document.createElement('span');
      skillEl.className = 'skill';
      skillEl.textContent = skill;
      skillsList.appendChild(skillEl);
    });
  }

  // Update match score
  if (data.job_matches && data.job_matches.length > 0) {
    document.getElementById('match-score').textContent = data.job_matches[0].match_score + '%';
  }

  // Update skills count
  if (data.skills_detected) {
    document.getElementById('skills-count').textContent = data.skills_detected.length;
  }

  // Update roadmap
  const roadmapList = document.getElementById('roadmap-list');
  roadmapList.innerHTML = '';
  if (data.learning_roadmap && Array.isArray(data.learning_roadmap)) {
    data.learning_roadmap.forEach(item => {
      const roadmapEl = document.createElement('div');
      roadmapEl.className = 'roadmap-item';
      roadmapEl.innerHTML = `
        <span class="phase">Phase ${item.week.includes('Week') ? item.week.split(' ')[1] : 'X'}</span>
        <h3>${item.skill}</h3>
        <p>${item.course}</p>
        <div class="meta-row">
          <span>📚 ${item.duration}</span>
          <span>📊 ${item.difficulty}</span>
        </div>
      `;
      roadmapList.appendChild(roadmapEl);
    });
  }

  document.getElementById('roadmap-count').textContent = data.learning_roadmap ? data.learning_roadmap.length : '0';
}


// ============= LOAD SAMPLE DATA =============
function loadSampleData() {
  const targetRole = document.getElementById('target-role').value;
  
  // Mock data
  const sampleData = {
    'Data Scientist': {
      skills_detected: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'],
      job_matches: [{ match_score: 78 }],
      learning_roadmap: [
        { week: 'Week 1', skill: 'Python Fundamentals', course: 'Learn Python basics', duration: '20 hours', difficulty: 'Beginner' },
        { week: 'Week 2', skill: 'SQL & Databases', course: 'Master SQL queries', duration: '18 hours', difficulty: 'Intermediate' },
        { week: 'Week 3', skill: 'Machine Learning', course: 'ML algorithms', duration: '25 hours', difficulty: 'Advanced' }
      ]
    },
    'Frontend Developer': {
      skills_detected: ['HTML', 'CSS', 'JavaScript', 'React', 'UI/UX'],
      job_matches: [{ match_score: 85 }],
      learning_roadmap: [
        { week: 'Week 1', skill: 'HTML & CSS', course: 'Web fundamentals', duration: '15 hours', difficulty: 'Beginner' },
        { week: 'Week 2', skill: 'JavaScript', course: 'JS essentials', duration: '20 hours', difficulty: 'Intermediate' },
        { week: 'Week 3', skill: 'React', course: 'React framework', duration: '22 hours', difficulty: 'Advanced' }
      ]
    },
    'Backend Developer': {
      skills_detected: ['Python', 'APIs', 'Databases', 'System Design', 'Testing'],
      job_matches: [{ match_score: 82 }],
      learning_roadmap: [
        { week: 'Week 1', skill: 'API Design', course: 'REST APIs', duration: '18 hours', difficulty: 'Intermediate' },
        { week: 'Week 2', skill: 'Databases', course: 'SQL & NoSQL', duration: '20 hours', difficulty: 'Intermediate' },
        { week: 'Week 3', skill: 'System Design', course: 'Scalable systems', duration: '25 hours', difficulty: 'Advanced' }
      ]
    }
  };

  const data = sampleData[targetRole] || sampleData['Data Scientist'];
  displayAnalysisResults(data, targetRole);
  alert(`✅ Sample data loaded for ${targetRole}`);
}


// ============= LOGOUT HANDLER =============
async function handleLogout() {
  try {
    await apiCall('/api/auth/logout', 'POST');
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Clear local storage
  localStorage.removeItem('careerai_token');
  localStorage.removeItem('careerai_user');

  currentToken = null;
  currentUser = null;

  // Redirect to home
  window.location.href = 'index.html';
}
