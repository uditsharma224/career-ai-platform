// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// DOM Elements
const resumeForm = document.getElementById('resumeForm');
const resumeFile = document.getElementById('resumeFile');
const analyzeBtn = document.getElementById('analyzeBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const errorDiv = document.getElementById('error');
const fileLabel = document.querySelector('.file-label');

resumeForm.addEventListener('submit', handleFormSubmit);

resumeFile.addEventListener('change', function() {
    if (this.files.length > 0) {
        fileLabel.querySelector('.upload-text').textContent = this.files[0].name;
    }
});

fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = '#f07d4a';
    fileLabel.style.background = 'linear-gradient(135deg, #ffe4cc 0%, #ffd6b2 100%)';
});

fileLabel.addEventListener('dragleave', () => {
    fileLabel.style.borderColor = '#f59d6e';
    fileLabel.style.background = 'linear-gradient(135deg, #fff3eb 0%, #ffe4cc 100%)';
});

fileLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
        resumeFile.files = e.dataTransfer.files;
        fileLabel.querySelector('.upload-text').textContent = e.dataTransfer.files[0].name;
    }
});

async function handleFormSubmit(e) {
    e.preventDefault();
    errorDiv.style.display = 'none';

    if (!resumeFile.files.length) {
        showError('Please select a resume file');
        return;
    }

    if (resumeFile.files[0].size > 10 * 1024 * 1024) {
        showError('File size exceeds 10MB limit');
        return;
    }

    showLoading(true);

    try {
        const formData = new FormData();
        formData.append('resume', resumeFile.files[0]);

        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            displayResults(data);
        } else {
            showError(data.error || 'Analysis failed');
        }
    } catch (error) {
        showError(`Error: ${error.message}. Make sure backend is running on ${API_BASE_URL}`);
    } finally {
        showLoading(false);
    }
}

function displayResults(data) {
    displaySkills(data.skills_categorized, data.skills_detected);
    displayJobs(data.job_matches);
    if (data.skill_gaps) displayGaps(data.skill_gaps);
    if (data.learning_roadmap) displayRoadmap(data.learning_roadmap);
    results.style.display = 'block';
    window.scrollTo({ top: results.offsetTop - 100, behavior: 'smooth' });
}

function displaySkills(categorized, allSkills) {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = '';

    if (Object.keys(categorized).length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center;">No skills detected</p>';
        return;
    }

    for (const [category, skills] of Object.entries(categorized)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        categoryDiv.innerHTML = `<h4>${category}</h4>`;

        const skillsDiv = document.createElement('div');
        skillsDiv.className = 'skills-container';

        skills.forEach(skill => {
            const badge = document.createElement('div');
            badge.className = 'skill-badge';
            badge.textContent = skill;
            skillsDiv.appendChild(badge);
        });

        categoryDiv.appendChild(skillsDiv);
        container.appendChild(categoryDiv);
    }

    const totalDiv = document.createElement('div');
    totalDiv.style.cssText = 'margin-top: 20px; padding: 15px; background: #fff3eb; border-radius: 8px; text-align: center;';
    totalDiv.innerHTML = `<strong style="color: #f59d6e; font-size: 1.1em;">Total Skills Detected: ${allSkills.length}</strong>`;
    container.appendChild(totalDiv);
}

function displayJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    container.innerHTML = '';

    if (!jobs || jobs.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center;">No matching jobs found</p>';
        return;
    }

    jobs.forEach((job) => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="job-title">${job.title}</div>
            <div class="job-level">Level: ${job.level || 'Not specified'}</div>
            <div class="job-score">Match Score: ${job.match_score}%</div>
            <div class="job-description">${job.description}</div>
            <div class="job-skills">
                ${job.required_skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        `;
        container.appendChild(card);
    });
}

function displayGaps(gaps) {
    const container = document.getElementById('gapsContainer');
    container.innerHTML = '';

    const scoreCard = document.createElement('div');
    scoreCard.className = 'gap-stat';
    scoreCard.innerHTML = `
        <div class="gap-stat-label">Readiness Score</div>
        <div class="gap-stat-value">${gaps.readiness_score}%</div>
        <div class="score-bar">
            <div class="score-fill" style="width: ${gaps.readiness_score}%"></div>
        </div>
    `;
    container.appendChild(scoreCard);

    const gapCard = document.createElement('div');
    gapCard.className = 'gap-stat';
    gapCard.innerHTML = `
        <div class="gap-stat-label">Skill Gap</div>
        <div class="gap-stat-value">${gaps.gap_percentage}%</div>
        <p style="color: #6b7280; margin-top: 8px;">Skills you need to learn</p>
    `;
    container.appendChild(gapCard);

    if (gaps.matched_skills && gaps.matched_skills.length > 0) {
        const matchedDiv = document.createElement('div');
        matchedDiv.className = 'gap-skills-group';
        matchedDiv.innerHTML = `
            <div class="gap-skills-title">✅ Skills You Have (${gaps.matched_skills.length})</div>
            <div class="gap-skills-list">
                ${gaps.matched_skills.map(skill => `<span class="gap-skill matched">${skill}</span>`).join('')}
            </div>
        `;
        container.appendChild(matchedDiv);
    }

    if (gaps.missing_skills && gaps.missing_skills.length > 0) {
        const missingDiv = document.createElement('div');
        missingDiv.className = 'gap-skills-group';
        missingDiv.innerHTML = `
            <div class="gap-skills-title">🎯 Skills to Learn (${gaps.missing_skills.length})</div>
            <div class="gap-skills-list">
                ${gaps.missing_skills.map(skill => `<span class="gap-skill">${skill}</span>`).join('')}
            </div>
        `;
        container.appendChild(missingDiv);
    }
}

function displayRoadmap(roadmap) {
    const container = document.getElementById('roadmapContainer');
    container.innerHTML = '';

    if (!roadmap || roadmap.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center;">No roadmap generated</p>';
        return;
    }

    roadmap.forEach((week) => {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'roadmap-week';
        weekDiv.innerHTML = `
            <div class="roadmap-week-header">
                <div class="roadmap-week-number">${week.week}</div>
                <div class="roadmap-skill-name">${week.skill}</div>
            </div>
            <div class="roadmap-course">📚 ${week.course}</div>
            <div class="roadmap-meta">
                <span class="roadmap-difficulty">Difficulty: ${week.difficulty}</span>
                <span>⏱️ ${week.duration}</span>
            </div>
            <div class="roadmap-tasks">
                <div class="roadmap-tasks-title">📋 Weekly Tasks:</div>
                <ul>
                    ${week.tasks.map(task => `<li>${task}</li>`).join('')}
                </ul>
            </div>
        `;
        container.appendChild(weekDiv);
    });
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) selectedTab.classList.add('active');

    const activeButton = Array.from(buttons).find(btn => btn.textContent.toLowerCase().includes(tabName));
    if (activeButton) activeButton.classList.add('active');
}

function showLoading(show) {
    if (show) {
        loading.style.display = 'block';
        results.style.display = 'none';
        analyzeBtn.disabled = true;
        document.querySelector('.btn-text').style.display = 'none';
        document.querySelector('.btn-loader').style.display = 'inline';
    } else {
        loading.style.display = 'none';
        analyzeBtn.disabled = false;
        document.querySelector('.btn-text').style.display = 'inline';
        document.querySelector('.btn-loader').style.display = 'none';
    }
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function downloadReport() {
    alert('Report download feature coming soon!');
}
