import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { sendEmail } from "../../../infrastructure/services/EmailService"; 

export const approveDoctor = async (doctorRepository: IDoctorRepository, id: string) => {
    const doctor = await doctorRepository.findDoctorById(id);

    if (!doctor) {
        throw new Error('Doctor not found'); 
    }

    const updatedDoctor = await doctorRepository.updateDoctor(id, { isApproved: true})  
    const email = updatedDoctor?.email;
    if (!email) {
        throw new Error("Doctor's email is missing. Cannot send email.");
    }

    if(updatedDoctor?.isApproved) {
        await sendEmail(
            email,
            "Registration Approval Confirmation",
            `Dear ${doctor.fullName},\n\nWe are pleased to inform you that your registration as a practitioner in our system has been successfully reviewed and approved by our admin team.
            \n\nYou are now officially a part of our platform and can access your account to manage your profile, schedule appointments, and connect with patients.
            \n\nNext Steps:
            \n 1.   Log in to your account using your registered credentials.
            \n 2.   Update your availability and other relevant details in your profile to start receiving appointment requests.
            \n\nIf you have any questions or require assistance, feel free to reach out to our support team at [support email/contact number].
            \n\nThank you for joining us in our mission to provide seamless healthcare solutions.
            \n\nBest Regards,\nAdmin Team,\nDocEase`,
          );
    }

    return;
}