import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createNewCommentReplay = {
  body: joi.object().required().keys({
    replyBody: generalFields.name,
    postId: generalFields.id,
    commentId: generalFields.id,
  }),
  file: generalFields.file,
  params: joi.object().required().keys(),
  query: joi.object().required().keys(),
};
export const updateCommentReplay = {
    body: joi.object().required().keys({
        replyBody: generalFields.name,
        // commentId: generalFields.id,
        commentReplayId: generalFields.id,
      }),
      file: generalFields.file,
      params: joi.object().required().keys(),
      query: joi.object().required().keys(),
};
export const deleteCommentReplay = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
export const getCommentReplayById = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
export const commentReplayLikesHandler = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
