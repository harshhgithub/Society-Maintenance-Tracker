const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createNotice, getNotices } = require('../controllers/noticeController');

router.post('/', auth, createNotice);
router.get('/', auth, getNotices);

module.exports = router;