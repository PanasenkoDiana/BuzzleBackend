import { Prisma } from "../generated/prisma";






export type Album = Prisma.AlbumGetPayload<{}>
export type CreateAlbum = Omit<Prisma.AlbumCreateInput, 'images'>
export type AddPhotoToAlbumCredentials = { image: string }

// export type ChangeAlbum