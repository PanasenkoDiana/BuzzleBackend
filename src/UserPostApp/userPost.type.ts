import { Prisma } from "../generated/prisma";

// export type UserPost = Prisma.User_PostGetPayload<{}>;
export type ImageCreateMany = Prisma.ImageCreateManyInput
export type UserPost = Prisma.User_PostGetPayload<{
    include: {
        tags: true,
        images: true
    }
}>
export type CreateUserPost = Prisma.User_PostCreateInput;
export type UpdateUserPost = Prisma.User_PostUpdateInput;

export type CreateImage = Prisma.ImageCreateInput
export type Tag = Prisma.TagGetPayload<{}>;
export type CreateTag = Prisma.TagCreateInput;
export type Image = {name: string}