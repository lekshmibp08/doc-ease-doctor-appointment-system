import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export const listUsers = async (userRepository: IUserRepository, page: number, size: number, search: string) => {
  const skip = (page - 1) * size;
  const limit = size;

  const query = search
    ? { $or: [
        { fullName: { $regex: search, $options: "i" } }, 
        { email: { $regex: search, $options: "i" } }, 
        { mobileNumber: { $regex: search, $options: "i" } },
    ] }
    : {};
  
  const users = await userRepository.getUsersWithPagination(skip, limit, query);
  const totalUsers = await userRepository.countUsers(query)
  const totalPages = Math.ceil(totalUsers / size);

  return {
    users,
    totalUsers,
    totalPages
  };
};



