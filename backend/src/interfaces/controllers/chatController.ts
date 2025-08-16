import { NextFunction, Request, Response } from "express";
import { ChatUsecase } from "../../application/useCases/implimentations/chatUseCase"; 

export const chatController = {
  // Create or fetch chat
  getOrCreateChat: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, doctorId } = req.body;
      const chatUsecase = new ChatUsecase();
      const { chat, messages } = await chatUsecase.getOrCreateChat(
        userId,
        doctorId
      );
      res.json({ chat, messages });
    } catch (error) {
      next(error);
    }
  },
  //get all the chats for a particular user
  getAllChats: async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;
    try {
      const chatUsecase = new ChatUsecase();
      const chats = await chatUsecase.getAllChatsForUser(userId as string);

      const unreadCounts = await chatUsecase.getUnreadMessageCountsForUser(
        userId as string
      );

      res.status(200).json({ chats, unreadCounts });
    } catch (error: any) {
      next(error);
    }
  },

  //get all the chats for a particular user
  getAllChatsForDoctor: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { doctorId } = req.query;
    try {
      const chatUsecase = new ChatUsecase();
      const chats = await chatUsecase.getAllDoctorChats(doctorId as string);
      const unreadCounts = await chatUsecase.getUnreadMessageCountsForDoc(
        doctorId as string
      );
      res.status(200).json({ chats, unreadCounts });
    } catch (error: any) {
      next(error);
    }
  },

  // Send message in chat
  sendMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId, senderId, receiverId, text, imageUrl } = req.body;
      const chatUsecase = new ChatUsecase();
      const newMessage = await chatUsecase.sendMessage(
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
  },

  getAChatUsingChatId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { chatId } = req.query;
    try {
      const chatUsecase = new ChatUsecase();
      const messages = await chatUsecase.getAChatUsingChatId(chatId as string);
      res.status(200).json(messages);
    } catch (error: any) {
      next(error);
    }
  },
};
