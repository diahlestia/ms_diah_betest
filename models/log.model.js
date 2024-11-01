import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    operation: {
        type: String,
        enum: ['LOGIN', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);

export default Log;
