export type CreateUserPost = {
  title: string;
  content?: string | null;
  tags?: (string | { name: string })[];
};

export type UpdateUserPost = {
  title?: string;
  content?: string | null;
  tags?: (string | { name: string })[];
};

import { Prisma } from "../generated/prisma";

export type Image = Prisma.ImageGetPayload<{}>;

export type UserPost = Prisma.PostGetPayload<{
  include: {
    tags: true;
    images: true;
    author: true;
  };
}>;
