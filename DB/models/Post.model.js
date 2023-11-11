import mongoose, { Schema, model, Types } from "mongoose";
import commentReplayModel from "./CommentReplay.Modle.js";
import commentModel from './Comment.model.js'

const postSchema = new Schema(
  {
    content: { type: String, required: true },
    images: [{}],
    video: [{}],
    likes: [{ type: Types.ObjectId, ref: "User" }],
    createdBy: { type: Types.ObjectId, ref: "User" },
    comments: [{ type: Types.ObjectId, ref: "Comment" }],
    privacy: {
      type: String,
      enum: ["Public", "Only Me", "Private"],
      default: "Public",
    },
  },
  {
    timestamps: true,
  }
);


postSchema.post('findOneAndDelete',async function(doc){
  const comments = await commentModel.deleteMany({postId:doc._id})
  const commentsReplay = await commentReplayModel.deleteMany({commentId:comments._id})
})

const postModel = mongoose.model.Post || model("Post", postSchema);

export default postModel;
