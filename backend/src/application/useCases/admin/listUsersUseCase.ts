import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(page: number, size: number, search: string) {
    const skip = (page - 1) * size;
    const limit = size;

    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { mobileNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await this.userRepository.getUsersWithPagination(
      skip,
      limit,
      query
    );
    const totalUsers = await this.userRepository.countUsers(query);
    const totalPages = Math.ceil(totalUsers / size);

    return {
      users,
      totalUsers,
      totalPages,
    };
  }
}
