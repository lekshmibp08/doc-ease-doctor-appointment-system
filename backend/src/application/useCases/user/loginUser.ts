import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (
  userRepository: IUserRepository,
  data: { email: string; password: string }
): Promise<{ token: string; role: string }> => {
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

  const token = jwt.sign(
    { id: user._id, email: user.email, fullName: user.fullName, role: user.role }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: "1h" } 
  );

  return { token, role: user.role };
};
