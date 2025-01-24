import { IChat } from "../entities/Chat";

export interface IChatRepository {
    findChatByParticipants(userId: string, doctorId: string): Promise<IChat | null>;
    createChat(userId: string, doctorId: string): Promise<IChat>;
    
    
}