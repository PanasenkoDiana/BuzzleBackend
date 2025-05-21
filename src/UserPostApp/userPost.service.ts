import { PrismaClient } from "../prisma/client";
import { userPostRepository } from "./userPost.repository";
import { CreateUserPost, UserPost } from "./userPost.type";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const userPostService = {
	createPost: async function (data: CreateUserPost) {
		function base64ToImage(base64: string): string {
			const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/);
			if (!matches) {
				throw new Error("Неверный формат base64 изображения");
			}

			const mimeType = matches[1];
			const extension = mimeType.split("/")[1];
			const imageData = matches[2];

			const buffer = Buffer.from(imageData, "base64");
			const fileName = `${uuidv4()}.${extension}`;

			const mediaDir = path.join(__dirname, "..", "..", "media");
			const filePath = path.join(mediaDir, fileName);

			fs.writeFileSync(filePath, buffer);

			return `../../media/${fileName}`;
		}

		const savedPaths: string[] = Array.isArray(data.images)
			? data.images.map((base64) => base64ToImage(base64))
			: [];

		const newData = {
			...data,
			images: savedPaths,
		};
		let newPost = userPostRepository.createPost(data);
		return newPost;
	},
	deletePost: async function (id: number) {
		let deletedPost = userPostRepository.deletePost(id);

		return deletedPost;
	},
	updatePost: async function (
		id: number,
		data: CreateUserPost
	): Promise<UserPost> {
		try {
			const imagesArray = Array.isArray(data.images) ? data.images : [];
			const updatedPost = await PrismaClient.user_Post.update({
				where: { id },
				data: {
					name: data.name,
					topic: data.topic ?? null,
					text: data.text ?? null,
					link: data.link ?? null,
					images:
						imagesArray.length > 0
							? {
									deleteMany: {},
									createMany: {
										data: imagesArray.map((path) => ({
											name: path.split("/").pop()!,
											path: path,
										})),
									},
							  }
							: undefined,
					views: data.views ?? 0,
					likes: data.likes ?? 0,

					tags: data.tags
						? {
								set: [],
								connectOrCreate: data.tags.map((tagName) => ({
									where: { name: tagName },
									create: { name: tagName },
								})),
						  }
						: undefined,
				},
				include: { tags: true },
			});

			return updatedPost;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getPostById: async function (id: number) {
		let post = userPostRepository.getPostById(id);

		return post;
	},
	getAllPosts: async function () {
		let allPosts = userPostRepository.getAllPosts();

		return allPosts;
	},
};
