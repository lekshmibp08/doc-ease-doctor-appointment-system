import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { sendEmail } from "../../../infrastructure/web/services/EmailService";

export const rejectRequest = async (doctorRepository: IDoctorRepository, id: string, reason: string) => {
    const doctor = await doctorRepository.findDoctorById(id);

    if (!doctor) {
        throw new Error('Doctor not found'); 
    }

    const updatedDoctor = await doctorRepository.updateDoctor(id, { isRejected: true})  
    const email = updatedDoctor?.email;
    if (!email) {
        throw new Error("Doctor's email is missing. Cannot send email.");
    }

    await sendEmail(
        email,
        "Registration Rejected",
        `Dear ${doctor.fullName},\n\nYour application has been rejected for the following reason:\n${reason}\n\nPlease reapply after resolving the issues.\n\nBest regards,\nAdmin Team`,
    );

    return;
}