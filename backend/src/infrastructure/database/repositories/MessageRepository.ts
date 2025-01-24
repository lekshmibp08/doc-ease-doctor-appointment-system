import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import MessageModel from "../models/MessageModel";
import { IMessage } from "../../../domain/entities/Message";

export class MessageRepository implements IMessageRepository {
  // Create a new message
  async createMessage(
    chatId: string,
    senderId: string,
    receiverId: string,
    text: string
  ): Promise<any> {
    const newMessage = new MessageModel({ chatId, senderId, receiverId, text });
    return await newMessage.save();
  }

  // Get messages by chatId
  async getMessagesByChatId(chatId: string): Promise<any[]> {
    return await MessageModel.find({ chatId }).sort({ timestamp: 1 });
  }
}
