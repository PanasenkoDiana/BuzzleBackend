import { Request, Response } from "express"
import { UserService } from "./user.services";

export const UserController = {
    createUser: async function(req: Request, res: Response){
        const data = req.body
        const result = await UserService.createUser(data)
        res.json(result)
    },
    findUserByEmail: async function(req: Request, res: Response){
        const data = req.body
        const result = await UserService.findUserByEmail(data.email, data)
        res.json(result)
    },
    authUser: async function(req: Request, res: Response){
        const data = req.body
        const result = await UserService.authUser(data.email, data.password)
        
        res.json(result)
    },
    findUserById: async function(req: Request, res: Response){
        const id = res.locals.userId
        const result = await UserService.getUserByid(id)

        res.json(result)
    }
}