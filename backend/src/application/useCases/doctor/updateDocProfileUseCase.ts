import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import bcrypt from "bcrypt";

export class UpdateDocProfile {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(id: string, updatedData: any): Promise<any> {
    const existingDoctor = await this.doctorRepository.findDoctorById(id);
    if (!existingDoctor) {
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

    if (updatedData.password) {
      const hashedPassword = await bcrypt.hash(updatedData.password, 10);
      updatedData.password = hashedPassword;
    }

    updatedData.isRejected = false;

    const updatedDocProfile = await this.doctorRepository.updateDoctor(
      id,
      updatedData
    );

    return updatedDocProfile;
  }
}
