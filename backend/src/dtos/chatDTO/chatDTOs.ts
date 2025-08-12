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

export interface AllUserChatsDTO {
  _id: string;
  userId: string;
  doctorId: {
    _id: string;
    fullName: string;
    role: string;
    profilePicture: string;
  };
  lastMessage: {
    _id: string;
    text: string;
  };
  createdAt: string;
}
