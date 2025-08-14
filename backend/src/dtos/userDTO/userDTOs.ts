import { IUser } from "../../domain/entities/user";

export type ListUsersDTO = Pick<
  IUser,
  "_id" | "fullName" | "email" | "mobileNumber" | "isBlocked"
>;
