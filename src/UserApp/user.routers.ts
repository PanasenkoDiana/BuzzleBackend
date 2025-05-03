import { Router } from 'express'
import { UserController } from './user.controllers';
import { authTokenMiddleware } from '../middlewares/authMiddlewares';

const userRouter = Router()

userRouter.post("/register", UserController.createUser)
userRouter.post("/login", UserController.authUser)

userRouter.get('/me', authTokenMiddleware, UserController.findUserById)

export default userRouter;