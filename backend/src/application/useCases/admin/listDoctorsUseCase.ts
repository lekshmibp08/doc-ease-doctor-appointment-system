import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export const listDoctors = async (doctorRepository: IDoctorRepository, page: number, size: number, search: string) => {
  const skip = (page - 1) * size;
  const limit = size;

  const query = search
    ? { $or: [
        { fullName: { $regex: search, $options: "i" } }, 
        { email: { $regex: search, $options: "i" } }, 
        { mobileNumber: { $regex: search, $options: "i" } },
        { registerNumber: { $regex: search, $options: "i" } }
    ] }
    : {};

  const doctors = await doctorRepository.getDoctorsWithPagination(skip, limit, query);
  const totalDoctors = await doctorRepository.countDoctors(query);
  const totalPages = Math.ceil(totalDoctors / size);

  return {
    doctors,
    totalDoctors,
    totalPages,
  };
};
