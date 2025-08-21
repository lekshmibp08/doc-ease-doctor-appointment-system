import { UserRepository } from "../database/repositories/userRepository";
import { OtpRepository } from "../database/repositories/otpRepository";
import { DoctorRepository } from "../database/repositories/doctorRepository";

import { SendOtpForSignupUseCase } from "../../application/useCases/implimentations/user/sendOtpForSignup";
import { VerifyOtpAndRegister } from "../../application/useCases/implimentations/user/verifyOtpAndRegisterUser";
import { ListApprovedDoctors } from "../../application/useCases/implimentations/user/listApprovedDoctors";
import { UpdateUser } from "../../application/useCases/implimentations/user/updateUser";
import { SendOtpForResetPassword } from "../../application/useCases/implimentations/user/sendOtpForResetPassword";
import { VerifyOtpAndResetPassword } from "../../application/useCases/implimentations/user/verifyOtpAndResetPassword";
import { DoctorDetails } from "../../application/useCases/implimentations/user/doctorDetails";
import { FetchSpecializationsUseCase } from "../../application/useCases/implimentations/user/fetchSpecializationsUseCase";
import { UserLoginUseCase } from "../../application/useCases/implimentations/user/userLoginUseCase";
import { FindExistingUserUseCase } from "../../application/useCases/implimentations/user/findExistingUserUseCase";

import { UserController } from "../../interfaces/controllers/userController";

export function createUserController() {
  const userRepository = new UserRepository();
  const otpRepository = new OtpRepository();
  const doctorRepository = new DoctorRepository();

  const sendOtpForSignupUseCase = new SendOtpForSignupUseCase(otpRepository);
  const verifyOtpAndRegister = new VerifyOtpAndRegister(otpRepository, userRepository);
  const userLoginUseCase = new UserLoginUseCase(userRepository);
  const findExistingUserUseCase = new FindExistingUserUseCase(userRepository);
  const updateUser = new UpdateUser(userRepository);
  const sendOtpForResetPassword = new SendOtpForResetPassword(otpRepository);
  const verifyOtpAndResetPassword = new VerifyOtpAndResetPassword(otpRepository, userRepository);
  const listApprovedDoctors = new ListApprovedDoctors(doctorRepository);
  const fetchSpecializationsUseCase = new FetchSpecializationsUseCase(doctorRepository);
  const doctorDetails = new DoctorDetails(doctorRepository);

  return new UserController(
    sendOtpForSignupUseCase,
    verifyOtpAndRegister,
    userLoginUseCase,
    findExistingUserUseCase,
    updateUser,
    sendOtpForResetPassword,
    verifyOtpAndResetPassword,
    listApprovedDoctors,
    fetchSpecializationsUseCase,
    doctorDetails
  );
}
