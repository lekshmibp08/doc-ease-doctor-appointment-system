import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class ToggleBlockUseruseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const updatedStatus = !user.isBlocked;

    await this.userRepository.updateUser(id, { isBlocked: updatedStatus });

    return {
      isBlocked: updatedStatus,
      message: `User has been ${
        updatedStatus ? "Blocked" : "Unblocked"
      } successfully`,
    };
  }
}
