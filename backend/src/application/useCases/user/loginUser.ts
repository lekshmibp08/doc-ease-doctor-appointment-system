/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (
  userRepository: IUserRepository,
  data: { email: string; password: string }
): Promise<{ token: string; refreshToken: string; role: string; user: Record<string, any> }> => {
  const { email, password } = data;

  
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (user.role !== "user") {
    throw new Error("Access denied: only users can log in");
  }

  const { password: _, ... rest} = user

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" } // Short-lived access token
  );

  const refreshToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" } // Long-lived refresh token
  );

  return { token, refreshToken, role: user.role, user: rest };
};
