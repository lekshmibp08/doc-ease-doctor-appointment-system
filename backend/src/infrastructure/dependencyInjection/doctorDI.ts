import { DoctorController } from "../../interfaces/controllers/doctorController";
import { OtpRepository } from "../database/repositories/otpRepository";
import { DoctorRepository } from "../database/repositories/doctorRepository";
import { AppointmentRepository } from "../database/repositories/appoinmentRepository";

import { SendOtpForSignupUseCase } from "../../application/useCases/implimentations/user/sendOtpForSignup";
import { VerifyOtpAndRegisterDocUseCase } from "../../application/useCases/implimentations/doctor/verifyOtpAndRegisterDoc";
import { LoginDoctorUseCase } from "../../application/useCases/implimentations/doctor/loginDoctorUseCase";
import { SendOtpForResetPassword } from "../../application/useCases/implimentations/user/sendOtpForResetPassword";
import { VerifyOtpAndResetDoctorPassword } from "../../application/useCases/implimentations/doctor/resetDoctorPassworduseCase";
import { UpdateDocProfile } from "../../application/useCases/implimentations/doctor/updateDocProfileUseCase";
import { GetDashboardStatsUseCase } from "../../application/useCases/implimentations/doctor/getDashboardStatsUseCase";
import { FindExistingDoctorUseCase } from "../../application/useCases/implimentations/doctor/findExistingDoctorUseCase";

export function createDoctorController() {
  const otpRepository = new OtpRepository();
  const doctorRepository = new DoctorRepository();
  const appointmentRepository = new AppointmentRepository();

  // Use cases
  const findExistingDoctorUseCase = new FindExistingDoctorUseCase(doctorRepository)
  const sendOtpForSignupUseCase = new SendOtpForSignupUseCase(otpRepository);
  const sendOtpForResetPassword = new SendOtpForResetPassword(otpRepository);
  const verifyOtpAndRegisterDocUseCase = new VerifyOtpAndRegisterDocUseCase(
    otpRepository,
    doctorRepository
  );
  const loginDoctorUseCase = new LoginDoctorUseCase(doctorRepository);
  const verifyOtpAndResetDoctorPassword = new VerifyOtpAndResetDoctorPassword(
    otpRepository,
    doctorRepository
  );
  const updateDocProfile = new UpdateDocProfile(doctorRepository);
  const getDashboardStatsUseCase = new GetDashboardStatsUseCase(
    appointmentRepository
  );

  return new DoctorController(
    findExistingDoctorUseCase,
    sendOtpForSignupUseCase,
    sendOtpForResetPassword,
    verifyOtpAndRegisterDocUseCase,
    loginDoctorUseCase,
    verifyOtpAndResetDoctorPassword,
    updateDocProfile,
    getDashboardStatsUseCase
  );
}
