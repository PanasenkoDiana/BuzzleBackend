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
    }
};
