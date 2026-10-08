document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const resumeForm = document.getElementById("resume-form");
  const logoutBtn = document.getElementById("logout-btn");
  const seedBtn = document.getElementById("seed-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const message = document.getElementById("login-message");

      if (!email || !password) {
        message.textContent = "Please fill in both fields.";
        message.className = "form-message error";
        return;
      }

      message.textContent = "Logging in...";
      message.className = "form-message";

      try {
        localStorage.setItem("careerai_user", JSON.stringify({
          name: "Udit Sharma",
          email: email,
          loggedIn: true
        }));

        setTimeout(() => {
          message.textContent = "Login successful. Redirecting...";
          message.className = "form-message success";
          window.location.href = "dashboard.html";
        }, 700);
      } catch (err) {
        message.textContent = "Something went wrong. Try again.";
        message.className = "form-message error";
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const fullName = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value.trim();
      const message = document.getElementById("signup-message");

      if (!fullName || !email || !password) {
        message.textContent = "Please complete all fields.";
        message.className = "form-message error";
        return;
      }

      if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters long.";
        message.className = "form-message error";
        return;
      }

      message.textContent = "Creating your account...";
      message.className = "form-message";

      setTimeout(() => {
        localStorage.setItem("careerai_user", JSON.stringify({
          name: fullName,
          email: email,
          loggedIn: true
        }));

        message.textContent = "Account created successfully. Redirecting...";
        message.className = "form-message success";

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 800);
      }, 700);
    });
  }

  if (resumeForm) {
    resumeForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const fileInput = document.getElementById("resume-file");
      const role = document.getElementById("target-role").value;

      if (!fileInput.files.length) {
        alert("Please upload a PDF resume first.");
        return;
      }

      const fileName = fileInput.files[0].name;

      const parsedSkills = {
        "Data Scientist": ["Python", "SQL", "Statistics", "Machine Learning", "Data Visualization"],
        "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "UI/UX"],
        "Backend Developer": ["Python", "APIs", "Databases", "System Design", "Testing"],
        "Product Analyst": ["SQL", "Analytics", "Stakeholder Management", "Dashboarding", "Problem Solving"],
        "UI/UX Designer": ["Figma", "Wireframing", "User Research", "Prototyping", "UX Writing"]
      };

      const skills = parsedSkills[role] || ["Python", "Communication", "Project Management"];

      const skillsList = document.getElementById("skills-list");
      skillsList.innerHTML = "";

      skills.forEach((skill) => {
        const item = document.createElement("span");
        item.className = "skill";
        item.textContent = skill;
        skillsList.appendChild(item);
      });

      const roadmapList = document.getElementById("roadmap-list");
      roadmapList.innerHTML = `
        <div class="roadmap-item">
          <span class="phase">Phase 1</span>
          <h3>Strengthen fundamentals for ${role}</h3>
          <p>Begin with core foundations relevant to your target role and focus on practical execution.</p>
          <div class="meta-row">
            <span>30 days</span>
            <span>Core</span>
          </div>
        </div>

        <div class="roadmap-item">
          <span class="phase">Phase 2</span>
          <h3>Build role-specific expertise</h3>
          <p>Practice real-world projects, case studies, and professional problem-solving tasks.</p>
          <div class="meta-row">
            <span>35 days</span>
            <span>Skill Build</span>
          </div>
        </div>

        <div class="roadmap-item">
          <span class="phase">Phase 3</span>
          <h3>Prepare for interviews and portfolio work</h3>
          <p>Polish your resume, build proofs of work, and practice communication and product context.</p>
          <div class="meta-row">
            <span>45 days</span>
            <span>Advanced</span>
          </div>
        </div>
      `;

      const matchScore = document.getElementById("match-score");
      const skillsCount = document.getElementById("skills-count");
      const roadmapCount = document.getElementById("roadmap-count");

      matchScore.textContent = "76%";
      skillsCount.textContent = skills.length.toString();
      roadmapCount.textContent = "3";

      alert(`Resume "${fileName}" analyzed for ${role}. Skill suggestions updated.`);
    });
  }

  if (seedBtn) {
    seedBtn.addEventListener("click", () => {
      const roleSelect = document.getElementById("target-role");
      const sampleRole = roleSelect.value;

      const sampleSkills = {
        "Data Scientist": ["Python", "SQL", "Statistics", "Machine Learning", "Data Visualization"],
        "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "UI/UX"],
        "Backend Developer": ["Python", "APIs", "Databases", "System Design", "Testing"],
        "Product Analyst": ["SQL", "Analytics", "Stakeholder Management", "Dashboarding", "Problem Solving"],
        "UI/UX Designer": ["Figma", "Wireframing", "User Research", "Prototyping", "UX Writing"]
      };

      const skills = sampleSkills[sampleRole] || ["Python", "Communication", "Project Management"];

      const skillsList = document.getElementById("skills-list");
      skillsList.innerHTML = "";
      skills.forEach((skill) => {
        const item = document.createElement("span");
        item.className = "skill";
        item.textContent = skill;
        skillsList.appendChild(item);
      });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("careerai_user");
      window.location.href = "index.html";
    });
  }

  if (document.getElementById("dashboard-page")) {
    const savedUser = JSON.parse(localStorage.getItem("careerai_user") || "{}");
    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");
    const welcomeTitle = document.getElementById("welcome-title");
    const avatar = document.getElementById("user-avatar");

    if (savedUser && savedUser.name) {
      userName.textContent = savedUser.name;
      userEmail.textContent = savedUser.email || "user@careerai.com";
      welcomeTitle.textContent = `Welcome back, ${savedUser.name.split(" ")[0]}`;
      avatar.textContent = savedUser.name.charAt(0).toUpperCase();
    }
  }
});