import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { Doctor } from "../../../domain/entities/Doctor";
export const doctorDetails = async (
  doctorRepository: IDoctorRepository,
  id: string,
): Promise<Partial <Doctor>> => {
    const details = await doctorRepository.findDoctorById(id)
    if(!details) {
      throw new Error("User not found");
    }    
    
    return details;  
};
