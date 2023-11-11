import { Router } from "express";
import * as commentController from './Comments.controller.js'
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./Comments.endpoint.js";
import * as commentV from './Comments.validators.js'
import { validation } from "../../middleware/validation.js";
const router = Router();

router.route('/').get(commentController.getAllComments)
router.route('/:id').get(validation(commentV.getCommentById),commentController.getCommentById)
.post(auth(endpoint.addComment),validation(commentV.createNewComment),commentController.ceateNewComment)
.patch(auth(endpoint.likes),validation(commentV.commentLikesHandler),commentController.commentsLikesHandler)
.delete(auth(endpoint.likes),validation(commentV.deleteComment),commentController.deleteComment)
.put(auth(endpoint.likes),validation(commentV.updateComment),commentController.updateComment)




export default router