import { Router } from "express";
import { friendController } from "./friend.controller";

const friendRouter = Router() 

friendRouter.get("/", friendController.getAllFriends)
friendRouter.get("/recommends", friendController.getRecommends)
friendRouter.get("/requests", friendController.getRequests)
friendRouter.get("/myRequests", friendController.getMyRequests)

friendRouter.post("/send", friendController.sendRequest)
friendRouter.post("/accept", friendController.acceptRequest)
friendRouter.post("/cancel", friendController.cancelRequest)

export default friendRouter