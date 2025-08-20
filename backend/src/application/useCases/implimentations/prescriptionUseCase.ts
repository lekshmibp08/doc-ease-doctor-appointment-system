import { IPrescriptionUseCase } from "../interfaces/IPrescriptionUseCase";
import { IPrescription } from "../../../domain/entities/prescription";
import { mapToPrescriptionDTO } from "../../../infrastructure/database/mappers/mapToPrescriptionDTO ";
import { PrescriptionDTO } from "../../../dtos/prescriptionDTO/prescriptionDTOs";
import { IPrescriptionRepository } from "../../../domain/repositories/IPrescriptionRepository";

export class PrescriptionUseCase implements IPrescriptionUseCase {
  constructor(private prescriptionRepository: IPrescriptionRepository) {
    this.prescriptionRepository = prescriptionRepository;
  }

  // Create new prescription
  async createPrescription(
    prescriptionData: Partial<IPrescription>
  ): Promise<IPrescription> {
    const result = await this.prescriptionRepository.create(prescriptionData);
    return result;
  }

  // Get prescription
  async getPrescription(id: string): Promise<PrescriptionDTO | null> {
    const appointmentId = id.trim();
    const prescription = await this.prescriptionRepository.findByAppointmentId(
      appointmentId
    );
    return mapToPrescriptionDTO(prescription);
  }

  // Update Prescription
  async updatePrescription(
    id: string,
    prescriptionData: Partial<IPrescription>
  ): Promise<IPrescription | null> {
    return await this.prescriptionRepository.update(id, prescriptionData);
  }
}

