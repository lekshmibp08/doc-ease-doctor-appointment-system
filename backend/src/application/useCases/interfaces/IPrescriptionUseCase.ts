import { IPrescription } from "../../../domain/entities/prescription";
import { PrescriptionDTO } from "../../../dtos/prescriptionDTO/prescriptionDTOs";

export interface IPrescriptionUseCase {
  createPrescription(prescriptionData: Partial<IPrescription>): Promise<IPrescription>;
  getPrescription(id: string): Promise<PrescriptionDTO | null>;
  updatePrescription(id: string, prescriptionData: Partial<IPrescription>): Promise<IPrescription | null>;
}
