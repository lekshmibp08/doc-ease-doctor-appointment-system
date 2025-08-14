import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { AppError } from "../../../../shared/errors/appError";

export class LoginAdmin {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: {
    email: string;
    password: string;
  }): Promise<{ token: string; refreshToken: string; role: string }> {
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

    if (user.role !== "admin") {
      throw new AppError(
        "Access denied: only Admin can login..!",
        HttpStatusCode.BAD_REQUEST
      );
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

    return { token, refreshToken, role: user.role };
  }
}
