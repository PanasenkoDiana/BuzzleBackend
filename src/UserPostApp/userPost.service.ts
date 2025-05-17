import { userPostRepository } from "./userPost.repository";
import { CreateUserPost, UserPost } from "./userPost.type";
// name topic tags text images
export const userPostService = {
    createPost: async function (data: CreateUserPost) {
        let newPost = userPostRepository.createPost(data)

        return newPost
    },
    deletePost: async function (id: number) {
        let deletedPost = userPostRepository.deletePost(id)

        return deletedPost
    },
    updatePost: async function (data: UserPost) {
        let changedPost = userPostRepository.createPost(data)

        return changedPost
    },
}