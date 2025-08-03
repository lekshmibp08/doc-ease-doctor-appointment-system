import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";

export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, updatedData: any): Promise<any> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (updatedData.currentPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        updatedData.currentPassword,
        existingUser.password
      );

      if (!isPasswordCorrect) {
        throw new Error("Current password is incorrect");
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
