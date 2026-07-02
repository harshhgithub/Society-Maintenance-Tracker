const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateStatus,
  setPriority
} = require('../controllers/complaintController');

router.post('/', auth, upload.single('photo'), createComplaint);
router.get('/my', auth, getMyComplaints);
router.get('/all', auth, getAllComplaints);
router.put('/:id/status', auth, updateStatus);
router.put('/:id/priority', auth, setPriority);

module.exports = router;