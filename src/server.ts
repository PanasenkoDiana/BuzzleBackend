import express from "express";
import userRouter from "./UserApp/user.router";
import cors from "cors";
import dotenv from "dotenv";
import userPostRouter from "./UserPostApp/userPost.router";
import tagRouter from "./TagApp/tag.router";

const app = express();
const HOST = "192.168.3.4";
const PORT = 8000;

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/posts", userPostRouter);
app.use("/api/tags", tagRouter)

app.listen(PORT, HOST, () => {
	console.log(`Server running at http://${HOST}:${PORT}`);
});
