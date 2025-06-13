import express from "express";
import userRouter from "./UserApp/user.router";
import cors from "cors";
import dotenv from "dotenv";
import userPostRouter from "./UserPostApp/userPost.router";
import tagRouter from "./TagApp/tag.router";
import albumRouter from './AlbumApp/album.router'
import path from "path";
import friendRouter from "./FriendApp/friend.router";

const app = express();
const HOST = "localhost";
const PORT = 8000;

dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use("/media", express.static(path.join(__dirname, "../", "media")))

app.use("/api/user", userRouter);
app.use("/api/posts", userPostRouter);
app.use("/api/tags", tagRouter);
app.use("/api/friends", friendRouter);
app.use("/api/tags", tagRouter)
app.use("/api/albums", albumRouter)

app.listen(PORT, HOST, () => {
	console.log(`Server running at http://${HOST}:${PORT}`);
});
