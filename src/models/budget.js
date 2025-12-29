const mongoose = require('mongoose');


const budgetSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		year: {
			type: Number,
			required: true,
			min: 2000,
			max: 3000,
		},
		month: {
			type: Number,
			required: true,
			min: 1,
			max: 12,
		},

		currency: {
			type: String,
			trim: true,
			uppercase: true,
			default: 'INR',
		},

		incomeGoal: {
			type: Number,
			min: 0,
			default: 0,
		},
		savingsTarget: {
			type: Number,
			min: 0,
			default: 0,
		},
		spendingLimit: {
			type: Number,
			min: 0,
			default: 0,
		},
		notes: {
			type: String,
			trim: true,
			maxlength: 1000,
		},
		status: {
			type: String,
			trim: true,
			enum: ['active', 'archived'],
			default: 'active',
			index: true,
		},
		metadata: {
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: true,
	}
);

budgetSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);

