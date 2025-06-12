import { PrismaClient } from "../prisma/client";
import {
	CreateUserPost,
	ImageCreateMany,
	UpdateUserPost,
	UserPost,
	Image,
} from "./userPost.type";

export const userPostRepository = {
	createPost: async function (
		userId: number,
		data: CreateUserPost,
		images: Image[]
	): Promise<UserPost> {
		try {
			const newPost = await PrismaClient.user_Post.create({
				data: {
					name: data.name,
					topic: data.topic ?? null,
					text: data.text ?? null,
					link: data.link ?? null,
					images: {
						createMany: {
							data: images,
						},
					},
					user: {
						connect: {
							id: userId,
						},
					},

					views: data.views ?? 0,
					likes: data.likes ?? 0,
					...(data.tags
						? {
								tags: {
									connectOrCreate: (
										data.tags as (
											| string
											| { name: string }
										)[]
									).map((tag) => {
										let tagName =
											typeof tag === "string"
												? tag
												: tag.name;
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
					user: true,
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
			const post = await PrismaClient.user_Post.findFirst({
				where: {
					id: postId
				},
			});

			if (post?.userId !== userId) {
				return "you`re not";
			}

			await PrismaClient.user_Post.delete({
				where: {
					id: postId
				},
			});
			return `Post ${postId} succesfuly deleted`;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	updatePost: async function (
		userId: number,
		postId: number,
		data: UpdateUserPost,
		images: Image[]
	) {
		try {
			await PrismaClient.image.deleteMany({
				where: {
					user_PostId: postId,
				},
			});

			const updatedPost = PrismaClient.user_Post.update({
				where: {
					id: postId,
				},
				data: {
					...data,
					images: {
						createMany: {
							data: images,
						},
					},
				},
				include: {
					user: true,
					images: true,
					tags: true,
				},
				omit: {
					userId: true,
				},
			});
			return updatedPost;
		} catch (err) {
			console.log(err);
		}
	},

	getPostById: async function (id: number): Promise<UserPost | null> {
		try {
			const post = await PrismaClient.user_Post.findUnique({
				where: { id },
				include: {
					tags: true,
					images: true,
					user: true,
				},
				omit: {
					userId: true,
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
			const allPosts = await PrismaClient.user_Post.findMany({
				include: {
					tags: true,
					images: true,
					user: true,
				},
				omit: {
					userId: true,
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
			const myPosts = await PrismaClient.user_Post.findMany({
				where: {
					userId: id
				},
				include: {
					tags: true,
					images: true,
					user: true,
				},
				omit: {
					userId: true,
				},
			});
			return myPosts;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
};
