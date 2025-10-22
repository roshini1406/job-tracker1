// API Base URL
const API_BASE = 'http://localhost:5001/api';

// DOM Elements
const addJobBtn = document.getElementById('add-job-btn');
const addJobModal = document.getElementById('add-job-modal');
const addJobForm = document.getElementById('add-job-form');
const jobsList = document.getElementById('jobs-list');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const themeToggle = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is logged in
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// Modal functionality
addJobBtn.addEventListener('click', () => {
  addJobModal.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
  addJobModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === addJobModal) {
    addJobModal.style.display = 'none';
  }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});

// Load jobs
async function loadJobs() {
  try {
    const response = await fetch(`${API_BASE}/jobs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const jobs = await response.json();
      displayJobs(jobs);
      updateStats(jobs);
    } else {
      console.error('Failed to load jobs');
    }
  } catch (error) {
    console.error('Error loading jobs:', error);
  }
}

// Display jobs
function displayJobs(jobs) {
  jobsList.innerHTML = '';

  jobs.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';

    const statusClass = `status-${job.status.toLowerCase()}`;

    jobCard.innerHTML = `
      <div class="job-header">
        <div>
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company}</div>
        </div>
        <span class="job-status ${statusClass}">${job.status}</span>
      </div>
      <div class="job-details">
        <div class="job-notes">${job.notes || 'No notes'}</div>
        <div>Applied: ${new Date(job.dateApplied).toLocaleDateString()}</div>
        ${job.jobUrl ? `<div><a href="${job.jobUrl}" target="_blank">View Job</a></div>` : ''}
      </div>
      <div class="job-actions">
        <button class="btn-secondary edit-btn" data-id="${job._id}">Edit</button>
        <button class="btn-danger delete-btn" data-id="${job._id}">Delete</button>
      </div>
    `;

    jobsList.appendChild(jobCard);
  });

  // Add event listeners to buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => editJob(e.target.dataset.id));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => deleteJob(e.target.dataset.id));
  });
}

// Update stats
function updateStats(jobs) {
  const total = jobs.length;
  const interviews = jobs.filter(job => job.status === 'Interviewing').length;
  const offers = jobs.filter(job => job.status === 'Offer').length;
  const rejections = jobs.filter(job => job.status === 'Rejected').length;

  document.getElementById('total-apps').textContent = total;
  document.getElementById('interviews').textContent = interviews;
  document.getElementById('offers').textContent = offers;
  document.getElementById('rejections').textContent = rejections;
}

// Add job
addJobForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('job-title').value);
  formData.append('company', document.getElementById('company').value);
  formData.append('status', document.getElementById('status').value);
  formData.append('dateApplied', document.getElementById('date-applied').value);
  formData.append('jobUrl', document.getElementById('job-url').value);
  formData.append('notes', document.getElementById('notes').value);
  formData.append('reminderDate', document.getElementById('reminder-date').value);

  const resumeFile = document.getElementById('resume').files[0];
  if (resumeFile) {
    formData.append('resume', resumeFile);
  }

  try {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      addJobModal.style.display = 'none';
      addJobForm.reset();
      loadJobs();
    } else {
      console.error('Failed to add job');
    }
  } catch (error) {
    console.error('Error adding job:', error);
  }
});

// Edit job
async function editJob(id) {
  // This would open an edit modal - simplified for now
  console.log('Edit job:', id);
}

// Delete job
async function deleteJob(id) {
  if (confirm('Are you sure you want to delete this job?')) {
    try {
      const response = await fetch(`${API_BASE}/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadJobs();
      } else {
        console.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  }
}

// Search and filter
searchInput.addEventListener('input', filterJobs);
statusFilter.addEventListener('change', filterJobs);

function filterJobs() {
  const searchTerm = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;

  const jobCards = document.querySelectorAll('.job-card');

  jobCards.forEach(card => {
    const title = card.querySelector('.job-title').textContent.toLowerCase();
    const company = card.querySelector('.job-company').textContent.toLowerCase();
    const status = card.querySelector('.job-status').textContent;

    const matchesSearch = title.includes(searchTerm) || company.includes(searchTerm);
    const matchesStatus = !statusValue || status === statusValue;

    if (matchesSearch && matchesStatus) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Initialize
loadJobs();
