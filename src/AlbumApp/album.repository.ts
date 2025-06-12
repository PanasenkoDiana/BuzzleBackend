import { Prisma, PrismaClient } from "@prisma/client"
import { AddPhotoToAlbum, CreateAlbum } from "./album.type"
import { create } from "ts-node"


export const AlbumRepository = {
    getAllAlbums: async function(id: number) {
        try {
            const albums = await PrismaClient.album.findMany({
                where: {
                    userId: id
                }
            })
            return albums
        } catch(error) {
            console.log(error)
        }
    },

    changeAlbum: async function(data: CreateAlbum, id: number) {
        try {
            const changedAlbum = await PrismaClient.album.update({
                where: { id: id },
                data: {
                    name: data.name,
                    theme: data.theme,
                    year: data.year,
                },
            })

            return changedAlbum
        } catch(error) {
            console.log(error)
        }
    },

    addPhotoToAlbum: async function(data: AddPhotoToAlbum, id: number) {
        try {
            const album = await PrismaClient.album.update({
                where: { id },
                data: {
                    images: {
                        create: {
                            name: data.image
                        }
                    }
                },
                include: {
                    images: true
                },
            })

            return album
        } catch(error) {
            console.log(error)
        }
    },

    createAlbum: async function(data: CreateAlbum, id: number) {
        try {
            const newAlbum = await PrismaClient.album.create({
                data: {
                    userId: id,
                    name: data.name,
                    theme: data.theme,
                    year: data.year,
                }
            })

            return newAlbum
        } catch(error) {
            console.log(error)
        }
    }
}