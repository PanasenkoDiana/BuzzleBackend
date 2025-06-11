import { PrismaClient } from "../prisma/client";
import { error, Result, success } from "../tools/result";
import {
	IAcceptFriendRequest,
	ICanceledRequest,
	ICancelFriendRequest,
	ICreateFriendRequest,
	IDeletedFriend,
	IDeleteFriend,
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
	getRecommends: async function (id: number): Promise<IUser[]> {
		try {
			console.log(`My id: ${id}`);
			const relatedUsers = await PrismaClient.friendRequest.findMany({
				where: {
					OR: [{ fromId: id }, { toId: id }],
					status: { in: ["pending", "accepted"] },
				},
				select: {
					fromId: true,
					toId: true,
				},
			});

			console.log(relatedUsers);

			const excludedIds = [
				...relatedUsers.map((user) => {
					return user.fromId === id ? user.toId : user.fromId;
				}),
				id,
			];

			console.log("excludedIds:", excludedIds);

			const users = await PrismaClient.user.findMany({
				where: {
					id: {
						notIn: excludedIds,
					},
				},
				orderBy: {
					id: "desc",
				},
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
					to: { connect: { username: data.toUsername } },
				},
				omit: {
					id: true,
				},
			});
			return request;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	acceptRequest: async function (
		data: IAcceptFriendRequest
	): Promise<IFriendRequest> {
		try {
			const fromUser = await PrismaClient.user.findUnique({
				where: { username: data.fromUsername },
				select: { id: true },
			});

			if (!fromUser) {
				throw Error("User not found");
			}

			const request = await PrismaClient.friendRequest.update({
				where: {
					fromId_toId: {
						fromId: fromUser.id,
						toId: data.toId,
					},
				},
				data: {
					status: "accepted",
				},
			});
			return request;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	cancelRequest: async function (
		data: ICancelFriendRequest
	): Promise<ICanceledRequest> {
		try {
			const otherUser = await PrismaClient.user.findUnique({
				where: { username: data.username },
				select: { id: true },
			});

			if (!otherUser) {
				throw Error("User not found");
			}

			const fromId = data.isIncoming ? otherUser.id : data.myId;
			const toId = data.isIncoming ? data.myId : otherUser.id;

			await PrismaClient.friendRequest.delete({
				where: {
					fromId_toId: {
						fromId,
						toId,
					},
				},
			});

			return { status: "canceled" };
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteFriend: async function (
		data: IDeleteFriend
	): Promise<IDeletedFriend> {
		try {
			const request = await PrismaClient.friendRequest.findFirst({
				where: {
					OR: [
						{
							from: { username: data.username },
							toId: data.myId,
						},
						{
							fromId: data.myId,
							to: { username: data.username },
						},
					],
					status: { in: ["pending", "accepted"] },
				},
				select: {
					fromId: true,
					toId: true,
				},
			});

			if (!request) {
				throw Error("Friend request not found");
			}

			await PrismaClient.friendRequest.delete({
				where: {
					fromId_toId: {
						fromId: request.fromId,
						toId: request.toId,
					},
				},
			});

			return { status: "deleted" };
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
