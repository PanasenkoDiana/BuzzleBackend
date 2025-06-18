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
                    images: true,
                    topic: true,
                }
            })
            return albums
        } catch(error) {
            console.log(error)
        }
    },

    changeAlbum: async function(data: CreateAlbumInput, id: number) {
        try {
            const changedAlbum = await PrismaClient.album.update({
                where: { id },
                data: {
                    name: data.name,
                    topic: data.topic
                        ? {
                                connectOrCreate: {
                                    where: { name: data.topic as string }, // <- string
                                    create: { name: data.topic as string }, // <- string
                                },
                        }
                        : undefined,
                },
                include: {
                    images: true,
                    topic: true, // если нужно вернуть
                },
            });

            return changedAlbum;
        } catch (error) {
            console.log(error);
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
                    topic: true,
                },
            });

            return album;
        } catch (error) {
            console.log(error);
        }
    },


    createAlbum: async function(data: CreateAlbumInput, userId: number) {
        try {
            // topic — это string или undefined из input
            const topicName = typeof data.topic === "string" ? data.topic : undefined;

            // Формируем объект связи с Tag, если topicName есть
            const topicConnectOrCreate = topicName
                ? {
                    connectOrCreate: {
                        where: { name: topicName },
                        create: { name: topicName },
                    }
                }
                : undefined;

            const album = await PrismaClient.album.create({
                data: {
                    user: { connect: { id: userId } },  // связываем пользователя через вложенный объект
                    name: data.name,
                    topic: topicConnectOrCreate,       // используем сформированный объект
                },
                include: {
                    topic: true,
                    images: true,
                },
            });

            return album;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    deleteAlbum: async function(id: number) {
        try {
            const deletedAlbum = await PrismaClient.image.delete({
                where: { id },
            });

            return deletedAlbum;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }






}