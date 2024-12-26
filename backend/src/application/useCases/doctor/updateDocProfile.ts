import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { Doctor } from "../../../domain/entities/Doctor";
import bcrypt from "bcrypt";

export const updateDocProfile = async (
  doctorRepository: IDoctorRepository,
  id: string,
  updatedData: any
): Promise<any> => {

    console.log("USECASE ID: ", id);
    console.log("USECASE data: ", updatedData);
    

    if(updatedData.password) {
        const hashedPassword = await bcrypt.hash(updatedData.password, 10);
        updatedData.password = hashedPassword;
    }

    const updatedDocProfile = await doctorRepository.updateDoctor(id, updatedData);
    console.log("USECASE UPDATED USER: ", updatedDocProfile);
    
    return updatedDocProfile;  
};
