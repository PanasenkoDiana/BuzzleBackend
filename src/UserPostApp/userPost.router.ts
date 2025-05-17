import { Router } from 'express'

export { Router } from 'express'



const userPost = Router()



userPost.post('/create')

userPost.post('/delete')

userPost.put('/change')

export default userPost