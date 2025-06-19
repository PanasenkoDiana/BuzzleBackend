// import { PrismaClient } from "../prisma/client";
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
		const id = (await PrismaClient.user.count()) + 1;
		const user = await PrismaClient.user.create({
			data: {
				username: `user${id}`,
				...data,
			},
		});

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
				Profile: {
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

	changeUserPartOne: async (filename: string, id: number) => {
		// Найдём профиль пользователя
		const profile = await PrismaClient.profile.findUnique({
			where: { user_id: id },
		});
		if (!profile) throw new Error("Profile not found");

		const updatedProfile = await PrismaClient.profile.update({
			where: { id: profile.id },
			data: {
				avatars: {
					create: {
						image: {
							create: {
								filename,
								file: filename,
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

		// const newAvatar = await PrismaClient.avatar.create({
		// 	// where: { profile_id: profile.id },
		// 	data: {
		//         profile_id: profile.id,
		//         // profile: profile.id,
		// 		image: {
		// 			create: {
		//                 filename,
		//                 file: filename,
		// 			}
		// 		},
		// 	},
		// });

		return "avatar changed";
	},

	changeUserPartTwo: async (data: changeUserPartTwo, id: number) => {
		const uupdatedUser = await PrismaClient.user.update({
			where: { id },
			data: {
				name: data.name,
				surname: data.surname,
				email: data.email,
				username: data.username,
				password: data.password,
			},
			include: {
				albums: true,
				Profile: {
					include: {
						avatars: {
							include: {
								image: true,
							},
						},
					},
				},
			},
		});

		return "changed part two";
	},

	addMyPhoto: async (data: string, id: number) => {
		// Находим профиль по user_id
		const profile = await PrismaClient.profile.findUnique({
			where: { user_id: id },
		});
		if (!profile) throw new Error("Profile not found");

		// Создаём новый аватар с изображением
		// const newAvatar = await PrismaClient.avatar.create({
		// 	data: {
		// 		profile: { connect: { id: profile.id } },
		// 		active: true,
		// 		shown: true,
		// 		image: {
		// 			create: {
		// 				filename: data,
		// 			},
		// 		},
		// 	},
		// 	include: { image: true },
		// });
		const newAvatar = await PrismaClient.profile.update({
			where: { user_id: id },

			data: {
				avatars: {
					create: {
						image: {
							create: {
								filename: data,
								file: data,
							},
						},
					},
				},
			},

			include: {
				avatars: {
					include: {
						image: true,
					},
				},
			},
		});

		return "new photo added";
	},

	deleteMyPhoto: async (id: number) => {
		const avatar = await PrismaClient.avatar.findUnique({
			where: { id },
			include: { image: true },
		});
		if (!avatar) throw new Error("Avatar not found");

		// Удаляем аватар и связанное изображение
		await PrismaClient.avatar.delete({
			where: { id },
		});

		// Возвращаем имя файла удалённого изображения
		return avatar.image.filename;
	},

	changePassword: async (password: string, userId: number) => {
		const newPassword = await PrismaClient.user.update({
			where: {
				id: userId,
			},
			data: {
				password,
			},
		});
	},
};
