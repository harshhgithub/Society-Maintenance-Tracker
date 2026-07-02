const Notice = require('../models/Notice');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Admin: post a notice
exports.createNotice = async (req, res) => {
  try {
    const { content, isImportant, isPinned } = req.body;
    const notice = await Notice.create({
      admin: req.user.id,
      content,
      isImportant,
      isPinned
    });

    // Email all residents if important
    if (isImportant) {
      const residents = await User.find({ role: 'resident' });
      for (const resident of residents) {
        await sendEmail(
          resident.email,
          'Important Notice Posted',
          `A new important notice has been posted: ${content}`
        );
      }
    }

    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Everyone: get all notices (pinned first)
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ isPinned: -1, createdAt: -1 })
      .populate('admin', 'name');
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};