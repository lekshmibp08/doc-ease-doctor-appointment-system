import { Request, Response } from "express";
import { createSlotRepository } from "../../database/repositories/SlotRepository";
import { createAppointmentRepository } from "../../database/repositories/AppoinmentRepository";
import { createAppointmentUseCase } from "../../../application/useCases/user/CreateAppointmentUseCase ";
import { getAppointmentsByUserUseCase } from "../../../application/useCases/user/getAppointmentsByUserUseCase ";
import { cancelAppointmentByUserUsecase } from "../../../application/useCases/user/cancelAppointment";

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

    getAppointmentsByUser: async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.params;
        console.log("CONTROLLER USERID: ", req.params);
        
    
        const appointmentRepository = createAppointmentRepository();
        
        try {
            const appointments = await getAppointmentsByUserUseCase(userId as string, appointmentRepository);
            res.status(200).json({ appointments });
        } catch (error) {
            console.error("Error fetching user appointments:", error);
            res.status(500).json({ error: "Failed to fetch appointments." });
        }
    },
    
    cancelAppointmentByUser: async (req: Request, res: Response): Promise<void> => {
        const { appointmentId } = req.params;
        const appointmentRepository = createAppointmentRepository();
        try {
            const updatedData = await cancelAppointmentByUserUsecase(appointmentId, appointmentRepository)
            res.status(200).json({message: "Appointment cancelled Successfully.", updatedData})
        } catch (error) {
            console.error("Error cancelling appointment:", error);            
            res.status(500).json({ error: "Failed to cancel appointment." });
        }
    },
    




}