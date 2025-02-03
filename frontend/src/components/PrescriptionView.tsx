import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useReactToPrint } from "react-to-print"
import axios from "../services/axiosConfig"
import { format } from "date-fns"

interface PrescriptionViewProps {
  appointmentId: string
  onClose: () => void
}

interface Prescription {
  patientName: string
  age: string
  diagnosis: string
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
  }>
  advice: string
  followUpDate: string
}

interface Doctor {
  fullName: string
  specialization: string
  registerNumber: string
  addressLine: string
  mobileNumber: string
  email: string
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({ appointmentId, onClose }) => {
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const componentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`/api/users/prescriptions/${appointmentId}`)
        console.log("Prescription Data:", response.data)
        setPrescription(response.data.prescription)
        setDoctor(response.data.doctor)
      } catch (error) {
        console.error("Error fetching prescription:", error)
      }
    }

    fetchPrescription()
  }, [appointmentId])



useEffect(() => {
  console.log("Component Mounted, Ref:", componentRef.current);

  // Check ref again when prescription is loaded
  if (prescription) {
    console.log("Prescription Loaded, Component Ref:", componentRef.current);
  }
}, [prescription]);

const handlePrint = useReactToPrint({
  content: () => {
    console.log("Component Ref Before Print:", componentRef.current);
    return componentRef.current || null;
  },
  documentTitle: `Prescription_${appointmentId}`,
  onBeforeGetContent: () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Component Ref (Delayed Check):", componentRef.current);
        resolve(); 
      }, 500); 
    });
  },
  onPrintError: (error: any) => console.error("Print error:", error),
});
  


  if (!prescription || !doctor) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-xl font-semibold">Loading prescription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
        <div ref={componentRef} className="p-8">
          {/* Doctor's Information Header */}
          <header className="border-b-2 border-gray-300 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-blue-800">{doctor.fullName}</h1>
            <p className="text-lg text-gray-600">{doctor.specialization}</p>
            <p className="text-sm text-gray-500">License No: {doctor.registerNumber}</p>
            <div className="mt-2">
              <p className="text-sm">{doctor.addressLine}</p>
              <p className="text-sm">
                Phone: {doctor.mobileNumber} | Email: {doctor.email}
              </p>
            </div>
          </header>

          {/* Patient Information */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Patient Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Name:</span> {prescription.patientName}
                </p>
                <p>
                  <span className="font-semibold">Age:</span> {prescription.age} years
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Date:</span> {format(new Date(), "MMMM d, yyyy")}
                </p>
                <p>
                  <span className="font-semibold">Patient ID:</span> {appointmentId}
                </p>
              </div>
            </div>
          </section>

          {/* Prescription */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Prescription</h2>
            <div className="border-t border-b border-gray-300 py-4">
              <p className="mb-2">
                <span className="font-semibold">Diagnosis:</span> {prescription.diagnosis}
              </p>

              <h3 className="font-semibold mt-4 mb-2">Medications:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {prescription.medications.map((med, index) => (
                  <li key={index}>
                    {med.name} - {med.dosage}, {med.frequency}, for {med.duration}
                  </li>
                ))}
              </ul>

              {prescription.advice && (
                <>
                  <h3 className="font-semibold mt-4 mb-2">Instructions:</h3>
                  <p>{prescription.advice}</p>
                </>
              )}
            </div>
          </section>

          {/* Follow-up */}
          {prescription.followUpDate && (
            <section>
              <h2 className="text-xl font-semibold mb-2">Follow-up</h2>
              <p>Please schedule a follow-up appointment on {prescription.followUpDate}.</p>
              <p className="mt-2">
                If you experience any severe side effects or your condition worsens, please contact the clinic
                immediately.
              </p>
            </section>
          )}

          {/* Footer */}
          <footer className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
            <p>This prescription is electronically generated and is valid without a signature.</p>
          </footer>
        </div>
        <div className="flex justify-end p-4 bg-gray-100 rounded-b-lg">
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2">
            Download PDF
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionView

