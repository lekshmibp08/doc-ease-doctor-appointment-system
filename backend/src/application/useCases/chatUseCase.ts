// ChatService.ts (Updated for better structure and code clarity)
import { ChatRepository } from "../../infrastructure/database/repositories/ChatRepository";
import { MessageRepository } from "../../infrastructure/database/repositories/MessageRepository";
import { IChat } from "../../domain/entities/Chat";
import { IMessage } from "../../domain/entities/Message";

export class ChatUsecase {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.messageRepository = new MessageRepository();
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
    const chats = await this.chatRepository.findChatByUserId(userId);
    return chats
  }

  async getAllDoctorChats(doctorId: string) {
    const chats = await this.chatRepository.findChatByDoctorId(doctorId);
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

    await this.chatRepository.updateChatLastMessage(chatId, newMessage._id as string);
    
    return newMessage;
  }

  //Make a chat using Chat id
  async getAChatUsingChatId(chatId: string,) {
    const messages = await this.messageRepository.getMessagesByChatId(chatId);
    return messages;
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
