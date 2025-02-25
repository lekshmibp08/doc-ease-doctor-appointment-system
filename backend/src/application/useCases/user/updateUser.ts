import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";

export const updateUser = async (
  userRepository: IUserRepository,
  id: string,
  updatedData: any
): Promise<any> => {

    const existingUser = await userRepository.findUserById(id);
    if(!existingUser) {
      throw new Error("User not found");
    }

    if (updatedData.currentPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        updatedData.currentPassword,
        existingUser.password
      );
  
      if (!isPasswordCorrect) {
        throw new Error("Current password is incorrect");
      }
    }        
    

    if(updatedData.password) {
        const hashedPassword = await bcrypt.hash(updatedData.password, 10);
        updatedData.password = hashedPassword;
    }

    const updatedUser = await userRepository.updateUser(id, updatedData);
    
    return updatedUser;  
};
