import commentReplayModel from "../../../DB/models/CommentReplay.Modle.js";
import CommentModel from "../../../DB/models/Comment.model.js";
import postModel from "../../../DB/models/Post.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import { deleteOneById, getOneById } from "../../utils/Reuseable.js";
import { asyncHandler } from "../../utils/errorHandling.js";

// ceateNewcommentReplayController
export const ceateNewcommentReplay = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.body;
  const isExistPost = await postModel.findById(postId);
  if (!isExistPost) return next(new ErrorClass("Invaild Post Id", 404));

  const isExistComment = await CommentModel.findById(commentId);
  if (!isExistComment) return next(new ErrorClass("Invaild Comment Id", 404));

  req.body.createdBy = req.user._id;
  req.body.commentId = isExistComment._id;
  req.body.postId = isExistComment.postId;

  const commentReplay = await commentReplayModel.create(req.body);
  isExistComment.replies.push(commentReplay._id);
  isExistComment.save();
  return res.status(201).json({ message: "Done", commentReplay });
});
// updatecommentReplay
export const updatecommentReplay = asyncHandler(async (req, res, next) => {
  // commentId
  const {commentReplayId } = req.body;
  // const isExistComment = await CommentModel.findById(commentId);
  // if (!isExistComment) return next(new ErrorClass("Invaild Comment Id", 404));
  const isExistcommentReplay = await commentReplayModel.findById(
    commentReplayId
  );
  if (!isExistcommentReplay)
    return next(new ErrorClass("This commentReplay Is Not Exist", 404));
  if (isExistcommentReplay.createdBy.toString() !== req.user._id.toString())
    return next(new ErrorClass("Not Auth To update This Comment", 401));


    isExistcommentReplay.replyBody = req.body.replyBody
    isExistcommentReplay.save()
    return res.status(200).json({message:"Done", isExistcommentReplay})
});
// deletecommentReplay
export const deletecommentReplay = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // const isExistcommentReplay = await commentReplayModel.findOneAndDelete({_id:id, createdBy:req.user._id});
  const isExistcommentReplay = await commentReplayModel.findById(id);
  if (!isExistcommentReplay)
    return next(new ErrorClass("This commentReplay Is Not Exist", 404));
  const isAuth = await commentReplayModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!isAuth) return next(new ErrorClass("Not Auth To delete This", 401));
  return res.status(200).json({ message: "Deleted Successfully" });
});
//commentReplaysLikesHandler
export const commentReplaysLikesHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const commentReplay = await commentReplayModel.findById(id);
    if (!commentReplay) {
      return next(new ErrorClass("This commentReplay is Not Exist", 404));
    }

    // i will use save() method and we can handle it by addtoset and pull
    if (!commentReplay.likes.includes(req.user._id)) {
      commentReplay.likes.push(req.user._id);
      commentReplay.save();
    } else {
      commentReplay.likes.pop(req.user._id);
      commentReplay.save();
    }
    return res.status(200).json({ message: "Done", commentReplay });
  }
);

// getcommentReplayById
export const getcommentReplayById = getOneById(commentReplayModel);
// getAllcommentReplays
export const getAllcommentReplays = asyncHandler(async (req, res, next) => {
  const allcommentReplays = await commentReplayModel.find({});
  return res.status(200).json({ message: "Done", allcommentReplays });
});
