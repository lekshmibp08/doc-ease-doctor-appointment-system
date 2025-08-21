import { ChatUsecase } from "../../application/useCases/implimentations/chatUseCase";
import { ChatController } from "../../interfaces/controllers/chatController";
import { ChatRepository } from "../database/repositories/chatRepository";
import { MessageRepository } from "../database/repositories/messageRepository";

export function createChatController() {
  const chatRepository = new ChatRepository();
  const messageRepository = new MessageRepository();
  const chatUseCase = new ChatUsecase(chatRepository, messageRepository);
  return new ChatController(chatUseCase);
}
