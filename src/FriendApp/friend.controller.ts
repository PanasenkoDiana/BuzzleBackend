import { friendService } from "./friend.service";
import { Request, Response } from "express"

export const friendController = {
    sendRequest: async function (req: Request, res: Response) {
        const data = req.body
        const result = await friendService.sendRequest(data)
        res.json(result)
    },
    acceptRequest: async function (req: Request, res: Response) {
        const data = req.body
        const result = await friendService.acceptRequest(data)
        res.json(result)
    },
    cancelRequest: async function (req: Request, res: Response) {
        const data = req.body
        const result = await friendService.cancelRequest(data)
        res.json(result)
    },
    getAllFriends: async function (req: Request, res: Response) {
        const id: number = Number(res.locals.userId)
        const result = await friendService.getAllFriends(id)
        res.json(result)
    },
    getRequests: async function (req: Request, res: Response) {
        const id: number = Number(res.locals.userId)
        const result = await friendService.getRequests(id)
        res.json(result)
    },
    getMyRequests: async function (req: Request, res: Response) {
        const id: number = Number(res.locals.userId)
        const result = await friendService.getMyRequests(id)
        res.json(result)
    },
}