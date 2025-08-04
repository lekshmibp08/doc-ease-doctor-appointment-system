import { Request, Response } from "express";
import { SlotRepository } from "../../infrastructure/database/repositories/SlotRepository";
import { AppointmentRepository } from "../../infrastructure/database/repositories/AppoinmentRepository";
import { CreateAppointmentUseCase } from "../../application/useCases/user/CreateAppointmentUseCase ";
import { GetAppointmentsByUserUseCase } from "../../application/useCases/user/getAppointmentsByUserUseCase ";
import { CancelAppointmentByUserUsecase } from "../../application/useCases/user/cancelAppointment";
import { listAllAppointmentsForAdmin } from "../../application/useCases/admin/listAllAppointmentsForAdmin";
import { getAppointmentsByDoctorIdUseCase } from "../../application/useCases/doctor/getAppointmentsByDoctorIdUseCase";
import { updateAppointmentUseCase } from "../../application/useCases/doctor/updateAppointmentUseCase";
import { UpdateSlotStatus } from "../../application/useCases/user/updateSlotStatus";
import rescheduleAppointmentUseCase from "../../application/useCases/user/rescheduleAppointmentUseCase";
import { UpdateAppointment } from "../../application/useCases/user/updateAppointment";
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


export const appoinmentController = {
  createNewAppoinment: async (req: Request, res: Response): Promise<void> => {
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
      console.error(error);
      res.status(500).json({ error: "Failed to create appointment." });
    }
  },

  getAppointmentsByUser: async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
      const appointments = await getAppointmentsByUserUseCase.execute(
        userId as string
      );
      res.status(200).json({ appointments });
    } catch (error) {
      console.error("Error fetching user appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments." });
    }
  },

  cancelAppointmentByUser: async (
    req: Request,
    res: Response
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
      console.error("Error cancelling appointment:", error);
      res.status(500).json({ error: "Failed to cancel appointment." });
    }
  },

  rescheduleAppointmentByUser: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { appointmentId, date, slotId, timeSlotId, time, modeOfVisit } =
        req.body;

      const updatedAppointment = await rescheduleAppointmentUseCase(
        appointmentId,
        date,
        slotId,
        timeSlotId,
        time,
        modeOfVisit,
        appointmentRepository,
        slotRepository
      );

      res.status(200).json({
        message: "Appointment rescheduled successfully",
        updatedAppointment,
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      res.status(500).json({ error: "Failed to cancel appointment." });
    }
  },

  getAllAppointmentsByAdmin: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { page, size, search } = req.query;

      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);
      const searchQuery = search ? String(search) : "";

      const appointmentRepository = createAppointmentRepository();

      const { appointments, totalAppointments, totalPages } =
        await listAllAppointmentsForAdmin(
          appointmentRepository,
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
      res
        .status(500)
        .json({ message: "Failed to fetch users", error: error.message });
    }
  },

  getAppointmentsByDoctorId: async (req: Request, res: Response) => {
    const { page, size, date, doctorId } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(size as string);

    const appointmentRepository = createAppointmentRepository();

    try {
      const { appointments, totalAppointments, totalPages } =
        await getAppointmentsByDoctorIdUseCase(
          appointmentRepository,
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
      res
        .status(500)
        .json({ message: "Failed to fetch users", error: error.message });
    }
  },

  updateAppointmentStatus: async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const { isCompleted } = req.body;

    try {
      const updatedAppointment = await updateAppointmentUseCase(
        appointmentRepository,
        appointmentId,
        isCompleted
      );

      res.status(200).json({
        message: "Appointment status updated successfully",
        updatedAppointment,
      });
    } catch (error: any) {
      console.error("Error updating appointment status:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  },
};
