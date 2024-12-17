import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";

export const updateUser = async (
  userRepository: IUserRepository,
  id: string,
  updatedData: any
): Promise<any> => {

    console.log("USECASE ID: ", id);
    console.log("USECASE data: ", updatedData);
    

    if(updatedData.password) {
        const hashedPassword = await bcrypt.hash(updatedData.password, 10);
        updatedData.password = hashedPassword;
    }

    const updatedUser = await userRepository.updateUser(id, updatedData);
    console.log("USECASE UPDATED USER: ", updatedUser);
    
    return updatedUser;  
};
