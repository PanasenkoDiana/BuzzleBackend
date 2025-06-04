import { Router } from 'express'
import { authTokenMiddleware } from '../middlewares/authMiddlewares';
import { UserController } from './user.controller';

const userRouter = Router()

userRouter.post("/register", UserController.createUser)
userRouter.post("/login", UserController.authUser)
userRouter.post("/verify", UserController.verifyUser)
userRouter.post("/register/second", UserController.secondRegister)
userRouter.post("/change/part-one")
userRouter.post("/change/part-two")

userRouter.get('/me', authTokenMiddleware, UserController.findUserById)

export default userRouter;