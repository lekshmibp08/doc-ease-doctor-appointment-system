import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import bcrypt from "bcrypt";

export const updateDocProfile = async (
  doctorRepository: IDoctorRepository,
  id: string,
  updatedData: any
): Promise<any> => {

    console.log("USECASE ID: ", id);
    console.log("USECASE data: ", updatedData);

    const existingDoctor = await doctorRepository.findDoctorById(id);
    if(!existingDoctor) {
      throw new Error("Doctor not found");
    }

    if (updatedData.currentPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        updatedData.currentPassword,
        existingDoctor.password
      );
  
      if (!isPasswordCorrect) {
        throw new Error("Current password is incorrect");
      }
    }    
    
    if(updatedData.password) {
        const hashedPassword = await bcrypt.hash(updatedData.password, 10);
        updatedData.password = hashedPassword;
    }

    updatedData.isRejected = false;

    const updatedDocProfile = await doctorRepository.updateDoctor(id, updatedData);
    console.log("USECASE UPDATED USER: ", updatedDocProfile);
    
    return updatedDocProfile;  
};
