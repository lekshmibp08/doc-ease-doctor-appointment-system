import { IChat } from "../entities/chat";

export interface IChatRepository {
    findChatByParticipants(userId: string, doctorId: string): Promise<IChat | null>;
    createChat(userId: string, doctorId: string): Promise<IChat>;
    findChatByUserId(userId: string): Promise<IChat[] | null>;
    findChatByDoctorId(doctorId: string): Promise<IChat[] | null>;
    updateChatLastMessage(chatId: string, messageId: string): Promise<void>;    
    
}