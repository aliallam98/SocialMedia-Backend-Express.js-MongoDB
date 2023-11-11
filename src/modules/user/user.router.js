import { Router } from "express";
import * as userController from './user.controller.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.js";
import { endpoint } from "./user.endpoint.js";
import { validation } from "../../middleware/validation.js";
import * as userValidators from './user.validators.js'
const router = Router();



router.get('/' ,userController.getAllUsers)
router.post('/signup', validation(userValidators.signUP),userController.signUP)
router.put('/confirmemail', validation(userValidators.confirmUser) ,userController.confirmUser)
router.post('/login' ,validation(userValidators.logIn),userController.logIn)
router.post('/profile' ,auth(endpoint.getProfile),userController.getloggedInProfile)
router.post('/profile/:id' ,validation(userValidators.getProfileById), userController.getProfileById)
router.patch('/profile/delete' ,auth(endpoint.delete), userController.getProfileById)
router.post('/forgetPassword',validation(userValidators.forgetPassword) ,userController.forgetPassword)
router.patch('/resetpassword' ,validation(userValidators.resetPassword),userController.resetPassword)
router.patch('/updatepassword',auth(endpoint.updatePassword),validation(userValidators.updatePassword) ,userController.updatePassword)


// Cloudinary

router.patch('/profileimage',auth(endpoint.addProfileImage),validation(userValidators.addProfileImage) ,fileUpload(fileValidation.image).single('image'),userController.addProfileImage)
router.patch('/profilecoverimage' , auth(endpoint.addProfileCoverImage),validation(userValidators.addProfileCoverImage) ,fileUpload(fileValidation.image).single('image') ,userController.addProfileCoverImage)


//Send And Cancel Friends Requests
router.patch('/sendrequest/:id' ,auth(endpoint.addProfileCoverImage), userController.sendFriendRequest)
router.patch('/cancelrequest/:id' ,auth(endpoint.addProfileCoverImage), userController.cancelFriendRequest)



export default router