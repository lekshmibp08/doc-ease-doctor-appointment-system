import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { Doctor } from "../../../domain/entities/Doctor";

export class DoctorDetails {
  constructor(private doctorRepository: IDoctorRepository){}
  async execute(
    id: string,
  ): Promise<Partial <Doctor>> {
      const details = await this.doctorRepository.findDoctorById(id)
      if(!details) {
        throw new Error("User not found");
      }    
      
      return details;  
  }
}

