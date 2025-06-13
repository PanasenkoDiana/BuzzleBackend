import { Prisma } from "@prisma/client"
import { AddPhotoToAlbum, CreateAlbum } from "./album.type"
import { create } from "ts-node"
import { PrismaClient } from "../prisma/client"


export const AlbumRepository = {
    getAllAlbums: async function(id: number) {
        try {
            const albums = await PrismaClient.album.findMany({
                where: {
                    userId: id
                },
                include: {
                    images: true
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
                include: {
                    images: true
                }
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
            console.log("data:" + data.name)
            console.log("data:" + data.theme)
            console.log("data:" + data.year)
            console.log("id:" + id)
            // const prisma = new PrismaClient()
            const newAlbum = await PrismaClient.album.create({
                data: {
                    userId: id,
                    name: data.name,
                    theme: data.theme,
                    year: new Date(`${data.year}-01-01`)
                },
                include: {
                    images: true
                }
            })
            console.log('bbb')
            return newAlbum
        } catch(error) {
            console.log(error)
        }
    }
}