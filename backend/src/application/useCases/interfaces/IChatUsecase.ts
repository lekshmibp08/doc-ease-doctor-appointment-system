import { IChat } from "../../../domain/entities/Chat";
import { IMessage } from "../../../domain/entities/Message";

export interface IChatUsecase {
  getOrCreateChat(userId: string, doctorId: string): Promise<{ chat: IChat; messages: IMessage[] }>;
  getAllChatsForUser(userId: string): Promise<any[]>; // DTO array
  getAllDoctorChats(doctorId: string): Promise<any[]>; // DTO array
  sendMessage(
    chatId: string,
    senderId: string,
    receiverId: string,
    text: string,
    imageUrl: string
  ): Promise<IMessage>;
  getAChatUsingChatId(chatId: string): Promise<IMessage[]>;
  markMessagesAsRead(chatId: string, userId: string): Promise<void>;
  getUnreadMessageCountsForUser(userId: string): Promise<{ [key: string]: number }>;
  getUnreadMessageCountsForDoc(doctorId: string): Promise<{ [key: string]: number }>;
}
