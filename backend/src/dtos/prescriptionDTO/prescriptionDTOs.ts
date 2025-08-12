export interface PrescriptionDTO {
  _id: string;
  patientName: string;
  age: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  advice: string;
  followUpDate: string;
  createdAt: Date;
}