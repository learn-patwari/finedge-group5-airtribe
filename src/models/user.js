const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        preferences: {
            type: [String],
            default: [],
        },
        defaultCurrency: {
            type: String,
            trim: true,
            uppercase: true,
            default: 'INR',
        },
    },
    {
        timestamps: true,
    }
);

usersSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', usersSchema);
