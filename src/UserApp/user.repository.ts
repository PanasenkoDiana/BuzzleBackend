import { PrismaClient } from "../prisma/client";

import {
	CreateUser,
	secondRegister,
	changeUserPartOne,
	changeUserPartTwo,
	createMyPhoto,
} from "./user.type";

export const UserRepositories = {
	createUser: async (data: CreateUser) => PrismaClient.user.create({ data }),

	findUserById: async (id: number) =>
		PrismaClient.user.findUnique({
			where: { id },
			include: { images: true, albums: true },
		}),

	findUserByEmail: async (email: string) =>
		PrismaClient.user.findUnique({ where: { email } }),

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

	changeUserPartOne: async (data: changeUserPartOne, id: number) =>
		PrismaClient.user.update({
			where: { id },
			data: { profileImage: data.profileImage },
			include: { images: true, albums: true },
		}),

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

	addMyPhoto: async (data: createMyPhoto, id: number) => {
		const profile = await PrismaClient.profile.findUnique({
			where: { user_id: id },
			select: { id: true },
		});

		if (!profile) throw new Error("Profile not found");

		return PrismaClient.avatar.create({
			data: {
				image: {
					create: {
						filename: data.filename,
						file: data.file,
					}
				},
				profile: { connect: { id: profile.id } },
				active: true,
				shown: true,
			},
		});
	}
		
};
