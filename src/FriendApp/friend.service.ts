import { error, Result, success } from "../tools/result";
import { friendRepository } from "./friend.repository";
import { ICreateFriendRequest, ICreateFriendRequestUsernames, IFriendRequest, IGetMyRequest, IGetRequest } from "./friend.types";

export const friendService = {
	sendRequest: async function (
		data: ICreateFriendRequestUsernames
	): Promise<Result<IFriendRequest>> {
        try {
			const ids = await friendRepository.getIdsFromUsernames([
				data.fromUsername,
				data.toUsername
			]);
            const friendRequest = await friendRepository.sendRequest({
				fromId: ids[0],
				toId: ids[1]
			});
            return friendRequest
		} catch (err) {
			console.log(err);
			error("Error sending friend request");
            throw err
		}
    },
    acceptRequest: async function (
		data: ICreateFriendRequestUsernames
	): Promise<Result<IFriendRequest>> {
        try {
			const ids = await friendRepository.getIdsFromUsernames([
				data.fromUsername,
				data.toUsername
			]);
            const friendRequest = await friendRepository.acceptRequest({
				fromId: ids[0],
				toId: ids[1]
			});
            return friendRequest
		} catch (err) {
			console.log(err);
			error("Error sending friend request");
            throw err
		}
    },
    cancelRequest: async function (
		data: ICreateFriendRequestUsernames
	): Promise<Result<string>> {
        try {
			const ids = await friendRepository.getIdsFromUsernames([
				data.fromUsername,
				data.toUsername
			]);
            const friendRequest = await friendRepository.cancelRequest({
				fromId: ids[0],
				toId: ids[1]
			});
            return success("Request successfully rejected")
		} catch (err) {
			console.log(err);
			error("Error sending friend request");
            throw err
		}
    },
    getAllFriends: async function (
		id: number
	): Promise<Result<IGetMyRequest[]>> {
        try {
            const friends = await friendRepository.getAllFriends(id)
            return success(friends)
		} catch (err) {
			console.log(err);
			error("Error getting friends");
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
			error("Error receiving my friend requests");
            throw err
		}
    },
};
