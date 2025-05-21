import { PrismaClient } from "../prisma/client";
import { CreateUserPost, UserPost } from "./userPost.type";

export const userPostRepository = {
	createPost: async function (data: CreateUserPost): Promise<UserPost> {
		try {
			const newPost = await PrismaClient.user_Post.create({
				data: {
					name: data.name,
					topic: data.topic ?? null,
					text: data.text ?? null,
					link: data.link ?? null,
					images:
						Array.isArray(data.images) && data.images.length > 0
							? {
									createMany: {
										data: data.images.map((path) => ({
											name: path.split("/").pop()!,
											path: path,
										})),
									},
							  }
							: undefined,
					views: data.views ?? 0,
					likes: data.likes ?? 0,
					...(data.tags && data.tags.length > 0
						? {
								tags: {
									connectOrCreate: (
										data.tags as (
											| string
											| { name: string }
										)[]
									).map((tag) => {
										const tagName =
											typeof tag === "string"
												? tag
												: tag.name;
										return {
											where: { name: tagName },
											create: { name: tagName },
										};
									}),
								},
						  }
						: {}),
				},
				include: {
					tags: true,
				},
			});
			return newPost;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	deletePost: async function (id: number) {
		try {
			const deletedPost = await PrismaClient.user_Post.delete({
				where: { id },
			});
			return deletedPost;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	updatePost: async function (data: UserPost, id: number) {
		try {
			const updatedPost = await PrismaClient.user_Post.update({
				where: { id },
				data,
			});
			return updatedPost;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getPostById: async function (id: number) {
		try {
			const post = await PrismaClient.user_Post.findUnique({
				where: { id },
			});
			return post;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getAllPosts: async function () {
		try {
			const allPosts = await PrismaClient.user_Post.findMany();
			return allPosts;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
};
