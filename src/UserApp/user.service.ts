import {
	changeUserPartOne,
	changeUserPartTwo,
	createMyPhoto,
	createMyPhotoCredentials,
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
	createUser: async (
		data: CreateUser
	): Promise<IError | ISuccess<string>> => {
		const existing = await UserRepositories.findUserByEmail(data.email);
		if (existing)
			return { status: "error", message: "User already exists" };

		const sent = await verificationService.generateAndSendCode(
			data.email,
			data
		);
		if (!sent) return { status: "error", message: "Email not sent" };

		return { status: "success", data: "Verification code sent" };
	},

	verifyUser: async (
		email: string,
		code: string
	): Promise<IError | ISuccess<string>> => {
		const userData = await verificationService.verifyCode(email, code);
		if (!userData) return { status: "error", message: "Invalid code" };

		const hashedPassword = await hash(userData.password, 10);
		const newUser = await UserRepositories.createUser({
			...userData,
			password: hashedPassword,
		});

		if (!newUser)
			return { status: "error", message: "User creation failed" };
		const token = sign({ id: newUser.id }, SECRET_KEY, { expiresIn: "1d" });

		return { status: "success", data: token };
	},

	authUser: async (
		email: string,
		password: string
	): Promise<IError | ISuccess<string>> => {
		const user = await UserRepositories.findUserByEmail(email);
		if (!user) return { status: "error", message: "User not found" };

		const isMatch = await compare(password, user.password);
		if (!isMatch) return { status: "error", message: "Wrong password" };

		const token = sign({ id: user.id }, SECRET_KEY, { expiresIn: "1d" });
		return { status: "success", data: token };
	},

	getUserByid: async (id: number): Promise<IError | ISuccess<User>> => {
		const user = await UserRepositories.findUserById(id);
		if (!user) return { status: "error", message: "User not found" };
		return { status: "success", data: user };
	},

	secondRegister: async (
		data: secondRegister,
		id: number
	): Promise<IError | ISuccess<User>> => {
		const user = await UserRepositories.secondRegister(data, id);
		if (!user) return { status: "error", message: "User not found" };
		return { status: "success", data: user };
	},

	changeUserPartOne: async (
		data: changeUserPartOne,
		id: number
	): Promise<IError | ISuccess<User>> => {
		if (data.profileImage && typeof data.profileImage === "string") {
			const image = await base64ToImage(data.profileImage);
			data.profileImage = image.file!;
		}

		const user = await UserRepositories.changeUserPartOne(data, id);
		if (!user) return { status: "error", message: "User not found" };
		return { status: "success", data: user };
	},

	changeUserPartTwo: async (
		data: changeUserPartTwo,
		id: number
	): Promise<IError | ISuccess<User>> => {
		const user = await UserRepositories.changeUserPartTwo(data, id);
		if (!user) return { status: "error", message: "User not found" };
		return { status: "success", data: user };
	},

	addMyPhoto: async (
		data: createMyPhotoCredentials,
		id: number
	): Promise<IError | ISuccess<string>> => {
		if (!data.image?.startsWith("data:image")) {
			return { status: "error", message: "Invalid image data" };
		}

		const { file, filename } = await base64ToImage(data.image);

		const result = await UserRepositories.addMyPhoto({ file: file!, filename: filename! }, id);
		if (!result) return { status: "error", message: "Photo not created" };

		return { status: "success", data: "photo added" };
	},
};
