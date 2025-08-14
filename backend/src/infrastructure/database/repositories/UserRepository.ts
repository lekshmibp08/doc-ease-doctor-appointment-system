import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import UserModel from "../models/userModel";
import { IUser } from "../../../domain/entities/user";
import { mapToUserEntity } from "../mappers/userMapper";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const userDoc = await UserModel.findOne({ email });
    return userDoc ? mapToUserEntity(userDoc) : null;
  }
  async create(user: IUser): Promise<IUser> {
    const createdUser = await UserModel.create(user);
    return mapToUserEntity(createdUser);
  }
  async getAllUsers(): Promise<IUser[]> {
    const userDocs = await UserModel.find({ role: "user" }, "-password");
    return userDocs.map((doc) => mapToUserEntity(doc));
  }
  async getUsersWithPagination(
    skip: number,
    limit: number,
    query: any
  ): Promise<IUser[]> {
    const users = await UserModel.find({ ...query, role: "user" }, "-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return users.map((doc) => mapToUserEntity(doc));
  }

  async countUsers(query: any): Promise<number> {
    return await UserModel.countDocuments(query);
  }

  async findUserById(id: string): Promise<IUser | null> {
    const userDoc = await UserModel.findById(id);
    return userDoc ? mapToUserEntity(userDoc) : null;
  }
  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");
    return updatedUser ? mapToUserEntity(updatedUser) : null;
  }
}



