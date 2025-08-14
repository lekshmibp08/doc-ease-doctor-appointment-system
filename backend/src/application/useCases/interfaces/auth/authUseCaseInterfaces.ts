import { GoogleOAuthLoginDTO } from "../../../dto/authUseCaseDtos";

export interface IGoogleOAuthLoginUseCase {
  execute(data: GoogleOAuthLoginDTO): Promise<{
    token: string;
    refreshToken: string;
    user: Record<string, any>;
    role: string;
  }>;
}
