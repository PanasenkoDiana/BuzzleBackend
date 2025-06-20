import { prismaClient } from "../prisma/client";
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
			const newPost = await prismaClient.post.create({
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
			const post = await prismaClient.post.findFirst({
				where: {
					id: postId,
				},
			});

			if (post?.authorId !== userId) {
				return "you're not the owner";
			}

			await prismaClient.post.delete({
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
			await prismaClient.image.deleteMany({
				where: {
					postId: postId,
				},
			});

			const updatedPost = await prismaClient.post.update({
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

	getPostById: async function (id: number) {
		try {
			const post = await prismaClient.post.findUnique({
				where: { id },
				include: {
					tags: true,
					images: true,
					author: {
						omit: {
							password: true,
							email: true,
						},
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
					}
				},
			});
			return post;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getAllPosts: async function () {
		try {
			const allPosts = await prismaClient.post.findMany({
				include: {
					tags: true,
					images: true,
					author: {
						omit: {
							password: true,
							email: true
						},
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
			return allPosts;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getMyPosts: async function (id: number) {
		try {
			const myPosts = await prismaClient.post.findMany({
				where: {
					authorId: id,
				},
				include: {
					tags: true,
					images: true,
					author: {
						omit: {
							password: true,
							email: true,
						},
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
					}
				},
			});
			return myPosts;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
};
