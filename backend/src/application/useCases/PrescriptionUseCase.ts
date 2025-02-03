import { IPrescription } from "../../domain/entities/Prescription" 
import { PrescriptionRepository } from "../../infrastructure/database/repositories/PrescriptionRepository"; 

class PrescriptionUseCase {
    private prescriptionRepository: PrescriptionRepository;
    constructor() {
        this.prescriptionRepository = new PrescriptionRepository();
    }

    // Create new prescription
    async createPrescription(prescriptionData: any): Promise<IPrescription> {
        const result = await this.prescriptionRepository.create(prescriptionData)
        return result;
    };

    // Get prescription
    async getPrescription(id: string): Promise<IPrescription | null> {
        const appointmentId = id.trim()
        return this.prescriptionRepository.findByAppointmentId(appointmentId);
    }

    // Update Prescription
    async UpdatePrescription(id: string, prescriptionData: any): Promise<IPrescription | null> {
        return this.prescriptionRepository.update(id, prescriptionData);
    }

   



  
}

export default new PrescriptionUseCase();

