import { Schema, model } from "mongoose";
const postSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});
const PostModel = model("Post", postSchema);
export default PostModel;
