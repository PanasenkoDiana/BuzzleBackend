import {
	changeUserPartOne,
	changeUserPartTwo,
	createMyPhoto,
	CreateUser,
	IError,
	ISuccess,
	secondRegister,
	User,
} from "./user.type";
import { UserRepositories } from "./user.repository";
import { sign } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import { SECRET_KEY } from "../config/token";
import { EmailService } from "../core/email.service";
import { VerificationService } from "../core/verification.service";
import { base64ToImage } from "../tools/base64ToImage";

const verificationService = new VerificationService(EmailService);

export const UserService = {
	createUser: async function (
		data: CreateUser
	): Promise<IError | ISuccess<string>> {
		const existingUserByEmail = await UserRepositories.findUserByEmail(
			data.email
		);
		if (existingUserByEmail) {
			return {
				status: "error",
				message: "User with this email already exists",
			};
		}

		const emailSent = await verificationService.generateAndSendCode(
			data.email,
			data
		);
		if (!emailSent) {
			return {
				status: "error",
				message: "Failed to send verification email",
			};
		}

		return { status: "success", data: "Verification code sent" };
	},

	verifyUser: async function (
		email: string,
		code: string
	): Promise<IError | ISuccess<string>> {
		const userData = await verificationService.verifyCode(email, code);
		if (!userData) {
			return {
				status: "error",
				message: "Invalid or expired verification code",
			};
		}

		const hashedPassword = await hash(userData.password, 10);
		const newUser = await UserRepositories.createUser({
			...userData,
			password: hashedPassword,
		});
		if (!newUser) {
			return { status: "error", message: "Failed to create user" };
		}

		const token = sign({ id: newUser.id }, SECRET_KEY, { expiresIn: "1d" });
		return { status: "success", data: token };
	},

	authUser: async function (
		email: string,
		password: string
	): Promise<IError | ISuccess<string>> {
		const user = await UserRepositories.findUserByEmail(email);
		if (!user) {
			return { status: "error", message: "User not found" };
		}

		const isMatch = await compare(password, user.password);
		if (!isMatch) {
			return { status: "error", message: "Incorrect password" };
		}

		const token = sign({ id: user.id }, SECRET_KEY, { expiresIn: "1d" });
		return { status: "success", data: token };
	},

	getUserByid: async function (id: number): Promise<IError | ISuccess<User>> {
		const user = await UserRepositories.findUserById(id);
		if (!user) {
			return { status: "error", message: "User not found" };
		}

		return { status: "success", data: user };
	},

	secondRegister: async function (
		data: secondRegister,
		id: number
	): Promise<IError | ISuccess<User>> {
		const user = await UserRepositories.secondRegister(data, id);
		if (!user) {
			return { status: "error", message: "User not found" };
		}

		return { status: "success", data: user };
	},

	changeUserPartOne: async function (
		data: changeUserPartOne,
		id: number
	): Promise<IError | ISuccess<User>> {
		try {
			if (
				data.profileImage &&
				data.profileImage.startsWith("data:image")
			) {
				const image = await base64ToImage(data.profileImage);
				data.profileImage = image.name; 
			}

			const user = await UserRepositories.changeUserPartOne(data, id);
			if (!user) {
				return { status: "error", message: "User not found" };
			}

			return { status: "success", data: user };
		} catch {
			return {
				status: "error",
				message: "Ошибка при обновлении пользователя",
			};
		}
	},

	changeUserPartTwo: async function (
		data: changeUserPartTwo,
		id: number
	): Promise<IError | ISuccess<User>> {
		const user = await UserRepositories.changeUserPartTwo(data, id);
		if (!user) {
			return { status: "error", message: "User not found" };
		}

		return { status: "success", data: user };
	},

	addMyPhoto: async function (
		data: createMyPhoto,
		id: number
	): Promise<IError | ISuccess<string>> {
		try {
			if (
				data.image &&
				data.image.startsWith("data:image")
			) {
				const image = await base64ToImage(data.image);
				data.image = image.name; // просто имя файла без префикса /media/
			}

			const user = await UserRepositories.addMyPhoto(data, id);
			if (!user) {
				return { status: "error", message: "photo don't created found" };
			}

			return { status: "success", data: user };
		} catch {
			return {
				status: "error",
				message: "create photo error",
			};
		}
	}
};
