import { IListDoctorsUseCase } from "../../interfaces/admin/adminUseCaseInterfaces";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";

export class ListDoctorsUseCase implements IListDoctorsUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  private mapToDoctorListDTO(doc: any) {
    return {
      _id: doc._id,
      fullName: doc.fullName,
      email: doc.email,
      isApproved: doc.isApproved,
      isBlocked: doc.isBlocked,
      mobileNumber: doc.mobileNumber,
      registerNumber: doc.registerNumber,
    };
  }

  async execute(page: number, size: number, search: string) {
    const skip = (page - 1) * size;
    const limit = size;

    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { mobileNumber: { $regex: search, $options: "i" } },
            { registerNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const doctorsData = await this.doctorRepository.getDoctorsWithPagination(
      skip,
      limit,
      query
    );
    const doctors = doctorsData.map((doc) => this.mapToDoctorListDTO(doc));
    const totalDoctors = await this.doctorRepository.countDoctors(query);
    const totalPages = Math.ceil(totalDoctors / size);

    return {
      doctors,
      totalDoctors,
      totalPages,
    };
  }
}
