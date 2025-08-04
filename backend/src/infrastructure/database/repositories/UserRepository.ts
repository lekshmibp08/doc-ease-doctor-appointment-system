import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import UserModel from "../models/UserModel";
import { IUser } from "../../../domain/entities/User";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }
  async create(user: IUser): Promise<IUser> {
    return await UserModel.create(user);
  }
  async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find({ role: "user" }, "-password");
  }
  async getUsersWithPagination(skip: number, limit: number, query: any): Promise<IUser[]> {
    return await UserModel.find({ ...query, role: "user" }, "-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async countUsers(query: any): Promise<number> {
    return await UserModel.countDocuments(query);
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }
  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id, updates, 
      { new: true}
    ).select('-password');
    
  }
}
