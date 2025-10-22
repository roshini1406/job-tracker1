# Job Tracker App

A full-stack job application tracking system built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

## Features

- User authentication (signup, login, logout)
- CRUD operations for job applications
- Dashboard with statistics and charts
- Search and filter functionality
- Email reminders for follow-ups
- File upload for resumes
- Dark/Light theme toggle
- Analytics page with visual data
- Activity log
- Responsive design

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Email:** Nodemailer
- **Charts:** Chart.js
- **File Upload:** Multer
- **Scheduler:** node-cron

## Project Structure

```
job-tracker/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   ├── models/
│   │   ├── User.js
│   │   └── Job.js
│   ├── controllers/
│   ├── middleware/
│   └── config/
│       └── db.js
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── login.html
│   ├── register.html
│   ├── analytics.html
│   ├── css/
│   └── js/
├── uploads/
├── package.json
└── README.md
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Start MongoDB
5. Run the application: `npm run dev`

## Environment Variables

Create a `.env` file in the root directory with:

```
MONGO_URI=mongodb://localhost:27017/jobtracker
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## API Endpoints

- POST /api/auth/register - Create user
- POST /api/auth/login - Login user
- GET /api/jobs - Get all jobs for user
- POST /api/jobs - Add a new job
- PUT /api/jobs/:id - Update job
- DELETE /api/jobs/:id - Delete job
- GET /api/stats - Get analytics

## Deployment

- Backend: Render / Railway
- Database: MongoDB Atlas
- Frontend: Netlify or GitHub Pages
