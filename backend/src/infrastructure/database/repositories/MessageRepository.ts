import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import MessageModel from "../models/messageModel";
import { IMessage } from "../../../domain/entities/message";

export class MessageRepository implements IMessageRepository {
  // Create a new message
  async createMessage(
    chatId: string,
    senderId: string,
    receiverId: string,
    text: string,
    imageUrl: string
  ): Promise<any> {
    const newMessage = new MessageModel({
      chatId,
      senderId,
      receiverId,
      text,
      imageUrl,
    });
    return await newMessage.save();
  }

  // Get messages by chatId
  async getMessagesByChatId(chatId: string): Promise<any[]> {
    return await MessageModel.find({ chatId })
      .sort({ timestamp: 1 })
      .select("-__v")
      .lean();
  }

  // Method to mark messages as read
  async markMessagesAsRead(chatId: string, receiverId: string): Promise<void> {
    await MessageModel.updateMany(
      {
        chatId,
        receiverId,
        read: false,
      },
      { read: true }
    );
  }

  // Method to get unread message count for User
  async getUnreadCountForUser(chatId: string, userId: string): Promise<number> {
    return await MessageModel.countDocuments({
      chatId,
      receiverId: userId,
      read: false,
    });
  }

  // Method to get unread message count for Doctor
  async getUnreadCountForDoc(
    chatId: string,
    doctorId: string
  ): Promise<number> {
    return await MessageModel.countDocuments({
      chatId,
      receiverId: doctorId,
      read: false,
    });
  }
}
