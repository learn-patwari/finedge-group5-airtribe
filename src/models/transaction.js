const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
            // default: function () {
            //     return this._id; // Set userId to the same value as _id
            // },
        },
        type: {
            type: String,
            required: true,
            trim: true,
            enum: ['credit', 'debit', 'transfer'],
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            trim: true,
            uppercase: true,
            default: 'INR',
        },
        category: {
            type: String,
            trim: true,
            index: true,
        },
        subcategory: {
            type: String,
            trim: true,
        },
        occurredAt: {
            type: Date,
            required: true,
            default: Date.now,
            index: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        paymentMethod: {
            type: String,
            trim: true,
            enum: ['cash', 'card', 'upi', 'bank_transfer', 'wallet', 'other'],
            default: 'other',
        },
        account: {
            type: String,
            trim: true,
        },
        transferAccount: {
            type: String,
            trim: true,
        },
        merchant: {
            type: String,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            trim: true,
            enum: ['pending', 'success', 'cancelled'],
            default: 'success',
            index: true,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
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

transactionSchema.index({ userId: 1, occurredAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
