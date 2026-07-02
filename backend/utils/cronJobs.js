const cron = require('node-cron');
const Complaint = require('../models/Complaint');

const OVERDUE_DAYS = 7; // configurable

// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - OVERDUE_DAYS);

    await Complaint.updateMany(
      {
        status: { $ne: 'resolved' },
        createdAt: { $lt: threshold },
        isOverdue: false
      },
      { $set: { isOverdue: true } }
    );

    console.log('Overdue complaints updated');
  } catch (err) {
    console.log('Cron error:', err.message);
  }
});