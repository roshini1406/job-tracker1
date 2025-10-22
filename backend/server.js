const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Cron job for reminders
cron.schedule('0 9 * * *', async () => {
  // Check for reminders daily at 9 AM
  const Job = require('./models/Job');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const jobsWithReminders = await Job.find({
    reminderDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
  }).populate('userId');

  jobsWithReminders.forEach(async (job) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: job.userId.email,
      subject: 'Job Application Reminder',
      text: `Don't forget to follow up on your application for ${job.title} at ${job.company}.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Reminder sent for job: ${job.title}`);
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
