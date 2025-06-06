import { PrismaClient } from "../prisma/client";
import { error, Result, success } from "../tools/result";
import {
	ICanceledRequest,
	ICreateFriendRequest,
	IFriendRequest,
	IGetMyRequest,
	IGetRequest,
	IUser,
} from "./friend.types";

export const friendRepository = {
	getAllFriends: async function (id: number): Promise<IUser[]> {
		try {
			const fromMyRequests = await PrismaClient.friendRequest.findMany({
				where: {
					status: "accepted",
					from: { id: id },
				},
				select: {
					to: {
						select: {
							id: true,
							name: true,
							profileImage: true,
							surname: true,
							username: true,
						},
					},
				},
			});
			const toMeRequests = await PrismaClient.friendRequest.findMany({
				where: {
					status: "accepted",
					to: { id: id },
				},
				select: {
					from: {
						select: {
							id: true,
							name: true,
							profileImage: true,
							surname: true,
							username: true,
						},
					},
				},
			});
			const friends = [
				...fromMyRequests.map((req) => req.to),
				...toMeRequests.map((req) => req.from),
			];
			return friends;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	getRecommends: async function (): Promise<IUser[]> {
		try {
			const users = await PrismaClient.user.findMany({
				orderBy: {
					id: "desc",
				},
				take: 5,
				select: {
					id: true,
					name: true,
					profileImage: true,
					surname: true,
					username: true,
				},
			});

			return users;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	getRequests: async function (id: number): Promise<IGetRequest[]> {
		try {
			const requests = await PrismaClient.friendRequest.findMany({
				where: {
					status: "pending",
					toId: id,
				},
				select: {
					status: true,
					from: {
						select: {
							id: true,
							name: true,
							profileImage: true,
							surname: true,
							username: true,
						},
					},
				},
			});
			return requests.map((req) => ({
				...req,
				status: "pending",
			}));
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	getMyRequests: async function (id: number): Promise<IGetMyRequest[]> {
		try {
			const requests = await PrismaClient.friendRequest.findMany({
				where: {
					status: "pending",
					fromId: id,
				},
				select: {
					status: true,
					to: {
						select: {
							id: true,
							name: true,
							profileImage: true,
							surname: true,
							username: true,
						},
					},
				},
			});
			return requests.map((req) => ({
				...req,
				status: "pending",
			}));
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	sendRequest: async function (
		data: ICreateFriendRequest
	): Promise<IFriendRequest> {
		try {
			const request = await PrismaClient.friendRequest.create({
				data: {
					status: "pending",
					from: { connect: { id: data.fromId } },
					to: { connect: { id: data.toId } },
				},
				omit: {
					id: true,
				},
			});
			return request;
		} catch (err) {
			console.log(err);
			error("Error sending friend request");
			throw err;
		}
	},
	acceptRequest: async function (
		data: ICreateFriendRequest
	): Promise<IFriendRequest> {
		try {
			const request = await PrismaClient.friendRequest.update({
				where: {
					fromId_toId: {
						fromId: data.fromId,
						toId: data.toId,
					},
				},
				data: {
					status: "accepted",
				},
				omit: {
					id: true,
				},
			});
			return request;
		} catch (err) {
			console.log(err);
			error("Error accepting friend request");
			throw err;
		}
	},
	cancelRequest: async function (
		data: ICreateFriendRequest
	): Promise<ICanceledRequest> {
		try {
			await PrismaClient.friendRequest.delete({
				where: {
					fromId_toId: {
						fromId: data.fromId,
						toId: data.toId,
					},
				},
			});
			return { status: "canceled" };
		} catch (err) {
			console.log(err);
			error("Erroo canceling friend request");
			throw err;
		}
	},
	getIdsFromUsernames: async function (
		usernames: string[]
	): Promise<number[]> {
		try {
			const users = await Promise.all(
				usernames.map((username) =>
					PrismaClient.user.findUnique({
						where: { username },
						select: { id: true },
					})
				)
			);

			return users.map((user) => user!.id);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
