import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import UserModel from "../models/UserModel";

export const createUserRepository = (): IUserRepository => ({
  findByEmail: async (email) => {
    const userDoc = await UserModel.findOne({ email });
    return userDoc;
  },
  create: async (user) => {
    const userDoc = await UserModel.create(user);
    return userDoc;
  },
  getAllUsers: async () => {
    return await UserModel.find({ role: "user" }, "-password"); 
  },
  getUsersWithPagination: async (skip, limit, query) => {
    return await UserModel.find({ ...query, role: "user" }, "-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); 
  },

  countUsers: async (query) => {
    return await UserModel.countDocuments(query); 
  },  
  findUserById: async (id) => {
    return await UserModel.findById(id);
  },
  updateUser: async (id, updates) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id, updates, 
      { new: true}
    ).select('-password');
    return updatedUser;
  }
});
