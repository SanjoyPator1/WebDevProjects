import { Schema, model } from "mongoose";
const chatSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date
    },
    seen: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const ChatModel = model("Chat", chatSchema);
export default ChatModel;
