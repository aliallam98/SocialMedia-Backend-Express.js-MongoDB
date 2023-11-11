import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createNewComment = {
  body: joi.object().required().keys({
    commentBody: generalFields.name,
  }),
  file: generalFields.file,
  params: joi.object().required().keys({
    id: generalFields.id,
  }),
  query: joi.object().required().keys(),
};
export const updateComment = {
    body: joi.object().required().keys({
        commentBody: generalFields.name,
      }),
      file: generalFields.file,
      params: joi.object().required().keys({
        id: generalFields.id,
      }),
      query: joi.object().required().keys(),
};
export const deleteComment = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
export const getCommentById = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
export const commentLikesHandler = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
