import { Prisma } from "../generated/prisma";






export type Album = Prisma.AlbumGetPayload<{
    include: {
        images: true
    }
}>
export type CreateAlbum = Omit<Prisma.AlbumCreateInput, 'images'>
export type AddPhotoToAlbum = { image: string }
// export type ChangeAlbum