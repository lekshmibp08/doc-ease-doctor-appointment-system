import { IChat } from "../entities/chat";

export interface IChatRepository {
    findChatByParticipants(userId: string, doctorId: string): Promise<IChat | null>;
    createChat(userId: string, doctorId: string): Promise<IChat>;
    
    
}