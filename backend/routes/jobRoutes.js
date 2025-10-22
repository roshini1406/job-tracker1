const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
} = require('../controllers/jobController');

const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.route('/').get(protect, getJobs).post(protect, upload.single('resume'), createJob);
router.route('/stats').get(protect, getJobStats);
router.route('/:id').get(protect, getJob).put(protect, updateJob).delete(protect, deleteJob);

module.exports = router;
