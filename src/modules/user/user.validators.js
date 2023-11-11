import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signUP = {
  body: joi.object().required().keys({
    name: generalFields.name,
    email:generalFields.email,
    password: joi.string().min(6).max(30).required(),
    phone:joi.string().required(),
    age:joi.number().positive().integer().required()
  }),
  files: generalFields.file,
  params: joi.object().required().keys(),
  query: joi.object().required().keys(),
};
export const confirmUser = {
    body: joi.object().required().keys({
        email: generalFields.email,
        OTP:joi.string().required(),
      }),
      files: generalFields.file,
      params: joi.object().required().keys(),
      query: joi.object().required().keys(),
};
export const logIn = {
  body: joi.object().required().keys({
    email:generalFields.email,
    password:joi.string().required()
  }),
  file: generalFields.file,
  params: joi.object().required().keys(),
  query: joi.object().required().keys(),
};
export const getProfileById = {
  body: joi.object().required().keys(),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id }),
  query: joi.object().required().keys(),
};
export const forgetPassword = {
  body: joi.object().required().keys({
    email:generalFields.email,
  }),
  file: generalFields.file,
  params: joi.object().required().keys(),
  query: joi.object().required().keys(),
};
export const resetPassword = {
  body: joi.object().required().keys({
    email:generalFields.email,
    OTP:joi.string().required(),
    newPassword:joi.string().min(6).max(30).required()
  }),
  file: generalFields.file,
  params: joi.object().required().keys(),
  query: joi.object().required().keys(),
};
export const updatePassword = {
  body: joi.object().required().keys({
    oldPassword:joi.string().required(),
    newPassword:joi.string().min(6).max(30).required(),
    confirmNewPassword:joi.ref("newPassword")
  }),
  file: generalFields.file,
  params: joi.object().required().keys(),
  query: joi.object().required().keys(),
};
export const addProfileImage = {
  body: joi.object().required().keys({
  }),
  file: generalFields.file,
  params: joi.object().required().keys(),
  query: joi.object().required().keys(),
};
export const addProfileCoverImage = {
    body: joi.object().required().keys({
    }),
    file: generalFields.file,
    params: joi.object().required().keys(),
    query: joi.object().required().keys(),
};

