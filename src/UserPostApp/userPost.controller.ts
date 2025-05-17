import { userPostService } from "./userPost.service"
import { CreateUserPost } from "./userPost.type"
import { Request, Response } from 'express'


export const userPostController = {
    createPost: async function (req: Request, res: Response) {
        const data = req.body
        const result = await userPostService.createPost(data)
        res.json(result)
    },
    deletePost: async function (req: Request, res: Response) {
        const data = req.body
        const result = await userPostService.deletePost(data.id)
        res.json(result)
    },
    changePost: async function (req: Request, res: Response) {
        const data = req.body
        const result = await userPostService.updatePost(data)
        res.json(result)
    },
}