import type { IAdminDashboardRepository } from "../../../domain/repositories/IAdminDashboardRepository"
import UserModel from "../models/UserModel"
import DoctorModel from "../models/DoctorModel"
import AppointmentModel from "../models/AppoinmentModel"
import ReviewModel from "../models/ReviewModel"

export class AdminDashboardRepository implements IAdminDashboardRepository {
  async getTotalUsers(): Promise<number> {
    return UserModel.countDocuments()
  }

  async getTotalApprovedDoctors(): Promise<number> {
    return DoctorModel.countDocuments({ isApproved: true })
  }

  async getTotalCompletedAppointments(startDate: Date, endDate: Date): Promise<number> {
    return AppointmentModel.countDocuments({
      isCompleted: true,
      date: { $gte: startDate, $lte: endDate },
    })
  }

  async getTotalAmountReceived(startDate: Date, endDate: Date): Promise<number> {
    const result = await AppointmentModel.aggregate([
      {
        $match: {
          isCompleted: true,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ])

    return result[0]?.totalAmount || 0
  }

  async getDailyRevenue(startDate: Date, endDate: Date): Promise<number[]> {
    const result = await AppointmentModel.aggregate([
      {
        $match: {
          isCompleted: true,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          revenue: { $sum: 50 }, 
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    const dailyRevenue: { [key: string]: number } = {}
    result.forEach((item) => {
      dailyRevenue[item._id] = item.revenue
    })

    const days = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split("T")[0]
      days.push(dailyRevenue[dateString] || 0)
    }

    return days
  }

  async getTopDoctorsByAppointments(
    startDate: Date,
    endDate: Date,
    limit: number,
  ): Promise<Array<{ name: string; appointments: number }>> {
    const result = await AppointmentModel.aggregate([
      {
        $match: {
          isCompleted: true,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$doctorId",
          appointments: { $sum: 1 },
        },
      },
      {
        $sort: { appointments: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $project: {
          name: "$doctor.fullName",
          appointments: 1,
        },
      },
    ])

    return result
  }

  async getTopRatedDoctors(limit: number): Promise<Array<{ name: string; rating: number }>> {
    const result = await ReviewModel.aggregate([
      {
        $group: {
          _id: "$doctorId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $sort: { averageRating: -1, totalReviews: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $project: {
          name: "$doctor.fullName",
          rating: { $round: ["$averageRating", 1] },
        },
      },
    ])

    return result
  }
}

