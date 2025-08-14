import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { HttpStatusCode } from "../../../../enums/HttpStatusCode";
import { sendEmail } from "../../../../infrastructure/services/EmailService";
import { AppError } from "../../../../shared/errors/appError";

export class RejectRequestUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(id: string, reason: string) {
    const doctor = await this.doctorRepository.findDoctorById(id);

    if (!doctor) {
      throw new AppError("Doctor not found", HttpStatusCode.NOT_FOUND);
    }

    const updatedDoctor = await this.doctorRepository.updateDoctor(id, {
      isRejected: true,
    });
    const email = updatedDoctor?.email;
    if (!email) {
      throw new AppError(
        "Doctor's email is missing. Cannot send email.",
        HttpStatusCode.BAD_REQUEST
      );
    }

    await sendEmail(
      email,
      "Registration Rejected",
      `Dear ${doctor.fullName},\n\nYour application has been rejected for the following reason:\n${reason}\n\nPlease reapply after resolving the issues.\n\nBest regards,\nAdmin Team`
    );

    return;
  }
}
