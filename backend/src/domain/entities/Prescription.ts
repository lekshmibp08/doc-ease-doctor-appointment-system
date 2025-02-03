import { Types } from "mongoose"


export interface IMedication {
  name: string
  dosage: string
  frequency: string
  duration: string
}

export interface IPrescription {
  id?: string
  appointmentId: Types.ObjectId | string
  patientName: string
  age: string
  diagnosis: string
  medications: IMedication[]
  advice: string
  followUpDate: string
  createdAt?: Date
  updatedAt?: Date
}

