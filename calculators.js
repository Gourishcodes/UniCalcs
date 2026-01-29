// Student Calculator Hub - All Calculator Logic

// ============================================
// Theme Toggle & Scroll Position Management
// ============================================

// Initialize theme from localStorage or system preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// Toggle between light and dark theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Save scroll position before leaving page
function saveScrollPosition() {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
}

// Restore scroll position when returning to page
function restoreScrollPosition() {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition && document.referrer.includes(window.location.hostname)) {
        // Only restore if coming from same site
        setTimeout(() => {
            window.scrollTo({
                top: parseInt(savedPosition),
                behavior: 'instant'
            });
        }, 100);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    // Disabled: was causing auto-scroll issues
    // restoreScrollPosition();

    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});

// Save position before unload
window.addEventListener('beforeunload', saveScrollPosition);

// Save position when clicking links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.startsWith('#')) {
        saveScrollPosition();
    }
});

// ============================================
// Grade Conversion Utility
// ============================================
function getGradeFromPercentage(percentage) {
    if (percentage >= 90) return { grade: 'O', points: 10, desc: 'Outstanding' };
    if (percentage >= 80) return { grade: 'A+', points: 9, desc: 'Excellent' };
    if (percentage >= 70) return { grade: 'A', points: 8, desc: 'Very Good' };
    if (percentage >= 60) return { grade: 'B+', points: 7, desc: 'Good' };
    if (percentage >= 50) return { grade: 'B', points: 6, desc: 'Above Average' };
    if (percentage >= 45) return { grade: 'C', points: 5, desc: 'Average' };
    if (percentage >= 40) return { grade: 'D', points: 4, desc: 'Pass' };
    return { grade: 'F', points: 0, desc: 'Fail' };
}

// ============================================
// 1. CGPA ↔ Percentage Converter
// ============================================
function cgpaToPercentage() {
    const input = document.getElementById('cgpa-input');
    const resultValue = document.getElementById('cgpa-result-value');
    const resultSub = document.getElementById('cgpa-result-sub');
    const resultCard = document.getElementById('cgpa-result-card');

    const cgpa = parseFloat(input.value);

    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        resultValue.textContent = 'Invalid';
        resultValue.className = 'result-value';
        resultValue.style.color = 'var(--danger)';
        resultSub.textContent = 'Please enter a CGPA between 0 and 10';
        return;
    }

    const percentage = (cgpa * 9.5).toFixed(2);
    resultValue.textContent = percentage + '%';
    resultValue.className = 'result-value gradient';
    resultValue.style.color = '';
    resultSub.textContent = `CGPA ${cgpa} × 9.5 = ${percentage}%`;
    animateResult(resultCard);
}

function percentageToCgpa() {
    const input = document.getElementById('percentage-input');
    const resultValue = document.getElementById('percent-result-value');
    const resultSub = document.getElementById('percent-result-sub');
    const resultCard = document.getElementById('percent-result-card');

    const percentage = parseFloat(input.value);

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        resultValue.textContent = 'Invalid';
        resultValue.className = 'result-value';
        resultValue.style.color = 'var(--danger)';
        resultSub.textContent = 'Please enter a percentage between 0 and 100';
        return;
    }

    const cgpa = (percentage / 9.5).toFixed(2);
    resultValue.textContent = cgpa;
    resultValue.className = 'result-value gradient';
    resultValue.style.color = '';
    resultSub.textContent = `${percentage}% ÷ 9.5 = ${cgpa} CGPA`;
    animateResult(resultCard);
}

// ============================================
// 2. Semester GPA Calculator
// ============================================
let subjectCount = 0;

function initSemesterGPA() {
    subjectCount = 0;
    const container = document.getElementById('subjects-container');
    if (container) container.innerHTML = '';
    addSubject();
    addSubject();
    addSubject();
}

function addSubject() {
    subjectCount++;
    const container = document.getElementById('subjects-container');

    const row = document.createElement('div');
    row.className = 'row';
    row.id = `subject-${subjectCount}`;
    row.innerHTML = `
        <div class="row-header">
            <span class="row-num">Subject ${subjectCount}</span>
            <button class="btn btn-danger" onclick="removeSubject(${subjectCount})">Remove</button>
        </div>
        <div class="row-fields">
            <input type="number" placeholder="Marks" min="0" oninput="updateSubjectGrade(${subjectCount})">
            <input type="number" placeholder="Total" min="1" oninput="updateSubjectGrade(${subjectCount})">
            <input type="number" placeholder="Credits" min="1">
            <div class="row-grade" id="grade-${subjectCount}">—</div>
        </div>
    `;
    container.appendChild(row);
}

function removeSubject(id) {
    const row = document.getElementById(`subject-${id}`);
    if (row && document.querySelectorAll('.row').length > 1) {
        row.remove();
    }
}

function updateSubjectGrade(id) {
    const row = document.getElementById(`subject-${id}`);
    if (!row) return;

    const inputs = row.querySelectorAll('input');
    const marks = parseFloat(inputs[0].value);
    const total = parseFloat(inputs[1].value);
    const gradeDiv = document.getElementById(`grade-${id}`);

    if (!isNaN(marks) && !isNaN(total) && total > 0 && marks >= 0) {
        const percentage = (marks / total) * 100;
        const gradeInfo = getGradeFromPercentage(percentage);
        gradeDiv.textContent = `${gradeInfo.grade} (${gradeInfo.points} pts)`;
        gradeDiv.className = 'row-grade calculated';
    } else {
        gradeDiv.textContent = 'Grade: —';
        gradeDiv.className = 'row-grade';
    }
}

function calculateSemesterGPA() {
    const rows = document.querySelectorAll('#subjects-container .row');
    let totalCredits = 0;
    let totalWeighted = 0;
    let valid = true;

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const marks = parseFloat(inputs[0].value);
        const total = parseFloat(inputs[1].value);
        const credits = parseFloat(inputs[2].value);

        if (isNaN(marks) || isNaN(total) || isNaN(credits) || total <= 0 || credits <= 0 || marks < 0) {
            valid = false;
            return;
        }

        const percentage = (marks / total) * 100;
        const gradeInfo = getGradeFromPercentage(percentage);

        totalCredits += credits;
        totalWeighted += credits * gradeInfo.points;
    });

    const resultValue = document.getElementById('gpa-result-value');
    const resultSub = document.getElementById('gpa-result-sub');
    const resultCard = document.getElementById('gpa-result-card');

    if (!valid || totalCredits === 0) {
        resultValue.textContent = 'Error';
        resultValue.className = 'result-value';
        resultValue.style.color = 'var(--danger)';
        resultSub.textContent = 'Please fill all fields correctly';
        return;
    }

    const gpa = (totalWeighted / totalCredits).toFixed(2);
    const percentage = (gpa * 9.5).toFixed(2);

    resultValue.textContent = gpa;
    resultValue.className = 'result-value gradient';
    resultValue.style.color = '';
    resultSub.textContent = `Total Credits: ${totalCredits} | Equivalent: ${percentage}%`;
    animateResult(resultCard);
}

// ============================================
// 3. CGPA Calculator (Multi-Semester)
// ============================================
let semesterCount = 0;

function initCGPACalculator() {
    semesterCount = 0;
    const container = document.getElementById('semesters-container');
    if (container) container.innerHTML = '';
    addSemester();
    addSemester();
}

function addSemester() {
    semesterCount++;
    const container = document.getElementById('semesters-container');

    const row = document.createElement('div');
    row.className = 'row';
    row.id = `semester-${semesterCount}`;
    row.innerHTML = `
        <div class="row-header">
            <span class="row-num">Semester ${semesterCount}</span>
            <button class="btn btn-danger" onclick="removeSemester(${semesterCount})">Remove</button>
        </div>
        <div class="row-fields" style="grid-template-columns: 1fr 1fr;">
            <input type="number" placeholder="Credits" min="1">
            <input type="number" placeholder="GPA" min="0" max="10" step="0.01">
        </div>
    `;
    container.appendChild(row);
}

function removeSemester(id) {
    const row = document.getElementById(`semester-${id}`);
    if (row && document.querySelectorAll('#semesters-container .row').length > 1) {
        row.remove();
    }
}

function calculateCGPA() {
    const rows = document.querySelectorAll('#semesters-container .row');
    let totalCredits = 0;
    let totalWeighted = 0;
    let valid = true;

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const credits = parseFloat(inputs[0].value);
        const gpa = parseFloat(inputs[1].value);

        if (isNaN(credits) || isNaN(gpa) || credits <= 0 || gpa < 0 || gpa > 10) {
            valid = false;
            return;
        }

        totalCredits += credits;
        totalWeighted += credits * gpa;
    });

    const resultValue = document.getElementById('cgpa-result-value');
    const resultSub = document.getElementById('cgpa-result-sub');
    const resultCard = document.getElementById('cgpa-result-card');

    if (!valid || totalCredits === 0) {
        resultValue.textContent = 'Error';
        resultValue.className = 'result-value';
        resultValue.style.color = 'var(--danger)';
        resultSub.textContent = 'Please fill all fields correctly';
        return;
    }

    const cgpa = (totalWeighted / totalCredits).toFixed(2);
    const percentage = (cgpa * 9.5).toFixed(2);

    resultValue.textContent = cgpa;
    resultValue.className = 'result-value gradient';
    resultValue.style.color = '';
    resultSub.textContent = `Total Credits: ${totalCredits} | Equivalent: ${percentage}%`;
    animateResult(resultCard);
}

// ============================================
// 4. Attendance Calculator
// ============================================
function calculateAttendance() {
    const total = parseFloat(document.getElementById('total-classes').value);
    const attended = parseFloat(document.getElementById('attended-classes').value);
    const required = parseFloat(document.getElementById('required-percentage').value);

    const currentEl = document.getElementById('current-attendance');
    const statusEl = document.getElementById('attendance-status');
    const messageEl = document.getElementById('attendance-message');
    const resultsEl = document.getElementById('attendance-results');

    if (isNaN(total) || isNaN(attended) || isNaN(required) ||
        total <= 0 || attended < 0 || attended > total || required <= 0 || required > 100) {
        currentEl.textContent = '—';
        statusEl.textContent = '—';
        statusEl.className = 'stat-value';
        messageEl.innerHTML = '<p>Please enter valid values</p>';
        return;
    }

    const currentPercent = (attended / total) * 100;
    currentEl.textContent = currentPercent.toFixed(1) + '%';

    animateResult(resultsEl);

    if (currentPercent >= required) {
        statusEl.textContent = '✓ Safe';
        statusEl.className = 'stat-value success';

        const canSkip = Math.floor((attended * 100 - required * total) / required);

        if (canSkip > 0) {
            messageEl.innerHTML = `<p><strong>You're doing great!</strong> You can safely skip up to <strong>${canSkip}</strong> more class${canSkip > 1 ? 'es' : ''} and still maintain ${required}% attendance.</p>`;
        } else {
            messageEl.innerHTML = `<p>You're exactly at the minimum. <strong>Don't miss any more classes!</strong></p>`;
        }
    } else {
        statusEl.textContent = '✗ Low';
        statusEl.className = 'stat-value danger';

        const needToAttend = Math.ceil((required * total - 100 * attended) / (100 - required));
        const shortage = (required - currentPercent).toFixed(1);

        messageEl.innerHTML = `<p><strong>Warning!</strong> You're ${shortage}% below the requirement. Attend the next <strong>${needToAttend}</strong> consecutive class${needToAttend > 1 ? 'es' : ''} to reach ${required}%.</p>`;
    }
}

// ============================================
// 5. Marks → Grade Calculator
// ============================================
function calculateGrade() {
    const marks = parseFloat(document.getElementById('marks-obtained').value);
    const total = parseFloat(document.getElementById('total-marks').value);

    const percentEl = document.getElementById('result-percentage');
    const gradeEl = document.getElementById('result-grade');
    const pointsEl = document.getElementById('result-points');
    const descEl = document.getElementById('result-desc');
    const resultsEl = document.getElementById('grade-results');

    if (isNaN(marks) || isNaN(total) || total <= 0 || marks < 0 || marks > total) {
        percentEl.textContent = '—';
        gradeEl.textContent = '—';
        pointsEl.textContent = '—';
        descEl.textContent = 'Enter valid values';
        return;
    }

    const percentage = (marks / total) * 100;
    const gradeInfo = getGradeFromPercentage(percentage);

    percentEl.textContent = percentage.toFixed(2) + '%';
    gradeEl.textContent = gradeInfo.grade;
    pointsEl.textContent = gradeInfo.points;
    descEl.textContent = gradeInfo.desc;

    // Color based on grade
    if (gradeInfo.points >= 8) {
        gradeEl.className = 'stat-value success';
        percentEl.className = 'stat-value success';
        pointsEl.className = 'stat-value success';
    } else if (gradeInfo.points >= 5) {
        gradeEl.className = 'stat-value warning';
        percentEl.className = 'stat-value warning';
        pointsEl.className = 'stat-value warning';
    } else {
        gradeEl.className = 'stat-value danger';
        percentEl.className = 'stat-value danger';
        pointsEl.className = 'stat-value danger';
    }

    animateResult(resultsEl);
}

// ============================================
// 6. Backlog Impact Calculator
// ============================================
function calculateBacklogImpact() {
    const totalSubjects = parseFloat(document.getElementById('total-subjects').value);
    const backlogs = parseFloat(document.getElementById('backlog-count').value);

    const percentEl = document.getElementById('backlog-percentage');
    const levelEl = document.getElementById('impact-level');
    const messageEl = document.getElementById('impact-message');
    const resultsEl = document.getElementById('backlog-results');

    if (isNaN(totalSubjects) || isNaN(backlogs) ||
        totalSubjects <= 0 || backlogs < 0 || backlogs > totalSubjects) {
        percentEl.textContent = '—';
        levelEl.textContent = '—';
        levelEl.className = 'stat-value';
        messageEl.innerHTML = '<p>Please enter valid values</p>';
        return;
    }

    const backlogPercent = (backlogs / totalSubjects) * 100;
    percentEl.textContent = backlogPercent.toFixed(1) + '%';

    animateResult(resultsEl);

    if (backlogs === 0) {
        levelEl.textContent = '✓ Excellent';
        levelEl.className = 'stat-value success';
        messageEl.innerHTML = `<p><strong>Outstanding!</strong> You have no backlogs. This is excellent for placements and higher studies. Keep up the great work!</p>`;
    } else if (backlogs <= 2) {
        levelEl.textContent = 'Minor';
        levelEl.className = 'stat-value success';
        messageEl.innerHTML = `<p>You have <strong>${backlogs}</strong> backlog${backlogs > 1 ? 's' : ''}. This is manageable — many companies allow 1-2 active backlogs. Clear ${backlogs > 1 ? 'them' : 'it'} as soon as possible.</p>`;
    } else if (backlogs <= 4) {
        levelEl.textContent = 'Moderate';
        levelEl.className = 'stat-value warning';
        messageEl.innerHTML = `<p><strong>${backlogs} backlogs</strong> may affect campus placements and higher education opportunities. Some companies may not shortlist you. Focus on clearing these as a priority!</p>`;
    } else {
        levelEl.textContent = 'Serious';
        levelEl.className = 'stat-value danger';
        messageEl.innerHTML = `<p><strong>Critical: ${backlogs} backlogs</strong> will likely lead to rejection from most placements, possible year back, and difficulty in higher studies. <strong>Take immediate action</strong> — seek help from teachers and focus entirely on clearing backlogs.</p>`;
    }
}

// ============================================
// Helper: Animate Result
// ============================================
function animateResult(element) {
    if (!element) return;
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'resultFadeIn 0.4s ease';
}

// Add CSS animation if not present
const style = document.createElement('style');
style.textContent = `
    @keyframes resultFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
