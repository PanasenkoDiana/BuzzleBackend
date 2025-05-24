import { PrismaClient } from "../prisma/client";
import { CreateUserPost, ImageCreateMany, UpdateUserPost, UserPost, Image } from "./userPost.type";

export const userPostRepository = {
	createPost: async function (data: CreateUserPost, images: Image[]): Promise<UserPost> {
		try {
			const newPost = await PrismaClient.user_Post.create({
				data: {
					name: data.name,
					topic: data.topic ?? null,
					text: data.text ?? null,
					link: data.link ?? null,
					images: {
						createMany: {
							data: images
						}
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

	updatePost: async function (
		data: UpdateUserPost,
		id: number
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
										(tagName) => {
											if (
												typeof tagName === "string" &&
												!tagName.startsWith("#")
											) {
												tagName = `#${tagName}`;
											} else if (
												typeof tagName === "object" &&
												tagName.name &&
												!tagName.name.startsWith("#")
											) {
												tagName = {
													...tagName,
													name: `#${tagName.name}`,
												};
											}
											return {
												where: {
													name:
														typeof tagName ===
														"string"
															? tagName
															: tagName.name,
												},
												create: {
													name:
														typeof tagName ===
														"string"
															? tagName
															: tagName.name,
												},
											};
										}
									),
							  }
							: undefined,
				},
				include: {
					tags: true,
					images: true,
				},
			});
			return updatedPost;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getPostById: async function (id: number): Promise<UserPost | null> {
		try {
			const post = await PrismaClient.user_Post.findUnique({
				where: { id },
				include: {
					tags: true,
					images: true,
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
				},
			});
			return allPosts;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
};
