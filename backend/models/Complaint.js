const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  oldStatus: String,
  newStatus: String,
  note: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now }
});

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  photoUrl: { type: String },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  isOverdue: { type: Boolean, default: false },
  history: [historySchema]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);