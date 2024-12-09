import { Doctor } from "../entities/Doctor";

export type IDoctorRepository = {
  findByEmail: (email: string) => Promise<Doctor | null>;
  create: (doctor: Doctor) => Promise<Doctor>;
  getAllDoctors: () => Promise<Doctor[]>;
};
