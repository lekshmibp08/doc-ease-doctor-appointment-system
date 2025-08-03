import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export class ListApprovedDoctors {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(criteria: {
    page: number;
    size: number;
    search?: string;
    locationName?: string;
    latitude: number;
    longitude: number;
    gender?: string;
    experience?: string;
    availability?: string;
    fee?: string;
    department?: string;
    sort?: string;
  }) {
    const query: any = { isBlocked: false, isApproved: true };

    if (criteria.search) {
      query.$or = [
        { fullName: { $regex: criteria.search, $options: "i" } },
        { specialization: { $regex: criteria.search, $options: "i" } },
      ];
    }

    if (criteria.locationName) {
      const locationParts = criteria.locationName
        .split(",")
        .map((part) => part.trim());
      query.$or = locationParts.map((part) => ({
        locationName: { $regex: new RegExp(part, "i") },
      }));
    }

    if (criteria.latitude !== 0 && criteria.longitude !== 0) {
      query.$expr = {
        $lt: [
          {
            $sqrt: {
              $add: [
                {
                  $pow: [
                    {
                      $subtract: [
                        criteria.latitude,
                        "$locationCoordinates.latitude",
                      ],
                    },
                    2,
                  ],
                },
                {
                  $pow: [
                    {
                      $subtract: [
                        criteria.longitude,
                        "$locationCoordinates.longitude",
                      ],
                    },
                    2,
                  ],
                },
              ],
            },
          },
          0.05,
        ],
      };
    }

    if (criteria.gender) query.gender = criteria.gender;

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

    if (criteria.fee) {
      if (criteria.fee === "Below ₹250") {
        query.fee = { $lt: 250 };
      } else if (criteria.fee === "250-500") {
        query.fee = { $gte: 250, $lte: 500 };
      } else if (criteria.fee === "Above 500") {
        query.fee = { $gt: 500 };
      }
    }

    const sortOptions: any = {};
    if (criteria.sort === "experience") sortOptions.experience = -1;
    else if (criteria.sort === "fees") sortOptions.fees = 1;

    const skip = (criteria.page - 1) * criteria.size;
    const limit = criteria.size;

    const { doctors, totalDocs } =
      await this.doctorRepository.getDoctorsByCriteria(
        query,
        sortOptions,
        skip,
        limit
      );

    return {
      doctors,
      totalPages: Math.ceil(totalDocs / criteria.size),
    };
  }
}
