const Complaint = require('../models/Complaint');
const cloudinary = require('../utils/cloudinary');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// Resident: raise complaint
exports.createComplaint = async (req, res) => {
  try {
    const { category, description } = req.body;
    let photoUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'society_complaints'
      });
      photoUrl = result.secure_url;

      // Delete temp file after upload
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      category,
      description,
      photoUrl
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Resident: get own complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const { category, status, date } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (date) filter.createdAt = { $gte: new Date(date) };

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .sort({ isOverdue: -1, createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: update status
exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate('user');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const historyEntry = {
      oldStatus: complaint.status,
      newStatus: status,
      note,
      changedBy: req.user.id
    };

    complaint.history.push(historyEntry);
    complaint.status = status;
    if (status === 'resolved') complaint.isOverdue = false;
    await complaint.save();

    // Email resident
    await sendEmail(
      complaint.user.email,
      'Complaint Status Updated',
      `Your complaint "${complaint.description}" status changed to ${status}. Note: ${note || 'N/A'}`
    );

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: set priority
exports.setPriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};