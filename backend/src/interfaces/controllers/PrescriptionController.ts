import { NextFunction, Request, Response } from "express";
import PrescriptionUseCase from "../../application/useCases/PrescriptionUseCase";
import { GetAppointmentsByIdUseCase } from "../../application/useCases/user/getAppointmentByIdUseCase";
import { AppointmentRepository } from "../../infrastructure/database/repositories/AppoinmentRepository";

const appointmentRepository = new AppointmentRepository();
const getAppointmentsByIdUseCase = new GetAppointmentsByIdUseCase(
  appointmentRepository
);

export const prescriptionController = {
  async createPrescription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const prescription = await PrescriptionUseCase.createPrescription(
        req.body
      );
      res.status(201).json(prescription);
    } catch (error: any) {
      next(error);
    }
  },

  async getPrescription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const prescription = await PrescriptionUseCase.getPrescription(
        req.params.appointmentId
      );
      if (prescription) {
        res.status(200).json({ prescription });
      } else {
        res.status(404).json({ error: "Prescription not found" });
      }
    } catch (error: any) {
      next(error);
    }
  },

  async updatePrescription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const prescriptionData = req.body.prescription;
    try {
      const prescription = await PrescriptionUseCase.UpdatePrescription(
        req.params.id,
        prescriptionData
      );
      if (prescription) {
        res.json(prescription);
      } else {
        res.status(404).json({ error: "Prescription not found" });
      }
    } catch (error: any) {
      next(error);
    }
  },

  async getPrescriptionForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const appointmentId = req.params.appointmentId;
    try {
      const prescription = await PrescriptionUseCase.getPrescription(
        appointmentId
      );
      if (!prescription) {
        res.status(404).json({ error: "Prescription not found" });
        return;
      }

      const appointment = await getAppointmentsByIdUseCase.execute(
        appointmentId
      );
      const doctor = appointment.doctorId;

      res.status(200).json({ prescription, doctor });
    } catch (error: any) {
      next(error);
    }
  },
};
