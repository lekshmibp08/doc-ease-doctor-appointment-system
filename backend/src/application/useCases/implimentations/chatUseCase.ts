import { IChatUsecase } from "../interfaces/IChatUsecase"
import { IChat } from "../../../domain/entities/chat" 
import { IMessage } from "../../../domain/entities/message" 
import { stripBaseUrl } from "../../helper/stripBaseUrl" 
import { mapToAllDocChatsDTO } from "../../../infrastructure/database/mappers/mapToAllDocChatsDTO" 
import { mapToAllUserChatsDTO } from "../../../infrastructure/database/mappers/mapToAllUserChatsDTO" 
import { IChatRepository } from "../../../domain/repositories/IChatRepository"
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository"

export class ChatUsecase implements IChatUsecase {
  constructor(
    private chatRepository: IChatRepository,
    private messageRepository: IMessageRepository
  ) {
  this.chatRepository = chatRepository;
  this.messageRepository = messageRepository;
}

  async getOrCreateChat(userId: string, doctorId: string) {
    let chat: IChat | null = await this.chatRepository.findChatByParticipants(userId, doctorId);

    if (!chat) {
      chat = await this.chatRepository.createChat(userId, doctorId);
    }

    const messages = await this.messageRepository.getMessagesByChatId(chat._id as string);
    return { chat, messages };
  }

  async getAllChatsForUser(userId: string) {
    const chatDocs = await this.chatRepository.findChatByUserId(userId);
    const chats = (chatDocs ?? []).map(mapToAllUserChatsDTO)
    return chats
  }

  async getAllDoctorChats(doctorId: string) {
    const chatDocs = await this.chatRepository.findChatByDoctorId(doctorId);
    const chats = (chatDocs ?? []).map(mapToAllDocChatsDTO)
    return chats
  }

  async sendMessage(
    chatId: string,
    senderId: string,
    receiverId: string,
    text: string,
    imageUrl: string
  ) {
    const newMessage: IMessage = await this.messageRepository.createMessage(
      chatId, senderId, receiverId, text, imageUrl
    );
    if (newMessage.imageUrl) {
      newMessage.imageUrl = stripBaseUrl(newMessage.imageUrl);
    }

    await this.chatRepository.updateChatLastMessage(chatId, newMessage._id as string);
    
    return newMessage;
  }

  //Make a chat using Chat id
  async getAChatUsingChatId(chatId: string,) {
    const messages = await this.messageRepository.getMessagesByChatId(chatId);
    return messages.map(msg => ({
      ...msg,
      imageUrl: msg.imageUrl ? stripBaseUrl(msg.imageUrl) : '',
    }));
  }

  // Mark Messages as read
  async markMessagesAsRead(chatId: string, userId: string) {
    await this.messageRepository.markMessagesAsRead(chatId, userId)
  }

  // Find unread message count For User
  async getUnreadMessageCountsForUser(userId: string) {
    const chats = await this.chatRepository.findChatByUserId(userId)
    const unreadCounts: { [key: string]: number } = {}

    if (chats) {
      for (const chat of chats) {
        const count = await this.messageRepository.getUnreadCountForUser(chat._id as string, userId)
        if (count > 0) {
          unreadCounts[chat._id as string] = count
        }
      }
    }

    return unreadCounts
  }
  // Find unread message count For Doctor
  async getUnreadMessageCountsForDoc(doctorId: string) {
    const chats = await this.chatRepository.findChatByDoctorId(doctorId)
    const unreadCounts: { [key: string]: number } = {}

    if (chats) {
      for (const chat of chats) {
        const count = await this.messageRepository.getUnreadCountForDoc(chat._id as string, doctorId)
        if (count > 0) {
          unreadCounts[chat._id as string] = count
        }
      }
    }

    return unreadCounts
  }

}
