import { Prisma } from "../generated/prisma";

export type IUser = Prisma.UserGetPayload<{
	select: {
		id: true;
		name: true;
		profileImage: true;
		surname: true;
		username: true;
	};
}>;

export interface IGetRequest {
	status: "pending";
	from: IUser;
}

export interface IGetMyRequest {
	status: "pending";
	to: IUser;
}

export interface ICreateFriendRequestUsernames {
	fromUsername: string;
	toUsername: string;
}

export interface ICreateFriendRequest {
	fromId: number;
	toId: number;
}

export type IFriendRequest = Prisma.FriendRequestGetPayload<{
	include: {
		from: true;
		to: true;
	};
	omit: {
		id: true;
	};
}>;
