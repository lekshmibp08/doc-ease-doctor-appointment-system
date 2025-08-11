export interface AllDocChatsDTO {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    role: string;
    profilePicture: string;
  };
  doctorId: string;
  lastMessage: {
    _id: string;
    text: string;
  };
  createdAt: string;
}
