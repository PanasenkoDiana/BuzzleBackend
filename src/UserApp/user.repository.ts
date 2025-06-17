import { PrismaClient } from "../prisma/client";
import {
    changeUserPartOne,
    changeUserPartTwo,
    createMyPhoto,
    CreateUser,
    secondRegister,
} from "./user.type";

export const UserRepositories = {
    createUser: async (data: CreateUser) => {
        const user = await PrismaClient.user.create({ data });

        // Создаём профиль после создания пользователя
        await PrismaClient.profile.create({
            data: {
                user: { connect: { id: user.id } },
                date_of_birth: new Date(),
            },
        });

        return user;
    },

    findUserById: async (id: number) =>
        PrismaClient.user.findUnique({
            where: { id },
            include: {
                images: true,
                albums: { include: { images: true } },
                profile: {
                    include: {
                        avatars: {
                            include: {
                                image: true,
                            },
                        },
                    },
                },
            },
        }),

    findUserByEmail: async (email: string) =>
        PrismaClient.user.findUnique({
            where: { email },
        }),

    secondRegister: async (data: secondRegister, id: number) =>
        PrismaClient.user.update({
            where: { id },
            data: {
                name: data.name,
                surname: data.surname,
                username: data.username,
            },
            include: { images: true, albums: true },
        }),

    changeUserPartOne: async (data: { file: string; filename: string }, id: number) => {
        // Найдём профиль пользователя
        const profile = await PrismaClient.profile.findUnique({
            where: { user_id: id },
        });
        if (!profile) throw new Error("Profile not found");

        // Создаём новый аватар с изображением
        const updatedProfile = await PrismaClient.profile.update({
            where: { id: profile.id },
            data: {
                avatars: {
                    create: {
                        active: true,
                        shown: true,
                        image: {
                            create: {
                                filename: data.filename,
                                file: data.file,
                                // uploadedAt: по умолчанию теперь()
                            },
                        },
                    },
                },
            },
            include: {
                avatars: {
                    include: { image: true },
                },
            },
        });

        return updatedProfile;
    },

    changeUserPartTwo: async (data: changeUserPartTwo, id: number) =>
        PrismaClient.user.update({
            where: { id },
            data: {
                name: data.name,
                surname: data.surname,
                email: data.email,
                username: data.username,
                password: data.password,
            },
            include: { images: true, albums: true },
        }),

    addMyPhoto: async (data: { file: string; filename: string }, id: number) => {
        // Находим профиль по user_id
        const profile = await PrismaClient.profile.findUnique({
            where: { user_id: id },
        });
        if (!profile) throw new Error("Profile not found");

        // Создаём новый аватар с изображением
        const newAvatar = await PrismaClient.avatar.create({
            data: {
                profile: { connect: { id: profile.id } },
                active: true,
                shown: true,
                image: {
                    create: {
                        filename: data.filename,
                        file: data.file,
                    },
                },
            },
            include: { image: true },
        });

        return newAvatar;
    },
};
