import { IUpdateUser } from "../../interfaces/user/userUseCaseInterfaces";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";

export class UpdateUser implements IUpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, updatedData: any): Promise<any> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }

    if (updatedData.currentPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        updatedData.currentPassword,
        existingUser.password
      );

      if (!isPasswordCorrect) {
        throw new AppError(
          "Current password is incorrect",
          HttpStatusCode.FORBIDDEN
        );
      }
    }

    if (updatedData.password) {
      const hashedPassword = await bcrypt.hash(updatedData.password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await this.userRepository.updateUser(id, updatedData);

    return updatedUser;
  }
}
