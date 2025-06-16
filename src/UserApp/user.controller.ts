import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

export const UserController = {
	createUser: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.createUser(req.body);
			res.json(result);
		} catch (err) {
			next(err);
		}
	},

	authUser: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.authUser(
				req.body.email,
				req.body.password
			);
			res.json(result);
		} catch (err) {
			next(err);
		}
	},

	verifyUser: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.verifyUser(
				req.body.email,
				req.body.code
			);
			res.json(result);
		} catch (err) {
			next(err);
		}
	},

	findUserById: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.getUserByid(res.locals.userId);
			res.json(result);
		} catch (err) {
			next(err);
		}
	},

	secondRegister: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await UserService.secondRegister(
				req.body,
				+req.params.id
			);
			res.json(result);
		} catch (err) {
			next(err);
		}
	},

	changeUserPartOne: async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			let { profileImage, ...rest } = req.body;

			if (
				profileImage &&
				typeof profileImage === "object" &&
				"file" in profileImage
			) {
				profileImage = profileImage.file;
			}

			const data = { ...rest, profileImage };

			const result = await UserService.changeUserPartOne(
				data,
				+req.params.id
			);
			res.json(result);
		} catch (err) {
			next(err);
		}
	},

	changeUserPartTwo: async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const result = await UserService.changeUserPartTwo(
				req.body,
				+req.params.id
			);
			res.json(result);
		} catch (err) {
			next(err);
		}
	},

	// addMyPhoto: async (req: Request, res: Response, next: NextFunction) => {
	// 	try {
	// 		const result = await UserService.addMyPhoto(
	// 			req.body,
	// 			+res.locals.userId
	// 		);
	// 		res.json(result);
	// 	} catch (err) {
	// 		next(err);
	// 	}
	// },
};
