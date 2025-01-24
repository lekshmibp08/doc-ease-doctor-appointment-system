import { Request, Response } from "express";
import { ChatUsecase } from "../../../application/useCases/chatUseCase";

export const chatController = {
  // Create or fetch chat
    getOrCreateChat:  async (req: Request, res: Response) => {
      try {
      console.log('====================================');
      console.log(req.body);
      console.log('====================================');
      const { userId, doctorId } = req.body; 
      const chatUsecase = new ChatUsecase();
      const { chat, messages } = await chatUsecase.getOrCreateChat(userId, doctorId);
      res.json({ chat, messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  //get all the chats for a particular user
  getAllChats: async (req: Request, res: Response) => {
    const { userId } = req.query;
    console.log('====================================');
    console.log("getAllChats Param: ", userId);
    console.log('====================================');
    try {
      const chatUsecase = new ChatUsecase();
      const chats = await chatUsecase.getAllChatsForUser(userId as string);
      res.status(200).json(chats);
      
    } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });      
    }  
  },
  
  //get all the chats for a particular user
  getAllChatsForDoctor: async (req: Request, res: Response) => {
    const { doctorId } = req.query;
    console.log('====================================');
    console.log("getAllChats Param: ", doctorId);
    console.log('====================================');
    try {
      const chatUsecase = new ChatUsecase();
      const chats = await chatUsecase.getAllDoctorChats(doctorId as string);
      console.log('====================================');
      console.log(chats);
      console.log('====================================');
      res.status(200).json(chats);
      
    } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });      
    }  
  },

// Send message in chat
sendMessage: async (req: Request, res: Response) => {
  try {
    const { chatId, senderId, receiverId, text } = req.body;
    console.log('====================================');
    console.log("Send Message: ", req.body);
    console.log('====================================');
    const chatUsecase = new ChatUsecase();
    const newMessage = await chatUsecase.sendMessage(chatId, senderId, receiverId, text);
    res.json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
  },

  getAChatUsingChatId: async (req: Request, res: Response) => {
    const { chatId } = req.query;
    try {
      const chatUsecase = new ChatUsecase();
      const messages = await chatUsecase.getAChatUsingChatId(chatId as string)
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  }
}

