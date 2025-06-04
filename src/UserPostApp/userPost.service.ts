import { Tag } from "../generated/prisma";
import { PrismaClient } from "../prisma/client";
import { error, success } from "../tools/result";
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
	createPost: async function (data: CreateUserPost, images: string[] = []) {
		const fileNames = Promise.all(
			images.map((base64) => base64ToImage(base64))
		);

		const imagesData = (await fileNames).filter(
			(img): img is Image => "name" in img
		);

		console.log(imagesData);

		const newPost = await userPostRepository.createPost(data, imagesData);
		return success<UserPost>(newPost);
	},

	deletePost: async function (id: number) {
		const deletedPost = await userPostRepository.deletePost(id);
		return deletedPost;
	},

	updatePost: async function (
		id: number,
		data: UpdateUserPost
	): Promise<UserPost> {
		try {
			const imagesArray = Array.isArray(data.images) ? data.images : [];
			const tagsArray = Array.isArray(data.tags) ? data.tags : [];

			const updatedPost = await PrismaClient.user_Post.update({
				where: { id },
				data: {
					name: data.name,
					topic: data.topic ?? null,
					text: data.text ?? null,
					link: data.link ?? null,
					views: data.views ?? 0,
					likes: data.likes ?? 0,
					images:
						imagesArray.length > 0
							? {
									deleteMany: {},
									createMany: {
										data: imagesArray.map((path) => ({
											name: path.split("/").pop()!,
											path,
										})),
									},
							  }
							: undefined,
					tags:
						tagsArray.length > 0
							? {
									set: [],
									connectOrCreate: tagsArray.map(
										(tag: Tag) => ({
											where: { name: tag.name },
											create: { name: tag.name },
										})
									),
							  }
							: undefined,
				},
				include: { tags: true, images: true },
			});

			return updatedPost;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getPostById: async function (id: number) {
		let post = await userPostRepository.getPostById(id);
		return post;
	},

	getAllPosts: async function () {
		let allPosts = await userPostRepository.getAllPosts();

		if (!allPosts) return error("123123");

		return success<UserPost[]>(allPosts);
	},
};
