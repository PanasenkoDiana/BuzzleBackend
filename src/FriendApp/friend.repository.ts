import { PrismaClient } from "../prisma/client";
import { error, Result, success } from "../tools/result";
import { ICreateFriendRequest, IFriendRequest, IGetMyRequest, IGetRequest } from "./friend.types";

export const friendRepository = {
	sendRequest: async function (
		data: ICreateFriendRequest
	): Promise<Result<IFriendRequest>> {
		try {
			const request = await PrismaClient.friendRequest.create({
				data: {
					status: "pending",
					from: { connect: { id: data.fromId } },
					to: { connect: { id: data.toId } },
				},
				include: {
					from: true,
					to: true
				},
				omit: {
					id: true,
				},
			});
			return success(request);
		} catch (err) {
			console.log(err);
			error("Error sending friend request");
            throw err
		}
	},
	acceptRequest: async function (
		data: ICreateFriendRequest
	): Promise<Result<IFriendRequest>> {
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
				include: {
					from: true,
					to: true
				},
				omit: {
					id: true,
				},
			});
			return success(request);
		} catch (err) {
			console.log(err);
            error("Error accepting friend request");
            throw err
		}
	},
	cancelRequest: async function (data: ICreateFriendRequest) {
		try {
			await PrismaClient.friendRequest.delete({
				where: {
					fromId_toId: {
						fromId: data.fromId,
						toId: data.toId,
					},
				},
			});
		} catch (err) {
			console.log(err);
            throw err
		}
	},
    getAllFriends: async function (id: number): Promise<IFriendRequest[]> {
        try {
            const fromMyRequests = await PrismaClient.friendRequest.findMany({
                where: {
                    status: "accepted",
                    from: {id: id}
                },
				include: {
					to: true,
					from: true
				},
            })
			const toMeRequests = await PrismaClient.friendRequest.findMany({
                where: {
                    status: "accepted",
                    to: {id: id}
                },
				include: {
					to: true,
					from: true
				},
            })
			const friends = [...fromMyRequests, ...toMeRequests]
            return friends
		} catch (err) {
			console.log(err);
            throw err
		}
    },
    getRequests: async function (id: number): Promise<IGetRequest[]> {
        try {
            const requests = await PrismaClient.friendRequest.findMany({
                where: {
                    status: "pending",
                    toId: id
                },
                include: {
                    from: true
                },
                omit: {
					id: true,
				},
            })
            return requests
		} catch (err) {
			console.log(err);
            throw err
		}
    },
    getMyRequests: async function (id: number): Promise<IGetMyRequest[]>  {
        try {
            const requests = await PrismaClient.friendRequest.findMany({
                where: {
                    status: "pending",
                    fromId: id
                },
                include: {
                    to: true
                },
                omit: {
					id: true,
				},
            })
            return requests
		} catch (err) {
			console.log(err);
            throw err
		}
    },
	getIdsFromUsernames: async function (usernames: string[]): Promise<number[]> {
		try {
			const users = await Promise.all(
				usernames.map((username) =>
					PrismaClient.user.findUnique({
						where: { username },
						select: { id: true }
					})
				)
			);
	
			return users.map(user => user!.id);
		} catch (err) {
			console.log(err);
			throw err
		}
	}
};
