import { Prisma } from "../generated/prisma";

export type CreateUserPost = Prisma.PostGetPayload<{
    include: {
        tags: true
    }
    omit: {
        id: true
        userId: true,
    }
}>

export type ImageCreateMany = Prisma.ImageCreateManyInput

export type UserPost = Prisma.PostGetPayload<{
    include: {
        tags: true,
        images: true,   
        author: true,
        userId: number;  
    },
    omit: {
        authorId: true,
    }
}>

export type UpdateUserPost = {
    title?: string;
    content?: string;
    images?: {
        create?: {
            filename: string;
            file: string;
            userId?: number;
        }[];
    };
};
export type UserPostWithoutIncludes = Prisma.PostGetPayload<{}>

//export type UpdateUserPost = Prisma.PostUpdateInput;

export type CreateImage = Prisma.ImageCreateInput
export type Tag = Prisma.TagGetPayload<{}>;
export type CreateTag = Prisma.TagCreateInput;
export type Image = Prisma.ImageGetPayload<{}>