import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import UserModel from "../models/UserModel";

export const createUserRepository = (): IUserRepository => ({
  findByEmail: async (email) => {
    const userDoc = await UserModel.findOne({ email });
    return userDoc ? { fullName: userDoc.fullName, email: userDoc.email, mobileNumber: userDoc.mobileNumber, password: userDoc.password, role: userDoc.role, isBlocked: false } : null;
  },
  create: async (user) => {
    const userDoc = await UserModel.create(user);
    return { fullName: userDoc.fullName, email: userDoc.email, mobileNumber: userDoc.mobileNumber, password: userDoc.password, role: userDoc.role, isBlocked: false };
  },
  getAllUsers: async () => {
    return await UserModel.find({ role: "user" }, "-password"); 
  }
});
