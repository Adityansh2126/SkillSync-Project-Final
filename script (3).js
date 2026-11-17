"use strict";

/* VERSION SWITCH
   PHASE = 1 -> only the Dashboard works (other buttons show "coming soon")
   PHASE = 2 -> everything works
   To unlock the full website later, change 1 to 2. */
const PHASE = 1;

/* ========== 1. STUDENT DATASET ========== */
const students = [
    { id: 1, name: "Alex Morgan", domain: "Web Development", skills: ["HTML", "CSS", "JavaScript", "Git"], interests: ["Frontend", "UI Design", "Open Source"], project: "Student Portfolio Builder", bio: "Enjoys building clean websites and wants to collaborate on useful student tools." },
    { id: 2, name: "Priya Sharma", domain: "Artificial Intelligence", skills: ["Python", "Machine Learning", "NumPy", "Pandas"], interests: ["AI", "Data Science", "Research"], project: "Student Performance Predictor", bio: "Interested in practical machine learning projects that solve everyday problems." },
    { id: 3, name: "Rahul Verma", domain: "Web Development", skills: ["HTML", "CSS", "JavaScript", "React"], interests: ["Frontend", "Accessibility", "Startups"], project: "Accessible College Website", bio: "Likes designing responsive interfaces and making websites easier to use." },
    { id: 4, name: "Ananya Gupta", domain: "Data Science", skills: ["Python", "SQL", "Pandas", "Data Visualization"], interests: ["Analytics", "Research", "Education"], project: "Campus Data Dashboard", bio: "Enjoys turning raw information into clear and useful visualizations." },
    { id: 5, name: "Arjun Singh", domain: "Cybersecurity", skills: ["Python", "Linux", "Networking", "Cybersecurity"], interests: ["Ethical Hacking", "Linux", "Security"], project: "Security Awareness Portal", bio: "Learning security fundamentals and interested in building safer digital systems." },
    { id: 6, name: "Meera Patel", domain: "Design", skills: ["Figma", "UI Design", "Wireframing", "HTML", "CSS"], interests: ["UX Research", "Prototyping", "Web Design"], project: "Student Experience Redesign", bio: "Combines interface design with frontend fundamentals to create better experiences." },
    { id: 7, name: "Kabir Khan", domain: "App Development", skills: ["Java", "Kotlin", "Android", "Firebase"], interests: ["Mobile Apps", "Product Design", "Education"], project: "College Event Companion", bio: "Interested in mobile applications that help students organize campus life." },
    { id: 8, name: "Ishita Roy", domain: "Artificial Intelligence", skills: ["Python", "TensorFlow", "Machine Learning", "Data Analysis"], interests: ["Deep Learning", "AI", "Computer Vision"], project: "Image Classification Demo", bio: "Exploring machine learning and computer vision through beginner-friendly projects." },
    { id: 9, name: "Dev Malhotra", domain: "Web Development", skills: ["JavaScript", "Node.js", "SQL", "Git"], interests: ["Backend", "APIs", "Web Applications"], project: "Local Event Discovery", bio: "Interested in connecting practical frontend interfaces with reliable application logic." },
    { id: 10, name: "Sana Ahmed", domain: "Data Science", skills: ["Python", "Excel", "SQL", "Statistics"], interests: ["Data Analysis", "Business", "Visualization"], project: "Student Expense Analyzer", bio: "Uses data analysis to understand patterns and make more informed decisions." },
    { id: 11, name: "Vikram Joshi", domain: "Cybersecurity", skills: ["Linux", "Networking", "Python", "Git"], interests: ["System Security", "Automation", "Open Source"], project: "Linux Learning Toolkit", bio: "Practicing Linux and scripting while learning the fundamentals of system security." },
    { id: 12, name: "Nisha Kapoor", domain: "Design", skills: ["Figma", "UI Design", "Canva", "Wireframing"], interests: ["Visual Design", "Branding", "User Experience"], project: "Student Opportunity Explorer", bio: "Enjoys simplifying complicated information through thoughtful interface design." }
];

/* ========== 2. OPPORTUNITIES ========== */
const opportunities = [
    { id: 101, title: "Smart India Hackathon", category: "Hackathon", icon: "⚡", description: "Explore a national innovation initiative where student teams develop solutions to real-world problem statements.", audience: "Student teams", url: "https://www.sih.gov.in/" },
    { id: 102, title: "Google Solution Challenge", category: "Competition", icon: "✦", description: "Explore student innovation challenges focused on building technology solutions for real-world problems.", audience: "Student developers", url: "https://developers.google.com/community/gdsc-solution-challenge" },
    { id: 103, title: "National Scholarship Portal", category: "Scholarship", icon: "🎓", description: "Check the official portal for government scholarship schemes, eligibility criteria, and application information.", audience: "Eligible students", url: "https://scholarships.gov.in/" },
    { id: 104, title: "GitHub Student Developer Pack", category: "Learning", icon: "⌘", description: "Explore developer tools and learning resources available to eligible students.", audience: "Verified students", url: "https://education.github.com/pack" },
    { id: 105, title: "Kaggle Competitions", category: "Competition", icon: "◈", description: "Practice data science and machine learning by exploring datasets and participating in competitions.", audience: "Data science learners", url: "https://www.kaggle.com/competitions" },
    { id: 106, title: "Google Cloud Skills Boost", category: "Learning", icon: "☁", description: "Explore cloud computing training, hands-on labs, and technical learning paths.", audience: "Cloud learners", url: "https://www.cloudskillsboost.google/" },
    { id: 107, title: "AICTE Scholarships", category: "Scholarship", icon: "🎓", description: "Review AICTE's official website for current student schemes, announcements, and eligibility information.", audience: "Eligible students", url: "https://www.aicte-india.org/" },
    { id: 108, title: "freeCodeCamp", category: "Learning", icon: "</>", description: "Practice web development, programming, and other technical skills through free learning resources.", audience: "Beginners", url: "https://www.freecodecamp.org/" },
    { id: 109, title: "Hackathon.com", category: "Hackathon", icon: "⚙", description: "Explore a directory of hackathons and technology events. Check each event for current details.", audience: "Hackathon participants", url: "https://www.hackathon.com/" }
];

/* ========== 3. PROFILE AND LOCAL STORAGE ========== */
const defaultProfile = {
    name: "Sam Carter",
    domain: "Web Development",
    skills: ["HTML", "CSS", "JavaScript"],
    desiredSkills: ["Python", "Machine Learning"],
    bio: "Computer Science student who enjoys building useful digital products and learning new technologies."
};

const PROFILE_KEY = "skillsync_profile_v2";
const SAVED_KEY = "skillsync_saved_opportunities_v1";

function readStorage(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        showToast("Browser storage is unavailable.");
        return false;
    }
}

let profile = readStorage(PROFILE_KEY, defaultProfile);
let savedOpportunities = readStorage(SAVED_KEY, []);
if (!Array.isArray(savedOpportunities)) savedOpportunities = [];

let showSavedOnly = false;
let toastTimer;

/* ========== 4. HELPERS ========== */
function escapeHTML(value) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(value).replace(/[&<>"']/g, c => map[c]);
}

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

function parseSkills(value) {
    return [...new Set(String(value || "").split(",").map(s => s.trim()).filter(Boolean))].slice(0, 30);
}

function initials(name) {
    return String(name || "?").trim().split(/\s+/).slice(0, 2).map(p => p.charAt(0)).join("").toUpperCase();
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function renderTags(skills, neutral = false) {
    if (!skills || !skills.length) return '<span class="tag neutral">Not specified</span>';
    return skills.map(s => `<span class="tag ${neutral ? "neutral" : ""}">${escapeHTML(s)}</span>`).join("");
}

/* ========== 5. MATCHING (complementary skills) ========== */
/*
   75% of the score = how many of the skills YOU WANT TO LEARN the student has.
   25% of the score = how many of YOUR skills the student also has.
*/
function calculateMatch(student) {
    const mine = (profile.skills || []).map(normalize);
    const wanted = (profile.desiredSkills || []).map(normalize);
    const theirs = student.skills.map(normalize);

    const learningMatches = wanted.filter(s => theirs.includes(s));
    const sharedSkills = mine.filter(s => theirs.includes(s));

    const complement = wanted.length ? learningMatches.length / wanted.length : 0;
    const overlap = mine.length ? sharedSkills.length / mine.length : 0;

    return {
        score: Math.round(complement * 75 + overlap * 25),
        sharedSkills,
        learningMatches
    };
}

/* ========== 6. STUDENT CARDS ========== */
function studentCard(student) {
    const result = calculateMatch(student);
    const skills = student.skills.slice(0, 4);
    const extra = student.skills.length - skills.length;
    const n = result.learningMatches.length;

    return `
        <article class="student-card">
            <div class="student-card-top">
                <div class="student-avatar color-${student.id % 5}">${escapeHTML(initials(student.name))}</div>
                <div class="student-info">
                    <div class="student-name">${escapeHTML(student.name)}</div>
                    <div class="student-domain">${escapeHTML(student.domain)}</div>
                </div>
                <span class="match-score">${result.score}%</span>
            </div>
            <p class="student-bio">${escapeHTML(student.bio)}</p>
            <div class="card-label">SKILLS</div>
            <div class="tag-container">
                ${renderTags(skills)}
                ${extra > 0 ? `<span class="tag neutral">+${extra}</span>` : ""}
            </div>
            <div class="student-card-bottom">
                <div class="mini-match"><strong>${n}</strong> skill${n === 1 ? "" : "s"} you want to learn</div>
                <button type="button" class="small-button" data-student-id="${student.id}">View profile &rarr;</button>
            </div>
        </article>
    `;
}

function renderStudentList(containerId, list, emptyId) {
    document.getElementById(containerId).innerHTML = list.map(studentCard).join("");
    if (emptyId) document.getElementById(emptyId).classList.toggle("hidden", list.length > 0);
}

/* ========== 7. DASHBOARD ========== */
function renderDashboard() {
    setText("student-count", students.length);
    setText("skill-count", new Set(students.flatMap(s => s.skills.map(normalize))).size);
    setText("opportunity-count", opportunities.length);
    setText("saved-count", savedOpportunities.length);

    const ranked = [...students].sort((a, b) => calculateMatch(b).score - calculateMatch(a).score).slice(0, 3);
    renderStudentList("dashboard-students", ranked);
    document.getElementById("dashboard-opportunities").innerHTML = opportunities.slice(0, 3).map(opportunityCard).join("");
}

/* ========== 8. SEARCH AND FILTERS ========== */
function studentMatchesQuery(student, query) {
    if (!query) return true;
    const text = [student.name, student.domain, student.bio, student.project, ...student.skills, ...student.interests].join(" ");
    return normalize(text).includes(normalize(query));
}

function renderMatches() {
    const query = document.getElementById("match-search").value.trim();
    const domain = document.getElementById("domain-filter").value;
    const sort = document.getElementById("sort-filter").value;

    const results = students.filter(s => studentMatchesQuery(s, query) && (domain === "all" || s.domain === domain));

    if (sort === "match") results.sort((a, b) => calculateMatch(b).score - calculateMatch(a).score);
    else results.sort((a, b) => a.name.localeCompare(b.name));

    setText("match-result-count", `${results.length} student${results.length === 1 ? "" : "s"} found`);
    renderStudentList("match-results", results, "no-matches");
}

function renderAllStudents() {
    const query = document.getElementById("student-search").value.trim();
    renderStudentList("all-students", students.filter(s => studentMatchesQuery(s, query)), "no-students");
}

/* ========== 9. STUDENT MODAL ========== */
function openStudentModal(studentId) {
    const student = students.find(s => s.id === Number(studentId));
    if (!student) return;

    const result = calculateMatch(student);
    const n = result.learningMatches.length;

    setText("modal-avatar", initials(student.name));
    setText("modal-name", student.name);
    setText("modal-domain", student.domain);
    setText("modal-bio", student.bio);
    setText("modal-interests", student.interests.join(", "));
    document.getElementById("modal-skills").innerHTML = renderTags(student.skills);
    setText("modal-score", `${result.score}% match · has ${n} skill${n === 1 ? "" : "s"} you want to learn`);

    document.getElementById("student-modal").classList.remove("hidden");
    document.getElementById("close-modal").focus();
}

function closeStudentModal() {
    document.getElementById("student-modal").classList.add("hidden");
}

/* ========== 10. PROFILE ========== */
function renderProfile() {
    setText("preview-name", profile.name);
    setText("preview-domain", profile.domain);
    setText("profile-avatar", initials(profile.name));
    document.getElementById("preview-skills").innerHTML = renderTags(profile.skills);
    document.getElementById("preview-desired").innerHTML = renderTags(profile.desiredSkills, true);

    document.getElementById("profile-name").value = profile.name;
    document.getElementById("profile-domain").value = profile.domain;
    document.getElementById("current-skills").value = profile.skills.join(", ");
    document.getElementById("desired-skills").value = profile.desiredSkills.join(", ");
    document.getElementById("profile-bio").value = profile.bio;
}

function refreshAll() {
    renderProfile();
    renderDashboard();
    renderMatches();
    renderAllStudents();
}

function saveProfile(event) {
    event.preventDefault();
    const name = document.getElementById("profile-name").value.trim();
    if (!name) { showToast("Please enter your name."); return; }

    profile = {
        name,
        domain: document.getElementById("profile-domain").value,
        skills: parseSkills(document.getElementById("current-skills").value),
        desiredSkills: parseSkills(document.getElementById("desired-skills").value),
        bio: document.getElementById("profile-bio").value.trim()
    };

    if (writeStorage(PROFILE_KEY, profile)) {
        setText("profile-message", "Profile saved successfully.");
        showToast("Your profile has been updated.");
        refreshAll();
    }
}

function resetProfile() {
    profile = { ...defaultProfile, skills: [...defaultProfile.skills], desiredSkills: [...defaultProfile.desiredSkills] };
    if (writeStorage(PROFILE_KEY, profile)) {
        refreshAll();
        setText("profile-message", "Profile reset to the demo defaults.");
        showToast("Profile reset successfully.");
    }
}

/* ========== 11. OPPORTUNITIES ========== */
function opportunityCard(o) {
    const saved = savedOpportunities.includes(o.id);
    return `
        <article class="opportunity-card">
            <div class="opportunity-icon ${normalize(o.category)}">${escapeHTML(o.icon)}</div>
            <span class="opportunity-category">${escapeHTML(o.category)}</span>
            <h3>${escapeHTML(o.title)}</h3>
            <p>${escapeHTML(o.description)}</p>
            <div class="opportunity-meta">Suitable for: ${escapeHTML(o.audience)}</div>
            <div class="opportunity-actions">
                <button class="button button-primary" data-opportunity-url="${escapeHTML(o.url)}">Explore ↗</button>
                <button class="save-button ${saved ? "saved" : ""}" data-save-id="${o.id}"
                    aria-label="${saved ? "Unsave" : "Save"} ${escapeHTML(o.title)}" aria-pressed="${saved}"
                    title="${saved ? "Remove saved opportunity" : "Save opportunity"}">${saved ? "♥" : "♡"}</button>
            </div>
        </article>
    `;
}

function renderOpportunities() {
    const category = document.getElementById("opportunity-filter").value;
    let list = opportunities.filter(o => category === "all" || o.category === category);
    if (showSavedOnly) list = list.filter(o => savedOpportunities.includes(o.id));

    document.getElementById("all-opportunities").innerHTML = list.map(opportunityCard).join("");
    document.getElementById("no-opportunities").classList.toggle("hidden", list.length > 0);
    document.getElementById("show-saved").textContent = showSavedOnly ? "Show all opportunities" : "♡ Show saved only";
    setText("saved-count", savedOpportunities.length);
}

function toggleSavedOpportunity(id) {
    const oppId = Number(id);
    if (!opportunities.some(o => o.id === oppId)) return;

    if (savedOpportunities.includes(oppId)) {
        savedOpportunities = savedOpportunities.filter(x => x !== oppId);
        showToast("Opportunity removed from saved items.");
    } else {
        savedOpportunities.push(oppId);
        showToast("Opportunity saved.");
    }

    if (writeStorage(SAVED_KEY, savedOpportunities)) {
        renderOpportunities();
        renderDashboard();
    }
}

function openOpportunity(url) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:") { showToast("Only secure HTTPS links are allowed."); return; }
        window.open(parsed.href, "_blank", "noopener,noreferrer");
    } catch (error) {
        showToast("This opportunity link is invalid.");
    }
}

/* ========== 12. NAVIGATION ========== */
const pageTitles = {
    dashboard: "Dashboard",
    matches: "Find Matches",
    students: "Students",
    profile: "My Profile",
    opportunities: "Opportunities"
};

function navigateTo(pageId) {
    if (!pageTitles[pageId]) return;

    document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === pageId));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === pageId));
    setText("page-heading", pageTitles[pageId]);
    setText("breadcrumb-page", pageTitles[pageId]);

    if (pageId === "dashboard") renderDashboard();
    if (pageId === "matches") renderMatches();
    if (pageId === "students") renderAllStudents();
    if (pageId === "profile") renderProfile();
    if (pageId === "opportunities") renderOpportunities();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ========== 13. EVENTS ========== */
document.addEventListener("click", event => {
    const anyButton = event.target.closest("button");
    if (PHASE === 1 && anyButton && anyButton.dataset.page !== "dashboard") {
        showToast("This feature is coming soon in the next version.");
        return;
    }

    const pageBtn = event.target.closest("[data-page]");
    if (pageBtn) { navigateTo(pageBtn.dataset.page); return; }

    const studentBtn = event.target.closest("[data-student-id]");
    if (studentBtn) { openStudentModal(studentBtn.dataset.studentId); return; }

    const saveBtn = event.target.closest("[data-save-id]");
    if (saveBtn) { toggleSavedOpportunity(saveBtn.dataset.saveId); return; }

    const oppBtn = event.target.closest("[data-opportunity-url]");
    if (oppBtn) openOpportunity(oppBtn.dataset.opportunityUrl);
});

document.getElementById("search-button").addEventListener("click", renderMatches);
document.getElementById("match-search").addEventListener("input", renderMatches);
document.getElementById("domain-filter").addEventListener("change", renderMatches);
document.getElementById("sort-filter").addEventListener("change", renderMatches);

document.getElementById("clear-filters").addEventListener("click", () => {
    document.getElementById("match-search").value = "";
    document.getElementById("domain-filter").value = "all";
    document.getElementById("sort-filter").value = "match";
    renderMatches();
    showToast("Search filters cleared.");
});

document.getElementById("student-search").addEventListener("input", renderAllStudents);
document.getElementById("profile-form").addEventListener("submit", saveProfile);
document.getElementById("reset-profile").addEventListener("click", resetProfile);
document.getElementById("opportunity-filter").addEventListener("change", renderOpportunities);

document.getElementById("show-saved").addEventListener("click", () => {
    showSavedOnly = !showSavedOnly;
    renderOpportunities();
});

document.getElementById("close-modal").addEventListener("click", closeStudentModal);
document.getElementById("modal-close-button").addEventListener("click", closeStudentModal);
document.getElementById("student-modal").addEventListener("click", e => {
    if (e.target.id === "student-modal") closeStudentModal();
});
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeStudentModal();
});

/* ========== 14. START ========== */
refreshAll();
renderOpportunities();
