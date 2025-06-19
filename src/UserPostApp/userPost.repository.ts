import { PrismaClient } from "../prisma/client";
import {
	CreateUserPost,
	UpdateUserPost,
	UserPost,
	Image,
	UserPostWithoutIncludes,
} from "./userPost.type";

export const userPostRepository = {
	createPost: async function (
		userId: number,
		data: CreateUserPost,
		imagesData: {filename: string; file: string}[]
	): Promise<UserPostWithoutIncludes> {
		try {
			const newPost = await PrismaClient.post.create({
				data: {
					// title: data.name,
					title: data.title,
					content: data.content,
					
					// topic: data.topic ?? null,
					// content: data.text ?? null,
					// links: data.link ?? null,
					// views: data.views ?? 0,
					// likes: data.likes ?? 0,

					author: {
						connect: {
							id: userId,
						},
					},


					// ...(data.)
					// images: imagesData.map(()=>{
					// 	return create: {
							
					// 	}
					// })
					// ,

					images: {
						createMany: {
							data: imagesData
						}
					},

					...(data.tags
						? {
								tags: {
									connectOrCreate: data.tags.map((tag) => {
										let tagName = typeof tag === "string" ? tag : tag.name;
										if (!tagName.startsWith("#")) {
											tagName = `#${tagName}`;
										}
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
					images: true,
					author: {
						include: {
							Profile: {
								include: {
									avatars: {
										include: {
											image: true
										}
									}
								}
							}
						}
					},
				},
			});
			return newPost;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	deletePost: async function (userId: number, postId: number) {
		try {
			const post = await PrismaClient.post.findFirst({
				where: {
					id: postId,
				},
			});

			if (post?.authorId !== userId) {
				return "you're not the owner";
			}

			await PrismaClient.post.delete({
				where: {
					id: postId,
				},
			});
			return `Post ${postId} successfully deleted`;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	updatePost: async function (
		userId: number,
		postId: number,
		data: UpdateUserPost,
		imagesData: {filename: string; file: string}[]
	) {
		try {
			await PrismaClient.image.deleteMany({
				where: {
					postId: postId,
				},
			});

			const updatedPost = await PrismaClient.post.update({
				where: {
					id: postId,
				},
				data: {
					...data,
					images: {
						createMany: {
							data: imagesData,
						},
					},
				},
				include: {
					author: true,
					images: true,
					tags: true,
				},
			});

			return updatedPost;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	getPostById: async function (id: number): Promise<UserPost | null> {
		try {
			const post = await PrismaClient.post.findUnique({
				where: { id },
				include: {
					tags: true,
					images: true,
					author: true,
				},
			});
			return post;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getAllPosts: async function (): Promise<UserPost[]> {
		try {
			const allPosts = await PrismaClient.post.findMany({
				include: {
					tags: true,
					images: true,
					author: true,
				},
			});
			return allPosts;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getMyPosts: async function (id: number): Promise<UserPost[]> {
		try {
			const myPosts = await PrismaClient.post.findMany({
				where: {
					authorId: id,
				},
				include: {
					tags: true,
					images: true,
					author: true,
				},
			});
			return myPosts;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
};
