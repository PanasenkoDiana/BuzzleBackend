import { base64ToImage } from "../tools/base64ToImage";
import { error } from "../tools/result";
import { IError, ISuccess } from "../UserApp/user.type";
import { AlbumRepository } from "./album.repository";
import { AddPhotoToAlbum, Album, CreateAlbum } from "./album.type";




export const AlbumService = {
    getAllAlbums: async function(
        id: number
    ): Promise<IError | ISuccess<Album[]>> {
        const albums = await AlbumRepository.getAllAlbums(
            id
        )

        if (!albums) { 
            return { status: "error", message: "Albums not found" } 
        }

        return { status: 'success', data: albums }
    },

    changeAlbum: async function(
        data: CreateAlbum,
        id: number
    ): Promise<IError | ISuccess<Album>> {
        const changedAlbum  = await AlbumRepository.changeAlbum(data, id)

        if (!changedAlbum) {
            return { status: "error", message: "Album change error" }
        }

        return { status: 'success', data: changedAlbum }
    },

    addPhotoToAlbum: async function(
        data: AddPhotoToAlbum,
        id: number
    ): Promise<IError | ISuccess<Album>> {
        try {
            if (
                data.image &&
                data.image.startsWith("data:image")
            ) {
                const image = await base64ToImage(data.image);
                data.image = image.name; // просто имя файла без префикса /media/
            }

            const album = await AlbumRepository.addPhotoToAlbum(data, id);
            if (!album) {
                return { status: "error", message: "Album not found" };
            }

            return { status: "success", data: album };
        } catch {
            return {
                status: "error",
                message: "Photo don't added to album",
            };
        }
    },

    createAlbum: async function(
        data: CreateAlbum,
        id: number
    ): Promise<IError | ISuccess<Album>> {
        console.log("service data:" + data)
        const newAlbum = await AlbumRepository.createAlbum(data, id)
        console.log(newAlbum)
        if (!newAlbum) {
            return { status: "error", message: "Album don't create" };
        }
        console.log(3)
        return { status: 'success', data: newAlbum }
    }
}