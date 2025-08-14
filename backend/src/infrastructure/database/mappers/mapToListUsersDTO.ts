import { IUser } from "../../../domain/entities/user";
import { ListUsersDTO } from "../../../dtos/userDTO/userDTOs";

export const mapToUserListDTO = (doc: IUser): ListUsersDTO => {
  return {
    _id: doc._id || '',
    fullName: doc.fullName,
    email: doc.email,
    mobileNumber: doc.mobileNumber,
    isBlocked: doc.isBlocked,
  };
}
