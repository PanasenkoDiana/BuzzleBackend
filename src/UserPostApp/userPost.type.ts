import { Prisma } from "../generated/prisma";

export type UserPost = Prisma.User_PostGetPayload<{}>

export interface CreateUserPost {
  name: string;
  topic?: string;
  text?: string;
  link?: string;
  images?: string;
  views?: number;
  likes?: number;
  tags?: string[];
}