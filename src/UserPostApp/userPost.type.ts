import { Prisma } from "../generated/prisma";

export type CreateUserPost = Prisma.User_PostGetPayload<{
    include: {
        tags: true
    }
    omit: {
        id: true
        userId: true,
    }
}>

export type ImageCreateMany = Prisma.ImageCreateManyInput

export type UserPost = Prisma.User_PostGetPayload<{
    include: {
        tags: true,
        images: true,
        user: true
    },
    omit: {
        userId: true
    }
}>

export type UpdateUserPost = Prisma.User_PostUpdateInput;

export type CreateImage = Prisma.ImageCreateInput
export type Tag = Prisma.TagGetPayload<{}>;
export type CreateTag = Prisma.TagCreateInput;
export type Image = Prisma.ImageGetPayload<{}>