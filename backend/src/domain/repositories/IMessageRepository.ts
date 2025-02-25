import { IMessage } from "../entities/Message";

export interface IMessageRepository {
    createMessage(
        chatId: string,
        senderId: string,
        receiverId: string,
        text: string,
        imageUrl: string
    ): Promise<IMessage>;
    getMessagesByChatId(chatId: string): Promise<IMessage[]>;
    
    
}