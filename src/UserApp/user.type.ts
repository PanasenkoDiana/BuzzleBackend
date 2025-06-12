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
export type secondRegister = Pick<User, 'name' | 'surname'>
export type changeUserPartOne = Pick<User, 'profileImage'>
export type changeUserPartTwo = Omit<User, 'profileImage' | 'id'>
export type createMyPhoto = { image: string }