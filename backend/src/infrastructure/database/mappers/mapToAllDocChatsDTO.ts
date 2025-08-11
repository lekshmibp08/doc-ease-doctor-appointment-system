import { stripBaseUrl } from "../../../application/helper/stripBaseUrl";
import { AllDocChatsDTO } from "../../../dtos/chatDTO/chatDTOs";

export const mapToAllDocChatsDTO = (chat: any): AllDocChatsDTO => ({
  _id: chat._id,
  userId: {
    _id: chat.userId?._id,
    fullName: chat.userId?.fullName,
    role: chat.userId?.role,
    profilePicture: stripBaseUrl(chat.userId?.profilePicture),
  },
  doctorId: chat.doctorId,
  lastMessage: {
    _id: chat.lastMessage?._id,
    text: chat.lastMessage?.text,
  },
  createdAt: chat.createdAt,
});