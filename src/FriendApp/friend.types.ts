import { Prisma } from "../generated/prisma";

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
		from: true,
		to: true
	},
	omit: {
		id: true;
	};
}>;

export interface IGetFriend {
	status: "accepted",
} 

export type IGetRequest = Prisma.FriendRequestGetPayload<{
	include: {
        from: true
    };
	omit: {
		id: true;
	};
}>;

export type IGetMyRequest = Prisma.FriendRequestGetPayload<{
	include: {
        to: true
    };
	omit: {
		id: true;
	};
}>;