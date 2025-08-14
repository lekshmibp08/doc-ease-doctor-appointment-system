import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IGoogleOAuthLoginUseCase } from "../../interfaces/auth/authUseCaseInterfaces";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { stripBaseUrl } from "../../../helper/stripBaseUrl";
import { GoogleOAuthLoginDTO } from "../../../dto/authUseCaseDtos";

export class GoogleOAuthLoginUseCase implements IGoogleOAuthLoginUseCase {
  constructor(
    private doctorRepository: IDoctorRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: GoogleOAuthLoginDTO): Promise<{
    token: string;
    refreshToken: string;
    user: Record<string, any>;
    role: string;
  }> {
    
    const { fullName, email, profilePicture, role } = data;
    let entity;

    if (role === "doctor") {
      entity = await this.doctorRepository.findByEmail(email);

      if (!entity) {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashPassword = bcrypt.hashSync(generatedPassword, 10);
        entity = await this.doctorRepository.create({
          fullName: fullName || "",
          email: email,
          password: hashPassword,
          profilePicture: profilePicture,
          mobileNumber: "",
          registerNumber: "",
          role: "doctor",
          isApproved: false,
          isBlocked: false,
        });
      }
    } else {
      entity = await this.userRepository.findByEmail(email);

      if (!entity) {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);

        const hashPassword = bcrypt.hashSync(generatedPassword, 10);

        entity = await this.userRepository.create({
          fullName: fullName || "",
          email: email,
          profilePicture: profilePicture,
          mobileNumber: "",
          password: hashPassword,
          role: "user",
          isBlocked: false,
        });
      }
    }

    const { password: _password, ...rest } = entity;
    if (rest.profilePicture) {
      rest.profilePicture = stripBaseUrl(rest.profilePicture);
    }

    const token = jwt.sign(
      { id: entity._id, email: entity.email, role: entity.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: entity._id, email: entity.email, role: entity.role },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    return { token, refreshToken, user: rest, role: entity.role };
  }
}
