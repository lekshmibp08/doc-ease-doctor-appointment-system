import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { stripBaseUrl } from "../../../helper/stripBaseUrl";

export class FetchPendingDoctors {
  constructor(private doctorRepository: IDoctorRepository) {}
  private mapToPendingDoctorDTO(doc: any) {
    return {
      _id: doc._id,
      fullName: doc.fullName,
      isApproved: doc.isApproved,
      isBlocked: doc.isBlocked,
      registerNumber: doc.registerNumber,
      isRejected: doc.isRejected,
      documents: doc.documents.map((url: string) => stripBaseUrl(url)),
    };
  }

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

    const doctorsData = await this.doctorRepository.getDoctorsWithPagination(
      skip,
      limit,
      query
    );
    const doctors = doctorsData.map((doc) => this.mapToPendingDoctorDTO(doc));
    const totalDoctors = await this.doctorRepository.countDoctors(query);
    const totalPages = Math.ceil(totalDoctors / size);

    return {
      doctors,
      totalDoctors,
      totalPages,
    };
  }
}
