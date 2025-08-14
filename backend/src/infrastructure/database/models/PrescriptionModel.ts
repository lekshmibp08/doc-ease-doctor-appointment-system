import mongoose, { type Model } from "mongoose"
import type { IPrescription, IMedication } from "../../../domain/entities/prescription"

const medicationSchema = new mongoose.Schema<IMedication>({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
})

const prescriptionSchema = new mongoose.Schema<IPrescription>(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medications: {
      type: [medicationSchema],
      required: true,
    },
    advice: {
      type: String,
    },
    followUpDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const PrescriptionModel: Model<IPrescription> = mongoose.model<IPrescription>("Prescription", prescriptionSchema)
export default PrescriptionModel

