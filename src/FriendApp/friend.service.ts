import { error, Result, success } from "../tools/result";
import { friendRepository } from "./friend.repository";
import { ICreateFriendRequest, IFriendRequest, IGetMyRequest, IGetRequest } from "./friend.types";

export const friendService = {
	sendRequest: async function (
		data: ICreateFriendRequest
	): Promise<Result<IFriendRequest>> {
        try {
            const friendRequest = await friendRepository.sendRequest(data)
            return friendRequest
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
            const friendRequest = await friendRepository.acceptRequest(data)
            return friendRequest
		} catch (err) {
			console.log(err);
			error("Error sending friend request");
            throw err
		}
    },
    cancelRequest: async function (
		data: ICreateFriendRequest
	): Promise<Result<string>> {
        try {
            await friendRepository.cancelRequest(data)
            return success("Request successfully rejected")
		} catch (err) {
			console.log(err);
			error("Error sending friend request");
            throw err
		}
    },
    getRequests: async function (
		id: number
	): Promise<Result<IGetRequest[]>> {
        try {
            const friendRequests = await friendRepository.getRequests(id)
            return success(friendRequests)
		} catch (err) {
			console.log(err);
			error("Error receiving friend requests");
            throw err
		}
    },
    getMyRequests: async function (
		id: number
	): Promise<Result<IGetMyRequest[]>> {
        try {
            const friendRequests = await friendRepository.getMyRequests(id)
            return success(friendRequests)
		} catch (err) {
			console.log(err);
			error("Error sending friend request");
            throw err
		}
    },
};
