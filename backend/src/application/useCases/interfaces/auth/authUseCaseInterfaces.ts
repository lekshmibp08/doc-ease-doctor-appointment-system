import { GoogleOAuthLoginDTO } from "../../../../dtos/useCaseDtos/authUseCaseDtos";

export interface IGoogleOAuthLoginUseCase {
  execute(data: GoogleOAuthLoginDTO): Promise<{
    token: string;
    refreshToken: string;
    user: Record<string, any>;
    role: string;
  }>;
}
