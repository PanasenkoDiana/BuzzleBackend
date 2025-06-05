import { Router } from "express";
import { friendController } from "./friend.controller";

const friendRouter = Router() 

friendRouter.post("/send", friendController.sendRequest)
friendRouter.post("/accept", friendController.acceptRequest)
friendRouter.post("/cancel", friendController.cancelRequest)

friendRouter.get("/requests", friendController.getRequests)
friendRouter.get("/myRequests", friendController.getMyRequests)

export default friendRouter