import { PrismaClient } from "../prisma/client"
import { CreateUser } from "./user.types"

export const UserRepositories = {
    createUser: async function(data: CreateUser) {
        try {
            const newUser = await PrismaClient.user.create({
                data: data
            })
            return newUser
        } catch(error) {
            console.log(error)
        }
    },
    findUserById: async function(id: number) {
        try {
            const user = await PrismaClient.user.findUnique({
                where: {
                    id: id
                }
            })
            return user
        } catch(error) {
            console.log(error)
        }
    },
    findUserByEmail: async function(email: string){
        try {
            const user = await PrismaClient.user.findUnique({
                where: {
                    email: email
                }
            })
            return user
        } catch(error) {
            console.log(error)
        }
    }

    
}
