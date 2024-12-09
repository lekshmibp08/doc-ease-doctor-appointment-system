import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export const listUsers = async (userRepository: IUserRepository) => {
  const users = await userRepository.getAllUsers();
  return users.map((user) => ({
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    isBlocked: user.isBlocked,
  }));
};
