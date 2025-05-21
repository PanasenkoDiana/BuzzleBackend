import { userPostService } from "./userPost.service";
import { Request, Response } from "express";

export const userPostController = {
	createPost: async function (req: Request, res: Response) {
		const data = req.body;
		const result = await userPostService.createPost(data);
		res.json(result);
	},
	deletePost: async function (req: Request, res: Response) {
		const data = req.body;
		const result = await userPostService.deletePost(data.id);
		res.json(result);
	},
	changePost: async function (req: Request, res: Response) {
		const { id, ...postData } = req.body;
		const result = await userPostService.updatePost(id, postData);
		res.json(result);
	},
	getPostById: async function (req: Request, res: Response) {
		const id = parseInt(req.params.id);
		const result = await userPostService.getPostById(id);
		res.json(result);
	},
	getAllPosts: async function (req: Request, res: Response) {
		const result = await userPostService.getAllPosts();
		res.json(result);
	},
};
