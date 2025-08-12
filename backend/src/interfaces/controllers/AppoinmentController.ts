import { NextFunction, Request, Response } from "express";
import { SlotRepository } from "../../infrastructure/database/repositories/SlotRepository";
import { AppointmentRepository } from "../../infrastructure/database/repositories/AppoinmentRepository";
import { CreateAppointmentUseCase } from "../../application/useCases/user/CreateAppointmentUseCase ";
import { GetAppointmentsByUserUseCase } from "../../application/useCases/user/getAppointmentsByUserUseCase ";
import { CancelAppointmentByUserUsecase } from "../../application/useCases/user/cancelAppointmentUseCase";
import { ListAllAppointmentsForAdmin } from "../../application/useCases/admin/listAllAppointmentsUseCase";
import { GetAppointmentsByDoctorIdUseCase } from "../../application/useCases/doctor/getAppointmentsByDoctorIdUseCase";
import { UpdateAppointmentUseCase } from "../../application/useCases/doctor/updateAppointmentUseCase";
import { UpdateSlotStatus } from "../../application/useCases/user/updateSlotStatusUseCase";
import { RescheduleAppointmentUseCase } from "../../application/useCases/user/rescheduleAppointmentUseCase";
import { UpdateAppointment } from "../../application/useCases/user/updateAppointmentUseCase";
import { paymentService } from "../../infrastructure/services";

const slotRepository = new SlotRepository();
const appointmentRepository = new AppointmentRepository();
const createAppointmentUseCase = new CreateAppointmentUseCase(
  appointmentRepository,
  slotRepository
);
const getAppointmentsByUserUseCase = new GetAppointmentsByUserUseCase(
  appointmentRepository
);
const cancelAppointmentByUserUsecase = new CancelAppointmentByUserUsecase(
  appointmentRepository
);
const updateSlotStatus = new UpdateSlotStatus(slotRepository);
const updateAppointment = new UpdateAppointment(appointmentRepository);
const rescheduleAppointmentUseCase = new RescheduleAppointmentUseCase(
  appointmentRepository,
  slotRepository
);
const listAllAppointmentsForAdmin = new ListAllAppointmentsForAdmin(
  appointmentRepository
);
const getAppointmentsByDoctorIdUseCase = new GetAppointmentsByDoctorIdUseCase(
  appointmentRepository
);
const updateAppointmentUseCase = new UpdateAppointmentUseCase(
  appointmentRepository
);

export const appoinmentController = {
  createNewAppoinment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { time, modeOfVisit, amount, paymentId } = req.body;

    const doctorId = req.body.doctorId as string;
    const userId = req.body.userId as string;
    const date = req.body.date as string;
    const slotId = req.body.slotId as string;
    const timeSlotId = req.body.timeSlotId as string;

    try {
      const newAppoinment = await createAppointmentUseCase.execute({
        doctorId,
        userId,
        date,
        slotId,
        timeSlotId,
        time,
        modeOfVisit,
        amount,
        paymentId,
      });
      res
        .status(201)
        .json({ message: "Appointment created successfully.", newAppoinment });
    } catch (error) {
      next(error);
    }
  },

  getAppointmentsByUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { userId } = req.params;

    try {
      const appointments = await getAppointmentsByUserUseCase.execute(
        userId as string
      );
      console.log(appointments);

      res.status(200).json({ appointments });
    } catch (error) {
      next(error);
    }
  },

  cancelAppointmentByUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { appointmentId } = req.params;
    try {
      const updatedAppointment = await cancelAppointmentByUserUsecase.execute(
        appointmentId
      );
      const updatedData = updatedAppointment.isCancelled;
      const slotId = updatedAppointment.slotId;
      const timeSlotId = updatedAppointment.timeSlotId;
      const status = "Not Booked";
      const amount = updatedAppointment.amount;
      const paymentId = updatedAppointment.paymentId;

      if (!paymentId) {
        res
          .status(400)
          .json({ error: "No payment information found for this appointment" });
        return;
      }

      await updateSlotStatus.execute(
        slotId as string,
        timeSlotId as string,
        status
      );

      const refundAmount = amount ? amount - 50 : 0;
      let refundStatus: "Failed" | "Pending" | "Processed" = "Failed";
      let refundTransactionId = null;

      if (refundAmount > 0) {
        const refundResult = await paymentService.processRefund(
          paymentId,
          refundAmount
        );

        if (refundResult.success) {
          refundStatus = "Processed";
          refundTransactionId = refundResult.refundResponse?.id;
        }
      }

      await updateAppointment.execute(appointmentId, {
        refundAmount,
        refundStatus,
        refundTransactionId,
      });

      res.status(200).json({
        message: "Appointment cancelled and refund initiated Successfully.",
        updatedData,
        refundTransactionId,
      });
    } catch (error) {
      next(error);
    }
  },

  rescheduleAppointmentByUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appointmentId, date, slotId, timeSlotId, time, modeOfVisit } =
        req.body;

      const updatedAppointment = await rescheduleAppointmentUseCase.execute(
        appointmentId,
        date,
        slotId,
        timeSlotId,
        time,
        modeOfVisit
      );

      res.status(200).json({
        message: "Appointment rescheduled successfully",
        updatedAppointment,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllAppointmentsByAdmin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, size, search } = req.query;

      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);
      const searchQuery = search ? String(search) : "";

      const { appointments, totalAppointments, totalPages } =
        await listAllAppointmentsForAdmin.execute(
          pageNumber,
          pageSize,
          searchQuery
        );
      res.status(200).json({
        appointments,
        totalAppointments,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error: any) {
      next(error);
    }
  },

  getAppointmentsByDoctorId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { page, size, date, doctorId } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(size as string);

    try {
      const { appointments, totalAppointments, totalPages } =
        await getAppointmentsByDoctorIdUseCase.execute(
          doctorId as string,
          date as string,
          pageNumber,
          pageSize
        );

      res.status(200).json({
        appointments,
        totalAppointments,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error: any) {
      next(error);
    }
  },

  updateAppointmentStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { appointmentId } = req.params;
    const { isCompleted } = req.body;

    try {
      await updateAppointmentUseCase.execute(
        appointmentId,
        isCompleted
      );

      res.status(200).json({
        success: true,
        message: "Appointment status updated successfully",
      });
    } catch (error: any) {
      next(error);
    }
  },
};
