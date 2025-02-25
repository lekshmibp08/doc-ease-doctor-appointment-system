export interface IAdminDashboardRepository {
  getTotalUsers(): Promise<number>
  getTotalApprovedDoctors(): Promise<number>
  getTotalCompletedAppointments(startDate: Date, endDate: Date): Promise<number>
  getTotalAmountReceived(startDate: Date, endDate: Date): Promise<number>
  getDailyRevenue(startDate: Date, endDate: Date): Promise<number[]>
  getTopDoctorsByAppointments(
    startDate: Date,
    endDate: Date,
    limit: number,
  ): Promise<Array<{ name: string; appointments: number }>>
  getTopRatedDoctors(limit: number): Promise<Array<{ name: string; rating: number }>>
}

