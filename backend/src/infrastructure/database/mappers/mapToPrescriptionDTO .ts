import { PrescriptionDTO } from "../../../dtos/prescriptionDTO/prescriptionDTOs"; 

export const mapToPrescriptionDTO = (doc: any): PrescriptionDTO => ({
  _id: doc._id.toString(),
  patientName: doc.patientName,
  age: doc.age,
  diagnosis: doc.diagnosis,
  medications: doc.medications.map((m: any) => ({
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    duration: m.duration,
  })),
  advice: doc.advice,
  followUpDate: doc.followUpDate,
  createdAt: doc.createdAt,
});
