import { create } from "ts-node"
import { PrismaClient } from "../prisma/client"
import { changeUserPartOne, changeUserPartTwo, createMyPhoto, CreateUser, secondRegister } from "./user.type"

export const UserRepositories = {
    createUser: async function(data: CreateUser) {
        try {
            const newUser = await PrismaClient.user.create({
                data: data
            })
            return newUser
        } catch(error) {
            console.log(error)
        }
    },
    findUserById: async function(id: number) {
        try {
            const user = await PrismaClient.user.findUnique({
                where: {
                    id: id
                }
            })
            return user
        } catch(error) {
            console.log(error)
        }
    },
    findUserByEmail: async function(email: string){
        try {
            const user = await PrismaClient.user.findUnique({
                where: {
                    email: email
                }
            })
            return user
        } catch(error) {
            console.log(error)
        }
    },
    secondRegister: async function(data: secondRegister, id: number){
        try {
            const user= await PrismaClient.user.update({
                where: { id },
                data: {
                    name: data.name,
                    surname: data.surname,
                    username: data.surname
                },
            })
            return user
        } catch(error) {
            console.log(error)
        }
    },
    changeUserPartOne: async function(data: changeUserPartOne, id: number){
        try {
            const user= await PrismaClient.user.update({
                where: { id },
                data: {
                    profileImage: data.profileImage
                },
            })
            return user
        } catch(error) {
            console.log(error)
        }
    },
    changeUserPartTwo: async function(data: changeUserPartTwo, id: number){
        try {
            const user= await PrismaClient.user.update({
                where: { id },
                data: {
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    username: data.username,
                    password: data.password,
                },
            })
            return user
        } catch(error) {
            console.log(error)
        }
    },
    addMyPhoto: async function(data: createMyPhoto, id: number){
        try {
            const newPhoto = await PrismaClient.user.update({
                where: { id },
                data: {
                    images: {
                        create: {
                            name: data.image
                        }
                    }
                }
            }) 

            return 'photo added'
        } catch(error) {
            console.log(error)
        }
    }
}
