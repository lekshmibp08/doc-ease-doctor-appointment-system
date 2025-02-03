import type React from "react"
import { useState, useEffect } from "react"
import axios from "../services/axiosConfig"

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
}

interface Prescription {
  _id?: string
  patientName: string
  age: string
  diagnosis: string
  medications: Medication[]
  advice: string
  followUpDate: string
}

interface PrescriptionFormProps {
  appointmentId: string
  patientName: any
  age: any
  existingPrescription: Prescription | null
  onClose: () => void
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  appointmentId,
  patientName,
  age,
  existingPrescription,
  onClose,
}) => {
  const [prescription, setPrescription] = useState<Prescription>({
    patientName: patientName,
    age: age,
    diagnosis: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    advice: "",
    followUpDate: "",
  })

  useEffect(() => {
    console.log('====================================');
    console.log("Existing Prescr: ", existingPrescription);
    console.log('====================================');
    if (existingPrescription) {
      setPrescription(existingPrescription)
    }
  }, [existingPrescription])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrescription({ ...prescription, [e.target.name]: e.target.value })
  }

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...prescription.medications]
    updatedMedications[index] = { ...updatedMedications[index], [field]: value }
    setPrescription({ ...prescription, medications: updatedMedications })
  }

  const addMedication = () => {
    setPrescription({
      ...prescription,
      medications: [...prescription.medications, { name: "", dosage: "", frequency: "", duration: "" }],
    })
  }

  const removeMedication = (index: number) => {
    const updatedMedications = prescription.medications.filter((_, i) => i !== index)
    setPrescription({ ...prescription, medications: updatedMedications })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (existingPrescription) {
        await axios.put(`/api/doctors/prescriptions/${existingPrescription._id}`, { prescription })
      } else {
        await axios.post("/api/doctors/prescriptions", { appointmentId, prescription })
      }
      onClose()
    } catch (error) {
      console.error("Error saving prescription:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-6xl my-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {existingPrescription ? "Edit Prescription" : "Add Prescription"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={prescription.patientName}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="text"
                name="age"
                value={prescription.age}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
            <input
              type="text"
              name="diagnosis"
              value={prescription.diagnosis}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medications</label>
            {prescription.medications.map((medication, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Medicine"
                  value={medication.name}
                  onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                  className="border rounded-md shadow-sm py-2 px-3 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={medication.dosage}
                  onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                  className="border rounded-md shadow-sm py-2 px-3 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={medication.frequency}
                  onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                  className="border rounded-md shadow-sm py-2 px-3 text-sm"
                  required
                />
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Duration"
                    value={medication.duration}
                    onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                    className="border rounded-md shadow-sm py-2 px-3 text-sm flex-grow"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMedication}
              className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Medication
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Advice</label>
            <textarea
              name="advice"
              value={prescription.advice}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
            <input
              type="date"
              name="followUpDate"
              value={prescription.followUpDate}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-sm w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-customTeal text-white rounded-md hover:bg-teal-600 text-sm w-full sm:w-auto"
            >
              {existingPrescription ? "Update Prescription" : "Save Prescription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PrescriptionForm

