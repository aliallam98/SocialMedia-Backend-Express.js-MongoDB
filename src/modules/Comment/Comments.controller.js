import commentModel from "../../../DB/models/Comment.model.js";
import postModel from "../../../DB/models/Post.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import { deleteOneById, getOneById } from "../../utils/Reuseable.js";
import { asyncHandler } from "../../utils/errorHandling.js";


// ceateNewComment
export const ceateNewComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isExistPost = await postModel.findById(id);
  if (!isExistPost) return next(new ErrorClass("Invaild Post Id", 404));
  req.body.createdBy = req.user._id;
  req.body.postId = isExistPost._id;
  const comment = await commentModel.create(req.body);
  isExistPost.comments.push(comment._id);
  isExistPost.save();
  return res.status(201).json({ message: "Done", comment });
});
// updateComment
export const updateComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isExistcomment = await commentModel.findById(id);
  if (!isExistcomment) return next(new ErrorClass("Invaild comment Id", 404));
  const isAuth = await commentModel.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    req.body,
    { new: true }
  );
  if (!isAuth) return next(new ErrorClass("Not Auth To update This", 401));
  return res.status(200).json({message:"Done", isExistcomment})
});
// deleteComment
export const deleteComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // const isExistComment = await commentModel.findOneAndDelete({_id:id, createdBy:req.user._id});
  const isExistComment = await commentModel.findById(id);
  if (!isExistComment)
    return next(new ErrorClass("This Comment Is Not Exist", 404));
  const isAuth = await commentModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!isAuth) return next(new ErrorClass("Not Auth To delete This", 401));
  return res.status(200).json({ message: "Deleted Successfully" });
});
//commentsLikesHandler
export const commentsLikesHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const comment = await commentModel.findById(id);
  if (!comment) {
    return next(new ErrorClass("This comment is Not Exist", 404));
  }

  // i will use save() method and we can handle it by addtoset and pull
  if (!comment.likes.includes(req.user._id)) {
    comment.likes.push(req.user._id);
    comment.save();
  } else {
    comment.likes.pop(req.user._id);
    comment.save();
  }
  return res.status(200).json({ message: "Done", comment });
});


// getCommentById
export const getCommentById = getOneById(commentModel);
// getAllComments
export const getAllComments = asyncHandler(async (req, res, next) => {
  const allComments = await commentModel.find({})
  return res.status(200).json({message:"Done",allComments})
});
