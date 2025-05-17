import { PrismaClient } from "../prisma/client"
import { CreateUserPost, UserPost } from "./userPost.type"

export const userPostRepository = {
    createPost: async function (data: CreateUserPost) {
        try {
            const newPost = PrismaClient.user_Post.create({
                data:data
            })
            return newPost
        } catch(error) {
            console.log(error)
        }
    },
    deletePost: async function (id:number) {
        try {
            const deletedPost = PrismaClient.user_Post.delete({
                where: {
                    id:id
                }
            })
            return deletedPost
        } catch(error) {
            console.log(error)
        }
    },
    updatePost: async function (data: UserPost, id: number) {
        try {
            const updatedPost =  PrismaClient.user_Post.update({
                where: {
                    id:id
                },
                data:data
            })
        } catch(error) {
            console.log(error)
        }
    }
}