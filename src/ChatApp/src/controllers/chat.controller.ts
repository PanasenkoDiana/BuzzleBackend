export class ChatController {
    private chatHistory: any[] = []; 

    public sendMessage(senderId: string, recipientId: string | null, message: string, groupId: string | null = null): void {
        const chatMessage = {
            senderId,
            recipientId,
            groupId,
            message,
            timestamp: new Date(),
        };
        this.chatHistory.push(chatMessage);
       

    public getChatHistory(userId: string, groupId: string | null = null): any[] {
        if (groupId) {
            return this.chatHistory.filter(msg => msg.groupId === groupId);
        }
        return this.chatHistory.filter(msg => msg.recipientId === userId || msg.senderId === userId);
    }
}