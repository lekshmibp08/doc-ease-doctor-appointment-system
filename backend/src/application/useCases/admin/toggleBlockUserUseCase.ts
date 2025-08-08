import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/appError";

export class ToggleBlockUseruseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
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
