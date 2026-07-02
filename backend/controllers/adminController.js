const Complaint = require('../models/Complaint');

exports.getDashboard = async (req, res) => {
  try {
    const totalByStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const totalByCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const overdueCount = await Complaint.countDocuments({ isOverdue: true });

    res.json({ totalByStatus, totalByCategory, overdueCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};