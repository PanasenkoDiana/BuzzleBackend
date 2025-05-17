import { Prisma } from "../generated/prisma";

export interface IError {
    status: 'error',
    message: string
}

export interface ISuccess<T>{
    status: 'success',
    data: T
}

export type UserPost = Prisma.User_PostGetPayload<{}>
export type CreateUserPost = Prisma.User_PostCreateInput