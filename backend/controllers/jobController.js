const Job = require('../models/Job');

// @desc    Get all jobs for a user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(jobs);
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Make sure the logged in user matches the job user
  if (job.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  res.status(200).json(job);
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  const { title, company, status, dateApplied, notes, jobUrl, reminderDate } = req.body;

  if (!title || !company) {
    return res.status(400).json({ message: 'Please add title and company' });
  }

  const job = await Job.create({
    userId: req.user.id,
    title,
    company,
    status,
    dateApplied,
    notes,
    jobUrl,
    reminderDate,
    resumeFile: req.file ? req.file.filename : null,
  });

  res.status(201).json(job);
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Make sure the logged in user matches the job user
  if (job.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedJob);
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Make sure the logged in user matches the job user
  if (job.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await job.remove();

  res.status(200).json({ id: req.params.id });
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Private
const getJobStats = async (req, res) => {
  const jobs = await Job.find({ userId: req.user.id });

  const stats = {
    total: jobs.length,
    applied: jobs.filter(job => job.status === 'Applied').length,
    interviewing: jobs.filter(job => job.status === 'Interviewing').length,
    offers: jobs.filter(job => job.status === 'Offer').length,
    rejected: jobs.filter(job => job.status === 'Rejected').length,
  };

  res.status(200).json(stats);
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
};
