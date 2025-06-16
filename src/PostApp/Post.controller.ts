import { userPostService } from "./Post.service";
import { Request, Response } from "express";

export const userPostController = {
  createPost: async function (req: Request, res: Response) {
    try {
      const userId = Number(res.locals.userId);
      const { images, ...data } = req.body;

      const imagesBase64: string[] = Array.isArray(images)
        ? images.map((img) => (typeof img === "string" ? img : img.file))
        : [];

      const result = await userPostService.createPost(userId, data, imagesBase64);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "createPost controller error" });
    }
  },

  updatePost: async function (req: Request, res: Response) {
    try {
      const userId = Number(res.locals.userId);
      const { postId, images, ...data } = req.body;

      const result = await userPostService.updatePost(userId, postId, data, images);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "updatePost controller error" });
    }
  },

  deletePost: async function (req: Request, res: Response) {
    try {
      const userId = Number(res.locals.userId);
      const postId = Number(req.body.id);
      const result = await userPostService.deletePost(userId, postId);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "deletePost controller error" });
    }
  },

  getPostById: async function (req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await userPostService.getPostById(id);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "getPostById controller error" });
    }
  },

  getAllPosts: async function (req: Request, res: Response) {
    try {
      const result = await userPostService.getAllPosts();
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "getAllPosts controller error" });
    }
  },

  getMyPosts: async function (req: Request, res: Response) {
    try {
      const id = Number(res.locals.userId);
      const result = await userPostService.getMyPosts(id);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "getMyPosts controller error" });
    }
  },
};
