import { IMessage } from "../entities/message";

export interface IMessageRepository {
    createMessage(
        chatId: string,
        senderId: string,
        receiverId: string,
        text: string,
        imageUrl: string
    ): Promise<IMessage>;
    getMessagesByChatId(chatId: string): Promise<IMessage[]>;
    markMessagesAsRead(chatId: string, receiverId: string): Promise<void>;
    getUnreadCountForUser(chatId: string, userId: string): Promise<number>;
    getUnreadCountForDoc(chatId: string, doctorId: string): Promise<number>;
}