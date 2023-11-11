import userModel from "../../DB/models/User.model.js"
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
import { ErrorClass } from "../utils/ErrorClass.js";



// const auth = async (req, res, next) => {
//     try {
//         const { authorization } = req.headers;
//         if (!authorization?.startsWith(process.env.BEARER_KEY)) {
//             return res.json({ message: "In-valid bearer key" })
//         }
//         const token = authorization.split(process.env.BEARER_KEY)[1]
//         if (!token) {
//             return res.json({ message: "In-valid token" })
//         }
//         const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
//         if (!decoded?.id) {
//             return res.json({ message: "In-valid token payload" })
//         }
//         const authUser = await userModel.findById(decoded.id).select('userName email role')
//         if (!authUser) {
//             return res.json({ message: "Not register account" })
//         }
//         req.user = authUser;
//         return next()
//     } catch (error) {
//         return res.json({ message: "Catch error" , err:error?.message })
//     }
// }


export const roles = {
    admin : "Admin",
    user : "User"
}

export const auth = (roles = [])=>{
    return async(req,res,next)=>{
        try {

            const {authorization} = req.headers
            if(!authorization?.startsWith(process.env.BEARER_KEY)){
                return next(new ErrorClass("Authorization Is Required"))
            }
            const token = authorization.split(process.env.BEARER_KEY)[1]
            if(!token){
                return next(new ErrorClass("token Is Required"))
            }
            const decoded = verifyToken({token})
            if(!decoded?.id){
                return next(new ErrorClass("Invaild Payload Data"))
            }

            const user = await userModel.findById(decoded.id)
            if(!user){
                return next(new ErrorClass("Not Registered Account"))
            }
            if(!roles.includes(user.role)){
                return next(new ErrorClass("you arre Unauthorized ", 401))
            }
            req.user = user
            next()
    
        } catch (error) {
        return res.json({ message: "Catch error" , err:error?.message })
            
        }
    }
}

