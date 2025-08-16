import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import ChatModel from "../models/chatModel";
import { IChat } from "../../../domain/entities/chat";

export class ChatRepository implements IChatRepository {
  // Find chat by user and doctor
  async findChatByParticipants(
    userId: string,
    doctorId: string
  ): Promise<IChat | null> {
    return await ChatModel.findOne({ userId, doctorId }).populate([
      { path: "doctorId", select: "fullName" },
      { path: "userId", select: "fullName" },
    ]);
  }

  // Find all chats for the User
  async findChatByUserId(userId: string): Promise<IChat[] | null> {
    return await ChatModel.find({ userId }).populate([
      { path: "doctorId" },
      { path: "lastMessage", select: "text" },
    ]);
  }

  // Find all chats for the Doctor
  async findChatByDoctorId(doctorId: string): Promise<IChat[] | null> {
    return await ChatModel.find({ doctorId }).populate([
      { path: "userId" },
      { path: "lastMessage", select: "text" },
    ]);
  }

  // Create a new chat
  async createChat(userId: string, doctorId: string): Promise<IChat> {
    const newChat = new ChatModel({ userId, doctorId });
    await newChat.save();
    return newChat.populate([
      { path: "doctorId", select: "fullName" },
      { path: "userId", select: "fullName" },
      { path: "lastMessage", select: "text" },
    ]);
  }

  //Update latest message
  async updateChatLastMessage(chatId: string, messageId: string) {
    await ChatModel.findByIdAndUpdate(chatId, { lastMessage: messageId });
  }
}
