import { AuthController } from "../../interfaces/controllers/authController";
import { GoogleOAuthLoginUseCase } from "../../application/useCases/implimentations/auth/googleOAuthLoginUseCase";
import { DoctorRepository } from "../database/repositories/doctorRepository";
import { UserRepository } from "../database/repositories/userRepository";

export function createAuthController() {
  const doctorRepository = new DoctorRepository();
  const userRepository = new UserRepository();

  const googleOAuthLoginUseCase = new GoogleOAuthLoginUseCase(
    doctorRepository, userRepository
  );
  return new AuthController(googleOAuthLoginUseCase);
}
