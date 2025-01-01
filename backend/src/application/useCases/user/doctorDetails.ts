import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import bcrypt from "bcrypt";

export const doctorDetails = async (
  doctorRepository: IDoctorRepository,
  id: string,
): Promise<any> => {
    const details = await doctorRepository.findDoctorById(id)
    if(!details) {
      throw new Error("User not found");
    }    
    
    return details;  
};
