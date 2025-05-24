import { Router } from 'express'
import { userPostController } from './userPost.controller'

const userPost = Router()

userPost.post('/create', userPostController.createPost)
userPost.delete('/delete', userPostController.deletePost)
userPost.put('/change', userPostController.changePost)
userPost.get('/post/:id', userPostController.getPostById)
userPost.get('/all', userPostController.getAllPosts)

export default userPost
