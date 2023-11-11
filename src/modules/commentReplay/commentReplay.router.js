import { Router } from "express";
import * as ReplayController from './commentReplay.controller.js'
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./commentReplay.endpoint.js"
import { validation } from "../../middleware/validation.js";
import * as relpaliesV from './commentReplay.validators.js'

const router = Router();

router.route('/').get(ReplayController.getAllcommentReplays)
.post(auth(endpoint.addComment),validation(relpaliesV.createNewCommentReplay),ReplayController.ceateNewcommentReplay)
.put(auth(endpoint.addComment),validation(relpaliesV.updateCommentReplay),ReplayController.updatecommentReplay)

router.route('/:id').get(validation(relpaliesV.getcommentReplayById) ,ReplayController.getcommentReplayById)
.delete(auth(endpoint.addComment),validation(relpaliesV.deleteCommentReplay),ReplayController.deletecommentReplay)
.patch(auth(endpoint.likes),validation(relpaliesV.commentReplayLikesHandler),ReplayController.commentReplaysLikesHandler)




export default router