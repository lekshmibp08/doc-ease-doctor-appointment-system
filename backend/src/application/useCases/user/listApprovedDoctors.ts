import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export const listApprovedDoctors = async (
  doctorRepository: IDoctorRepository,
  criteria: {
    page: number;
    size: number;
    search?: string;
    location?: string;
    gender?: string;
    experience?: string;
    availability?: string;
    fee?: string;
    department?: string;
    sort?: string;
  }
) => {
  const query: any = { isBlocked: false, isApproved: true };

  // Apply search on fullName and specialization
  if (criteria.search) {
    query.$or = [
      { fullName: { $regex: criteria.search, $options: "i" } },
      { specialization: { $regex: criteria.search, $options: "i" } }
    ];
  }

  // Apply filters
  if (criteria.location) query.location = criteria.location;
  if (criteria.gender) query.gender = criteria.gender;

  // Parse experience filter
  if (criteria.experience) {
    if (criteria.experience === "1-5") {
      query.experience = { $lte: 5 };
    } else if (criteria.experience === "6-10") {
      query.experience = { $gte: 6, $lte: 10 };
    } else if (criteria.experience === "10+") {
      query.experience = { $gt: 10 };
    }
  }

  if (criteria.department) query.specialization = criteria.department;

  // Parse fees filter
  if (criteria.fee) {
    if (criteria.fee === "Below ₹250") {
      query.fee = { $lt: 250 };
    } else if (criteria.fee === "250-500") {
      query.fee = { $gte: 250, $lte: 500 };
    } else if (criteria.fee === "Above 500") {
      query.fee = { $gt: 500 };
    }
  }

  // Define sorting
  const sortOptions: any = {};
  if (criteria.sort === "experience") sortOptions.experience = -1;
  else if (criteria.sort === "fees") sortOptions.fees = 1;

  // Pagination
  const skip = (criteria.page - 1) * criteria.size;
  const limit = criteria.size;

  // Fetch doctors using the repository
  const { doctors, totalDocs } = await doctorRepository.getDoctorsByCriteria(
    query,
    sortOptions,
    skip,
    limit
  );

  return {
    doctors,
    totalPages: Math.ceil(totalDocs / criteria.size),
  };
};
