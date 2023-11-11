import mongoose, { Schema, model,Types } from "mongoose";

const commentReplaySchema = new Schema(
  {
    replyBody: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: "User" },
    postId: { type: Types.ObjectId, ref: "Post" },
    commentId: { type: Types.ObjectId, ref: "Comment" },
    replies: [{ type: Types.ObjectId, ref: "CommentReplay" }],
    likes: [{ type: Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const commentReplayModel =
  mongoose.model.CommentReplay || model("CommentReplay", commentReplaySchema);

export default commentReplayModel;
