import { AddPhotoToAlbum, AddPhotoToAlbumCredentials, Album, CreateAlbum, CreateAlbumInput } from "./album.type"
import { create } from "ts-node"
import { PrismaClient } from "../prisma/client"
import { connect } from "http2"


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
                    // theme: data.theme,
                    // year: data.year,
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

    addPhotoToAlbum: async function(data: { file: string, filename: string }, id: number) {
        try {
            const album = await PrismaClient.album.update({
                where: { id },
                data: {
                    images: {
                        create: {
                            file: data.file,
                            filename: data.filename,
                        },
                    },
                },
                include: {
                    images: true,
                },
            });

            return album;
        } catch (error) {
            console.log(error);
        }
    },


    createAlbum: async function (data: CreateAlbumInput, userId: number) {
        try {
            // const tagNameRaw = typeof data.topic === "string" ? data.topic : dat;
            // const tagName = tagNameRaw ? (tagNameRaw.startsWith("#") ? tagNameRaw : `#${tagNameRaw}`) : undefined;

            const album = await PrismaClient.album.create({
                data: {
                    userId: userId,
                    name: data.name,
                    // topic: {
                    //     create: {

                    //     }
                    // }
                },
                include: {
                    topic: true,
                }
            });



            return album;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }



}