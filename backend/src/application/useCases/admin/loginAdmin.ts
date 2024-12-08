import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginAdmin = async (
  userRepository: IUserRepository,
  data: { email: string; password: string }
): Promise<{ adminToken: string; role: string }> => {
  const { email, password } = data;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (user.role !== "admin") {
    throw new Error("Access denied: only Admin can login..!");
  }

  const adminToken = jwt.sign(
    { id: user.email, role: user.role }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: "1h" } 
  );

  return { adminToken, role: user.role };
};
