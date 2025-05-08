import express from 'express'
import userRouter from './UserApp/user.routers'
import cors from 'cors'
import dotenv from 'dotenv';

const app = express()
const HOST = '192.168.3.4'
const PORT = 8000

dotenv.config();

app.use(cors())
app.use(express.json());

app.use('/api/user', userRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});