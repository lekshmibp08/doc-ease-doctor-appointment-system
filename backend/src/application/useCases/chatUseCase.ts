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

  // Get or create a chat
  async getOrCreateChat(userId: string, doctorId: string) {
    let chat: IChat | null = await this.chatRepository.findChatByParticipants(userId, doctorId);

    // If no chat exists, create a new one
    if (!chat) {
      chat = await this.chatRepository.createChat(userId, doctorId);
    }

    // Fetch messages for this chat
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

  // Send a message in an existing chat
  async sendMessage(chatId: string, senderId: string, receiverId: string, text: string) {
    const newMessage: IMessage = await this.messageRepository.createMessage(chatId, senderId, receiverId, text);

    await this.chatRepository.updateChatLastMessage(chatId, newMessage._id as string);
    
    return newMessage;
  }

  //Make a chat using Chat id
  async getAChatUsingChatId(chatId: string,) {
    const messages = await this.messageRepository.getMessagesByChatId(chatId);
    return messages;
  }
}
