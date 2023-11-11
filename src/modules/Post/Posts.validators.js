import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createNewPost = {
  body: joi.object().required().keys({
    content: generalFields.name,
    privacy:joi.string(),
  }),
  files: joi
    .object()
    .required()
    .keys({
      images: joi.array().items(generalFields.file.required()).max(5),
      videos: joi.array().items(generalFields.file).max(2),
    })
    .required(),
  params: joi.object().required().keys(),
  query: joi.object().required().keys(),
};
export const updatePost = {
    body: joi.object().required().keys({
        content: joi.string(),
        privacy:joi.string(),
      }),
      files: joi
        .object()
        .required()
        .keys({
          images: joi.array().items(generalFields.file.required()).max(5),
          videos: joi.array().items(generalFields.file).max(2),
        })
        .required(),
      params: joi.object().required().keys(
        {
            id:generalFields.id
        }
      ),
      query: joi.object().required().keys(),
};
export const deletePost = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
export const getPostById = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
export const postLikesHandler = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
export const dateFilter = {
  body: joi.object().required().keys({
    date:joi.string(),
    startDateRange:joi.string(),
    endDateRange:joi.string()
  }),
  file: generalFields.file,
  params: joi.object().required().keys(),
  query: joi.object().required().keys(),
};
