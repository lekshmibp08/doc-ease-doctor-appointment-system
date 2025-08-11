import { IUser } from "../../domain/entities/User";

export type ListUsersDTO = Pick<
  IUser,
  "_id" | "fullName" | "email" | "mobileNumber" | "isBlocked"
>;
