import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { PrescriptionUseCase } from "../../application/useCases/implimentations/prescriptionUseCase";
import { GetAppointmentsByIdUseCase } from "../../application/useCases/implimentations/user/getAppointmentByIdUseCase";

export class PrescriptionController {
  constructor(
    private prescriptionUseCase: PrescriptionUseCase,
    private getAppointmentsByIdUseCase: GetAppointmentsByIdUseCase
  ) {}

  createPrescription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const prescription = await this.prescriptionUseCase.createPrescription(
        req.body
      );
      res.status(HttpStatusCode.CREATED).json(prescription);
    } catch (error) {
      next(error);
    }
  };

  getPrescription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const prescription = await this.prescriptionUseCase.getPrescription(
        req.params.appointmentId
      );
      if (prescription) {
        res.status(HttpStatusCode.OK).json({ prescription });
      } else {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ error: "Prescription not found" });
      }
    } catch (error) {
      next(error);
    }
  };

  updatePrescription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const prescriptionData = req.body.prescription;
    try {
      const prescription = await this.prescriptionUseCase.updatePrescription(
        req.params.id,
        prescriptionData
      );
      if (prescription) {
        res.json(prescription);
      } else {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ error: "Prescription not found" });
      }
    } catch (error) {
      next(error);
    }
  };

  getPrescriptionForUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const appointmentId = req.params.appointmentId;
    try {
      const prescription = await this.prescriptionUseCase.getPrescription(
        appointmentId
      );
      if (!prescription) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ error: "Prescription not found" });
        return;
      }

      const appointment = await this.getAppointmentsByIdUseCase.execute(
        appointmentId
      );
      const doctor = appointment.doctorId;

      res.status(HttpStatusCode.OK).json({ prescription, doctor });
    } catch (error) {
      next(error);
    }
  };
}
