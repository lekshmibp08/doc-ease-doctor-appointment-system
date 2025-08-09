import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../../shared/errors/appError";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";
import { stripBaseUrl } from "../../helper/stripBaseUrl";

export class UserLoginUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(data: { email: string; password: string }): Promise<{
    token: string;
    refreshToken: string;
    role: string;
    user: Record<string, any>;
  }> {
    const { email, password } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(
        "Invalid email or password",
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password",
        HttpStatusCode.UNAUTHORIZED
      );
    }

    if (user.role !== "user") {
      throw new AppError(
        "Access denied: only users can log in",
        HttpStatusCode.FORBIDDEN
      );
    }

    const { password: _, ...rest } = user;
    if (rest.profilePicture) {
      rest.profilePicture = stripBaseUrl(rest.profilePicture);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    return { token, refreshToken, role: user.role, user: rest };
  }
}
