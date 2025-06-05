import { Prisma } from "../generated/prisma";

export interface ICreateFriendRequest {
	fromId: number;
	toId: number;
}

export type IFriendRequest = Prisma.FriendRequestGetPayload<{
	omit: {
		id: true;
	};
}>;

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