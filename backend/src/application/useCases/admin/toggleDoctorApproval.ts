import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { sendEmail } from "../../../infrastructure/web/services/EmailService";

export const toggleApproval = async (doctorRepository: IDoctorRepository, id: string, reason: string) => {
    const doctor = await doctorRepository.findDoctorById(id);

    if (!doctor) {
        throw new Error('Doctor not found'); 
    }

    const updatedStatus = !doctor.isApproved;    
    const updatedDoctor = await doctorRepository.updateDoctor(id, { isApproved: updatedStatus})  
    const email = updatedDoctor?.email;
    
    if (!email) {
        throw new Error("Doctor's email is missing. Cannot send email.");
    }


    if(!updatedDoctor?.isApproved) {
        console.log(            `Dear Practitioner,\n\nYour application has been rejected for the following reason:\n${reason}\n\nPlease re-apply after resolving the issues.\n\nBest regards,\nAdmin Team`,
        );
        await sendEmail(
            email,
            "Registration Rejected",
            `Dear Practitioner,\n\nYour application has been rejected for the following reason:\n${reason}\n\nPlease reapply after resolving the issues.\n\nBest regards,\nAdmin Team`,
          );
    }

    return {
        isApproved: updatedStatus,
        message: `Doctor has been ${updatedStatus ? 'approved' : 'blocked'} successfully`,
    };
}