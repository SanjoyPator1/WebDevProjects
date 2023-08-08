import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
    creatorUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    module: {
        type: String,
        enum: ['POST', 'FRIEND_REQUEST'],
        required: true,
    },
    action: {
        type: String,
        enum: ['LIKE', 'COMMENT', 'SEND_FRIEND_REQUEST', 'ACCEPTED_FRIEND_REQUEST'],
        required: true,
    },
    linkId: {
        type: mongoose.Schema.Types.ObjectId
    },
    seen: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
