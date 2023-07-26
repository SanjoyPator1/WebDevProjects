import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel = model("Comment", commentSchema);
export default CommentModel;