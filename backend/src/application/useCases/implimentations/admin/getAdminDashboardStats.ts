import type { IAdminDashboardRepository } from "../../../../domain/repositories/IAdminDashboardRepository";
import { startOfDay, endOfDay, eachDayOfInterval, format } from "date-fns";

export class GetAdminDashboardStatsUseCase {
  constructor(private adminDashboardRepository: IAdminDashboardRepository) {}

  async execute(startDate: Date, endDate: Date) {
    const start = startOfDay(new Date(startDate));
    const end = endOfDay(new Date(endDate));

    const totalUsers = await this.adminDashboardRepository.getTotalUsers();
    const totalDoctors =
      await this.adminDashboardRepository.getTotalApprovedDoctors();
    const totalAppointments =
      await this.adminDashboardRepository.getTotalCompletedAppointments(
        start,
        end
      );
    const totalAmountReceived =
      await this.adminDashboardRepository.getTotalAmountReceived(start, end);
    const totalRevenue = totalAppointments * 50;

    const days = eachDayOfInterval({ start, end });
    const revenueData = await this.adminDashboardRepository.getDailyRevenue(
      start,
      end
    );

    const labels = days.map((day) => format(day, "MMM dd"));
    const revenueChartData = {
      labels,
      datasets: [{ label: "Revenue", data: revenueData }],
    };

    const topDoctorsByAppointments =
      await this.adminDashboardRepository.getTopDoctorsByAppointments(
        start,
        end,
        10
      );
    const topRatedDoctors =
      await this.adminDashboardRepository.getTopRatedDoctors(10);

    return {
      totalUsers,
      totalDoctors,
      totalAppointments,
      totalAmountReceived,
      totalRevenue,
      revenueData: revenueChartData,
      topDoctorsByAppointments,
      topRatedDoctors,
    };
  }
}
