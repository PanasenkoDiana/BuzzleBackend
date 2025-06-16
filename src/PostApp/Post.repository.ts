import { PrismaClient } from "../prisma/client";
import { CreateUserPost, UpdateUserPost, UserPost } from "./Post.type";
import { Image } from "../generated/prisma";


export const PostRepository = {
  createPost: async function (
    authorId: number,
    data: CreateUserPost,
    images: Omit<Image, "id">[]
  ): Promise<UserPost> {
    try {
      const newPost = await PrismaClient.post.create({
        data: {
          title: data.title,
          content: data.content ?? "",
          author: { connect: { id: authorId } },
          images: {
            create: images,
          },
          tags: data.tags
            ? {
                connectOrCreate: data.tags.map((tag) => {
                  const name = typeof tag === "string" ? tag : tag.name;
                  const tagName = name.startsWith("#") ? name : `#${name}`;
                  return {
                    where: { name: tagName },
                    create: { name: tagName },
                  };
                }),
              }
            : undefined,
        },
        include: {
          tags: true,
          images: true,
          author: true,
        },
      });

      return newPost;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updatePost: async function (
    authorId: number,
    postId: number,
    data: UpdateUserPost,
    images: Omit<Image, "id">[]
  ): Promise<UserPost> {
    try {
      const post = await PrismaClient.post.findUnique({ where: { id: postId } });

      if (!post || post.authorId !== authorId) {
        throw new Error("You're not the author of this post");
      }

      await PrismaClient.image.deleteMany({
        where: {
          posts: {
            some: { id: postId },
          },
        },
      });

      const tagData = data.tags
        ? {
            set: [],
            connectOrCreate: data.tags.map((tag) => {
              const name = typeof tag === "string" ? tag : tag.name;
              const tagName = name.startsWith("#") ? name : `#${name}`;
              return {
                where: { name: tagName },
                create: { name: tagName },
              };
            }),
          }
        : undefined;

      const updatedPost = await PrismaClient.post.update({
        where: { id: postId },
        data: {
          title: data.title,
          content: data.content ?? "",
          images: {
            create: images,
          },
          tags: tagData,
        },
        include: {
          author: true,
          images: true,
          tags: true,
        },
      });

      return updatedPost;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  deletePost: async function (authorId: number, postId: number): Promise<string> {
    try {
      const post = await PrismaClient.post.findUnique({
        where: { id: postId },
      });

      if (!post || post.authorId !== authorId) {
        return "You're not the author";
      }

      await PrismaClient.post.delete({ where: { id: postId } });
      return `Post ${postId} successfully deleted`;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPostById: async function (id: number): Promise<UserPost | null> {
    return await PrismaClient.post.findUnique({
      where: { id },
      include: {
        tags: true,
        images: true,
        author: true,
      },
    });
  },

  getAllPosts: async function (): Promise<UserPost[]> {
    return await PrismaClient.post.findMany({
      include: {
        tags: true,
        images: true,
        author: true,
      },
    });
  },

  getMyPosts: async function (authorId: number): Promise<UserPost[]> {
    return await PrismaClient.post.findMany({
      where: { authorId },
      include: {
        tags: true,
        images: true,
        author: true,
      },
    });
  },
};
