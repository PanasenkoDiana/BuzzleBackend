import { PrismaClient } from '../prisma/client'




export const ChatRepository = {
    createMessage: async function(message: string, chatId: number) {
        const newMessage = PrismaClient.chatMessage
    }
}