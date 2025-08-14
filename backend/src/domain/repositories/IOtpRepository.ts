import { Otp } from '../entities/otp'

export type IOtpRepository = {
    saveOtp: (otp: Otp) => Promise<void>;
    findOtp: (email: string, otp: string) => Promise<Otp | null>;
    deleteOtp: (email: string) => Promise<void>;
  };
  