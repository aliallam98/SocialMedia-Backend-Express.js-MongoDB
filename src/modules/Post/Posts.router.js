import { Router } from "express"; 
import * as postController from './Posts.controller.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { endpoint } from "./Posts.endpoint.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as postValidators from './Posts.validators.js'
const router = Router();


router.route('/').get(postController.getAllPostsWithTheirComments)
.post(auth(endpoint.addNewPost),fileUpload(fileValidation.imageAndimage).fields([
  { name: "images", maxCount: 5 },
  { name: "videos", maxCount: 2 },
]),validation(postValidators.createNewPost),postController.addNewPost)


router.route('/:id').get(validation(postValidators.getPostById),postController.getPostById)
.put(auth(endpoint.addNewPost),fileUpload(fileValidation.imageAndimage).fields([
  { name: "images", maxCount: 5 },
  { name: "videos", maxCount: 2 },
]),validation(postValidators.updatePost),postController.updatePost)
.delete(auth(endpoint.delete) ,validation(postValidators.deletePost),postController.deletePost)

  router.patch('/likes/:id', auth(endpoint.likes),validation(postValidators.postLikesHandler),postController.postLikesHandler)
  router.get('/date/filter',validation(postValidators.dateFilter),postController.dateFilter)


export default router