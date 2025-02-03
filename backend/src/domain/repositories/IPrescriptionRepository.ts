import type { IPrescription } from "../entities/Prescription" 

export interface IPrescriptionRepository {
  create(prescription: IPrescription): Promise<IPrescription>
  
  findByAppointmentId(appointmentId: string): Promise<IPrescription | null>
  
  update(id: string, prescription: Partial<IPrescription>): Promise<IPrescription | null>
}

