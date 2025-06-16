import { Image } from "../generated/prisma";
import { error, Result, success } from "../tools/result";
import { PostRepository } from "./Post.repository";
import { CreateUserPost, UpdateUserPost, UserPost } from "./Post.type";
import { base64ToImage } from "../tools/base64ToImage";

export const userPostService = {
  createPost: async function (
    userId: number,
    data: CreateUserPost,
    imagesBase64: string[] = []
  ): Promise<Result<UserPost>> {
    try {
      const newImagesData: Omit<Image, "id">[] = [];

      for (const base64 of imagesBase64) {
        if (typeof base64 !== "string") {
          throw new Error("Expected base64 string in imagesBase64");
        }
        const img = await base64ToImage(base64);
        const { id, ...rest } = img as Image;
        newImagesData.push(rest);
      }

      const newPost = await PostRepository.createPost(
        userId,
        data,
        newImagesData
      );

      return success<UserPost>(newPost);
    } catch (err) {
      console.error(err);
      return error("createPost error");
    }
  },

  updatePost: async function (
    userId: number,
    postId: number,
    data: UpdateUserPost,
    images: (string | Image)[]
  ): Promise<Result<UserPost>> {
    try {
      const existingImages: Image[] = [];
      const newImagesBase64: string[] = [];

      for (const img of images) {
        if (typeof img === "string") {
          newImagesBase64.push(img);
        } else {
          existingImages.push(img);
        }
      }

      const newImagesData: Omit<Image, "id">[] = [];
      for (const base64 of newImagesBase64) {
        if (typeof base64 !== "string") {
          throw new Error("Expected base64 string in update images");
        }
        const img = await base64ToImage(base64);
        const { id, ...rest } = img as Image;
        newImagesData.push(rest);
      }

      const allImages: Omit<Image, "id">[] = [
        ...existingImages.map(({ id, ...rest }) => rest),
        ...newImagesData,
      ];

      const updatedPost = await PostRepository.updatePost(
        userId,
        postId,
        data,
        allImages as Image[]
      );

      return success<UserPost>(updatedPost);
    } catch (err) {
      console.error(err);
      return error("updatePost error");
    }
  },

  getPostById: async function (id: number): Promise<Result<UserPost>> {
    try {
      const post = await PostRepository.getPostById(id);
      if (!post) {
        return error("Post not found");
      }
      return success(post);
    } catch (err) {
      console.error(err);
      return error("getPostById error");
    }
  },

  getAllPosts: async function (): Promise<Result<UserPost[]>> {
    try {
      const allPosts = await PostRepository.getAllPosts();
      return success(allPosts);
    } catch (err) {
      console.error(err);
      return error("getAllPosts error");
    }
  },

  getMyPosts: async function (id: number): Promise<Result<UserPost[]>> {
    try {
      const myPosts = await PostRepository.getMyPosts(id);
      return success(myPosts);
    } catch (err) {
      console.error(err);
      return error("getMyPosts error");
    }
  },

  deletePost: async function (
    userId: number,
    postId: number
  ): Promise<Result<string>> {
    try {
      const deletedPost = await PostRepository.deletePost(userId, postId);
      return success(deletedPost);
    } catch (err) {
      console.error(err);
      return error("deletePost error");
    }
  },
};
