import { Schema, model } from "mongoose";
//userA = sender
//userB = receiver
const friendshipSchema = new Schema({
    // the user who sends friendRequest
    userA: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // the user who receives friendRequest
    userB: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "cancelled"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const FriendshipModel = model("Friendship", friendshipSchema);
export default FriendshipModel;
