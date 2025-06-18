import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authMiddlewares";
import { UserController } from "./user.controller";

const userRouter = Router();

userRouter.post("/register", UserController.createUser)
userRouter.post("/login", UserController.authUser)
userRouter.post("/verify", UserController.verifyUser)
userRouter.post("/register/second/:id", UserController.secondRegister)
userRouter.post("/change/part-one/:id", UserController.changeUserPartOne)
userRouter.post("/change/part-two/:id", UserController.changeUserPartTwo)

userRouter.post('/photo/create', authTokenMiddleware, UserController.addMyPhoto)

userRouter.post("/photo/create", authTokenMiddleware, UserController.addMyPhoto);
userRouter.delete("/photo/delete", authTokenMiddleware, UserController.deleteMyPhoto);
userRouter.get("/me", authTokenMiddleware, UserController.findUserById);

export default userRouter;
