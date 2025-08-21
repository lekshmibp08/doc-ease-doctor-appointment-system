import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IFindExistingUserUseCase } from "../../interfaces/user/userUseCaseInterfaces";

export class FindExistingUserUseCase implements IFindExistingUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute( email: string ){
    return await this.userRepository.findByEmail(email);
  }
}
