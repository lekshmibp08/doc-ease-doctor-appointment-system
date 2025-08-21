import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { AppError } from "../../shared/errors/appError";

import { CreateAppointmentUseCase } from "../../application/useCases/implimentations/user/createAppointmentUseCase "; 
import { GetAppointmentsByUserUseCase } from "../../application/useCases/implimentations/user/getAppointmentsByUserUseCase "; 
import { CancelAppointmentByUserUsecase } from "../../application/useCases/implimentations/user/cancelAppointmentUseCase";
import { UpdateSlotStatus } from "../../application/useCases/implimentations/user/updateSlotStatusUseCase";
import { UpdateAppointment } from "../../application/useCases/implimentations/user/updateAppointmentUseCase";
import { RescheduleAppointmentUseCase } from "../../application/useCases/implimentations/user/rescheduleAppointmentUseCase";
import { ListAllAppointmentsForAdmin } from "../../application/useCases/implimentations/admin/listAllAppointmentsUseCase";
import { GetAppointmentsByDoctorIdUseCase } from "../../application/useCases/implimentations/doctor/getAppointmentsByDoctorIdUseCase";
import { UpdateAppointmentUseCase } from "../../application/useCases/implimentations/doctor/updateAppointmentUseCase";

import { paymentService } from "../../infrastructure/services";

export class AppointmentController {
  constructor(
    private createAppointmentUseCase: CreateAppointmentUseCase,
    private getAppointmentsByUserUseCase: GetAppointmentsByUserUseCase,
    private cancelAppointmentByUserUsecase: CancelAppointmentByUserUsecase,
    private updateSlotStatus: UpdateSlotStatus,
    private updateAppointment: UpdateAppointment,
    private rescheduleAppointmentUseCase: RescheduleAppointmentUseCase,
    private listAllAppointmentsForAdmin: ListAllAppointmentsForAdmin,
    private getAppointmentsByDoctorIdUseCase: GetAppointmentsByDoctorIdUseCase,
    private updateAppointmentUseCase: UpdateAppointmentUseCase
  ) {}

  createNewAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { time, modeOfVisit, amount, paymentId, doctorId, userId, date, slotId, timeSlotId } = req.body;
    try {
      const newAppointment = await this.createAppointmentUseCase.execute({
        doctorId, userId, date, slotId, timeSlotId, time, modeOfVisit, amount, paymentId,
      });
      res.status(HttpStatusCode.CREATED).json({ message: "Appointment created successfully.", newAppointment });
    } catch (error) {
      next(error);
    }
  };

  getAppointmentsByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const appointments = await this.getAppointmentsByUserUseCase.execute(userId);
      res.status(HttpStatusCode.OK).json({ appointments });
    } catch (error) {
      next(error);
    }
  };

  cancelAppointmentByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { appointmentId } = req.params;
      const updatedAppointment = await this.cancelAppointmentByUserUsecase.execute(appointmentId);

      if (!updatedAppointment.paymentId) {
        throw new AppError("No payment information found for this appointment", HttpStatusCode.BAD_REQUEST);
      }

      if (!updatedAppointment.slotId || !updatedAppointment.timeSlotId) {
        throw new AppError(
          "Invalid appointment: missing slotId or timeSlotId",
          HttpStatusCode.BAD_REQUEST
        );
      }

      await this.updateSlotStatus.execute(updatedAppointment.slotId, updatedAppointment.timeSlotId, "Not Booked");

      const refundAmount = updatedAppointment.amount ? updatedAppointment.amount - 50 : 0;
      let refundStatus: "Failed" | "Pending" | "Processed" = "Failed";
      let refundTransactionId: string | null = null;

      if (refundAmount > 0) {
        const refundResult = await paymentService.processRefund(updatedAppointment.paymentId, refundAmount);
        if (refundResult.success) {
          refundStatus = "Processed";
          refundTransactionId = refundResult.refundResponse?.id ?? null;
        }
      }

      await this.updateAppointment.execute(appointmentId, { refundAmount, refundStatus, refundTransactionId });

      res.status(HttpStatusCode.OK).json({
        message: "Appointment cancelled and refund initiated successfully.",
        refundTransactionId,
      });
    } catch (error) {
      next(error);
    }
  };

  rescheduleAppointmentByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { appointmentId, date, slotId, timeSlotId, time, modeOfVisit } = req.body;
      const updatedAppointment = await this.rescheduleAppointmentUseCase.execute(
        appointmentId, date, slotId, timeSlotId, time, modeOfVisit
      );
      res.status(HttpStatusCode.OK).json({
        message: "Appointment rescheduled successfully",
        updatedAppointment,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllAppointmentsByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, size, search } = req.query;
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);

      const { appointments, totalAppointments, totalPages } =
        await this.listAllAppointmentsForAdmin.execute(pageNumber, pageSize, search ? String(search) : "");

      res.status(HttpStatusCode.OK).json({ appointments, totalAppointments, totalPages, currentPage: pageNumber });
    } catch (error) {
      next(error);
    }
  };

  getAppointmentsByDoctorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, size, date, doctorId } = req.query;
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);

      const { appointments, totalAppointments, totalPages } =
        await this.getAppointmentsByDoctorIdUseCase.execute(doctorId as string, date as string, pageNumber, pageSize);

      res.status(HttpStatusCode.OK).json({ appointments, totalAppointments, totalPages, currentPage: pageNumber });
    } catch (error) {
      next(error);
    }
  };

  updateAppointmentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { appointmentId } = req.params;
      const { isCompleted } = req.body;

      await this.updateAppointmentUseCase.execute(appointmentId, isCompleted);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Appointment status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
