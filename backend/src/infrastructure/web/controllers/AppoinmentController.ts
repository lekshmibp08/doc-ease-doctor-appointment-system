import { Request, Response } from "express";
import { createSlotRepository } from "../../database/repositories/SlotRepository";
import { createAppointmentRepository } from "../../database/repositories/AppoinmentRepository";
import { createAppointmentUseCase } from "../../../application/useCases/user/CreateAppointmentUseCase ";


type TimePeriod = "Morning" | "Afternoon" | "Evening";

export const appoinmentController = {
    createNewAppoinment: async (req: Request, res: Response): Promise<void> => { 
        const { time, modeOfVisit, amount, paymentId } = req.body;
       
        const doctorId = req.body.doctorId as string;
        const userId = req.body.userId as string;
        const date = req.body.date as string;
        const slotId = req.body.slotId as string;
        const timeSlotId = req.body.timeSlotId as string;

        console.log("APPOINMENT CONTR: ", req.body);
        

        const appointmentRepository = createAppointmentRepository();
        const slotRepository = createSlotRepository();
        try {
            const newAppoinment = await createAppointmentUseCase(
                appointmentRepository,
                slotRepository,
                {
                    doctorId,
                    userId,
                    date,
                    slotId,
                    timeSlotId,
                    time,
                    modeOfVisit,
                    amount,
                    paymentId,
                }
            )
            res.status(201).json({ message: "Appointment created successfully.", newAppoinment });
     
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create appointment." });
        }
    }, 




}