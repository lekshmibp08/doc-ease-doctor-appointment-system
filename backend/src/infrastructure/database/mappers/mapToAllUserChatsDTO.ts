import { stripBaseUrl } from "../../../application/helper/stripBaseUrl";
import { AllUserChatsDTO } from "../../../dtos/chatDTO/chatDTOs";

export const mapToAllUserChatsDTO = (chat: any): AllUserChatsDTO => ({
  _id: chat._id,
  userId: chat.userId,
  doctorId: {
    _id: chat.doctorId?._id,
    fullName: chat.doctorId?.fullName,
    role: chat.doctorId?.role,
    profilePicture: stripBaseUrl(chat.doctorId?.profilePicture),
  },
  lastMessage: {
    _id: chat.lastMessage?._id,
    text: chat.lastMessage?.text,
  },
  createdAt: chat.createdAt,
});