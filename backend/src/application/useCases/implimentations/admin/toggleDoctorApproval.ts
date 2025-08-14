import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { HttpStatusCode } from "../../../../enums/HttpStatusCode";
import { sendEmail } from "../../../../infrastructure/services/EmailService";
import { AppError } from "../../../../shared/errors/appError";

export const toggleApproval = async (
  doctorRepository: IDoctorRepository,
  id: string,
  reason: string
) => {
  const doctor = await doctorRepository.findDoctorById(id);

  if (!doctor) {
    throw new AppError("Doctor not found", HttpStatusCode.NOT_FOUND);
  }

  const updatedStatus = !doctor.isApproved;
  const updatedDoctor = await doctorRepository.updateDoctor(id, {
    isApproved: updatedStatus,
  });
  const email = updatedDoctor?.email;

  if (!email) {
    throw new AppError(
      "Doctor's email is missing. Cannot send email.",
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (!updatedDoctor?.isApproved) {
    await sendEmail(
      email,
      "Registration Rejected",
      `Dear Practitioner,\n\nYour application has been rejected for the following reason:\n${reason}\n\nPlease reapply after resolving the issues.\n\nBest regards,\nAdmin Team`
    );
  }

  return {
    isApproved: updatedStatus,
    message: `Doctor has been ${
      updatedStatus ? "approved" : "blocked"
    } successfully`,
  };
};
