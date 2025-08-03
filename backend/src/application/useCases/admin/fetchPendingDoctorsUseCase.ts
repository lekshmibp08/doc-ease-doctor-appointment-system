import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export class FetchPendingDoctors {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(page: number, size: number, search: string) {
    const skip = (page - 1) * size;
    const limit = size;

    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { registerNumber: { $regex: search, $options: "i" } },
          ],
          isApproved: false,
        }
      : { isApproved: false };

    const doctors = await this.doctorRepository.getDoctorsWithPagination(
      skip,
      limit,
      query
    );
    const totalDoctors = await this.doctorRepository.countDoctors(query);
    const totalPages = Math.ceil(totalDoctors / size);

    return {
      doctors,
      totalDoctors,
      totalPages,
    };
  }
}
