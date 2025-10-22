const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  jobUrl: {
    type: String,
  },
  reminderDate: {
    type: Date,
  },
  resumeFile: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Job', jobSchema);
