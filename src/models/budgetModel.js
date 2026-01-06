const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  month: {
    type: String, // YYYY-MM
    required: true
  },
  monthlyGoal: {
    type: Number,
    required: true
  },
  savingsTarget: {
    type: Number,
    required: true
  }
}, { timestamps: true });

budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
