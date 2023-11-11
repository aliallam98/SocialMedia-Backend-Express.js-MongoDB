import userRouter from './modules/user/user.router.js'
import postRouter from './modules/Post/Posts.router.js'
import commentRouter from './modules/Comment/Comments.router.js'
import commentReplayRouter from './modules/commentReplay/commentReplay.router.js'
import connectDB from '../DB/connection.js'
import { globalErrorHandling } from './utils/errorHandling.js'
import { NotConfirmedEmailsReminder } from './utils/Reuseable.js'


const initApp = (app,express)=>{
    
    app.use(express.json())

    app.get('/', (req,res,next)=> res.json({message:"Home Page"}))
    app.use(`/user`, userRouter)
    app.use(`/post`, postRouter)
    app.use(`/comment`, commentRouter)
    app.use(`/commentreplay`, commentReplayRouter)
    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Please Check Url Or Method")
    })

    NotConfirmedEmailsReminder()

    app.use(globalErrorHandling)
    connectDB()

}

export default initApp