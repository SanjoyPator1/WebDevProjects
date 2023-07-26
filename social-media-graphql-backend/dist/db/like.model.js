import { Schema, model } from "mongoose";
const likeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const LikeModel = model("Like", likeSchema);
export default LikeModel;
