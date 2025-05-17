import { Prisma } from "../generated/prisma";

export interface IError {
    status: 'error',
    message: string
}

export interface ISuccess<T>{
    status: 'success',
    data: T
}

export type User = Prisma.UserGetPayload<{}>
export type CreateUser = Prisma.UserCreateInput