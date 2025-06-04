import { Request, Response } from "express"
import { UserService } from "./user.service";

export const UserController = {
    createUser: async function(req: Request, res: Response){
        const data = req.body
        const result = await UserService.createUser(data)
        res.json(result)
    },
    findUserByEmail: async function(req: Request, res: Response){
        const data = req.body
        // const result = await UserService.findUserByEmail(data.email, data)
        // res.json(result)
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
    },
    verifyUser: async function(req: Request, res: Response) {
        const { email, code } = req.body
        const result = await UserService.verifyUser(email, code)

        res.json(result)
    },
    secondRegister: async function(req: Request, res: Response) {
        const id = req.params.id
        const data = req.body
        const result = await UserService.secondRegister(data, +id)

        res.json(result)

    },
    changeUserPartOne: async function(req: Request, res: Response) {
        const id = req.params.id
        const data = req.body
        const result = await UserService.changeUserPartOne(data, +id)

        res.json(result)
    },
    changeUserPartTwo: async function(req: Request, res: Response) {
        const id = req.params.id
        const data = req.body
        const result = await UserService.changeUserPartTwo(data, +id)

        res.json(result)
    },
}