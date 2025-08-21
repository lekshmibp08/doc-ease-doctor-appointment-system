import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { ChatUsecase } from "../../application/useCases/implimentations/chatUseCase";

export class ChatController {
  constructor(private chatUsecase: ChatUsecase) {}

  // Create or fetch chat
  getOrCreateChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, doctorId } = req.body;
      const { chat, messages } = await this.chatUsecase.getOrCreateChat(
        userId,
        doctorId
      );
      res.status(HttpStatusCode.OK).json({ chat, messages });
    } catch (error) {
      next(error);
    }
  };

  // Get all chats for a particular user
  getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;
    try {
      const chats = await this.chatUsecase.getAllChatsForUser(userId as string);

      const unreadCounts = await this.chatUsecase.getUnreadMessageCountsForUser(
        userId as string
      );

      res.status(HttpStatusCode.OK).json({ chats, unreadCounts });
    } catch (error: any) {
      next(error);
    }
  };

  // Get all chats for a doctor
  getAllChatsForDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { doctorId } = req.query;
    try {
      const chats = await this.chatUsecase.getAllDoctorChats(
        doctorId as string
      );

      const unreadCounts = await this.chatUsecase.getUnreadMessageCountsForDoc(
        doctorId as string
      );

      res.status(HttpStatusCode.OK).json({ chats, unreadCounts });
    } catch (error: any) {
      next(error);
    }
  };

  // Send message in chat
  sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId, senderId, receiverId, text, imageUrl } = req.body;
      const newMessage = await this.chatUsecase.sendMessage(
        chatId,
        senderId,
        receiverId,
        text,
        imageUrl
      );
      res.json(newMessage);
    } catch (error: any) {
      next(error);
    }
  };

  // Get chat by chatId
  getAChatUsingChatId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { chatId } = req.query;
    try {
      const messages = await this.chatUsecase.getAChatUsingChatId(
        chatId as string
      );
      res.status(HttpStatusCode.OK).json(messages);
    } catch (error: any) {
      next(error);
    }
  };
}
