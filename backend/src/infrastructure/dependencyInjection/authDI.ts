import { AuthController } from "../../interfaces/controllers/authController";
import { DoctorRepository } from "../database/repositories/doctorRepository";
import { UserRepository } from "../database/repositories/userRepository";

export function createAuthController() {
  const doctorRepository = new DoctorRepository();
  const userRepository = new UserRepository();
  return new AuthController(doctorRepository, userRepository);
}
