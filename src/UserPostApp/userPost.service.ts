import { Tag } from "../generated/prisma";
import { PrismaClient } from "../prisma/client";
import { error, Result, success } from "../tools/result";
import { userPostRepository } from "./userPost.repository";
import {
	CreateUserPost,
	ImageCreateMany,
	UpdateUserPost,
	UserPost,
	Image,
} from "./userPost.type";
import { base64ToImage } from "../tools/base64ToImage";

export const userPostService = {
	createPost: async function (
		userId: number,
		data: CreateUserPost,
		images: string[] = []
	): Promise<Result<UserPost>> {
		const fileNames = Promise.all(
			images.map((base64) => base64ToImage(base64))
		);

		const imagesData = (await fileNames).filter(
			(img): img is Image => "name" in img
		);

		console.log(imagesData);

		const newPost = await userPostRepository.createPost(
			userId,
			data,
			imagesData
		);
		return success<UserPost>(newPost);
	},

	deletePost: async function (userId: number, postId: number): Promise<Result<string>> {
		try {
			console.log(postId)
			const deletedPost = await userPostRepository.deletePost(userId, postId);
			return success(deletedPost);
		} catch(err) {
			console.log(err)
			return error("deletePost error")
		}
	},

	updatePost: async function (
		userId: number,
		postId: number,
		data: UpdateUserPost,
		images: string[]
	): Promise<Result<UserPost>> {
		try {
			const fileNames = Promise.all(
				images.map((base64) => base64ToImage(base64))
			);

			const imagesData = (await fileNames).filter(
				(img): img is Image => "name" in img
			);

			const updatedPost = await userPostRepository.updatePost(
				userId,
				postId,
				data,
				imagesData
			);

			if (!updatedPost) {
				return error("updatePost error");
			}

			return success(updatedPost);
		} catch (err) {
			console.log(err);
			return error("updatePost error");
		}
	},

	getPostById: async function (id: number): Promise<Result<UserPost>> {
		try {
			const post = await userPostRepository.getPostById(id);
			if (!post) {
				return error("getPostById error");
			}

			return success(post);
		} catch (err) {
			console.log(err);
			return error("getPostById error");
		}
	},

	getAllPosts: async function (): Promise<Result<UserPost[]>> {
		try {
			const allPosts = await userPostRepository.getAllPosts();
			return success(allPosts);
		} catch (err) {
			console.log(err);
			return error("getAllPosts error");
		}
	},
	getMyPosts: async function (id: number): Promise<Result<UserPost[]>> {
		try {
			const myPosts = await userPostRepository.getMyPosts(id);
			return success(myPosts);
		} catch (err) {
			console.log(err);
			return error("getMyPosts error");
		}
	},
};
