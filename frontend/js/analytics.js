// API Base URL
const API_BASE = 'http://localhost:5001/api';

// DOM Elements
const statusChartCanvas = document.getElementById('statusChart');
const timeChartCanvas = document.getElementById('timeChart');
const companyChartCanvas = document.getElementById('companyChart');
const activityList = document.getElementById('activity-list');
const themeToggle = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is logged in
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

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

// Load analytics data
async function loadAnalytics() {
  try {
    const [jobsResponse, statsResponse] = await Promise.all([
      fetch(`${API_BASE}/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`${API_BASE}/jobs/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    if (jobsResponse.ok && statsResponse.ok) {
      const jobs = await jobsResponse.json();
      const stats = await statsResponse.json();

      createStatusChart(stats);
      createTimeChart(jobs);
      createCompanyChart(jobs);
      displayActivityLog(jobs);
    } else {
      console.error('Failed to load analytics data');
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

// Create status chart
function createStatusChart(stats) {
  const ctx = statusChartCanvas.getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
      datasets: [{
        data: [stats.applied, stats.interviewing, stats.offers, stats.rejected],
        backgroundColor: [
          '#007bff',
          '#ffc107',
          '#28a745',
          '#dc3545'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        }
      }
    }
  });
}

// Create time chart
function createTimeChart(jobs) {
  const ctx = timeChartCanvas.getContext('2d');

  // Group jobs by month
  const monthlyData = {};
  jobs.forEach(job => {
    const date = new Date(job.dateApplied);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
  });

  const labels = Object.keys(monthlyData).sort();
  const data = labels.map(label => monthlyData[label]);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.map(label => {
        const [year, month] = label.split('-');
        return `${year}-${month}`;
      }),
      datasets: [{
        label: 'Applications',
        data: data,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Create company chart
function createCompanyChart(jobs) {
  const ctx = companyChartCanvas.getContext('2d');

  // Count jobs by company
  const companyData = {};
  jobs.forEach(job => {
    companyData[job.company] = (companyData[job.company] || 0) + 1;
  });

  const labels = Object.keys(companyData);
  const data = labels.map(label => companyData[label]);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Applications',
        data: data,
        backgroundColor: '#007bff'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Display activity log
function displayActivityLog(jobs) {
  activityList.innerHTML = '';

  // Sort jobs by creation date (most recent first)
  const sortedJobs = jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  sortedJobs.slice(0, 10).forEach(job => {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';

    const action = job.status === 'Applied' ? 'Applied to' : `Status updated to ${job.status}`;
    const timestamp = new Date(job.createdAt).toLocaleString();

    activityItem.innerHTML = `
      <div>${action} <strong>${job.title}</strong> at <strong>${job.company}</strong></div>
      <div class="timestamp">${timestamp}</div>
    `;

    activityList.appendChild(activityItem);
  });
}

// Initialize
loadAnalytics();
