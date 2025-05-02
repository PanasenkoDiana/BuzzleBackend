import express from 'express'
import userRouter from './UserApp/user.routers'

const app = express()
const HOST = 'localhost'
const PORT = 8000

app.use('/api/user', userRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});