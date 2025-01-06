import { Request, Response } from "express";
import { createSlotRepository } from "../../database/repositories/SlotRepository";
import { createAppointmentRepository } from "../../database/repositories/AppoinmentRepository";
import { createAppointmentUseCase } from "../../../application/useCases/user/CreateAppointmentUseCase ";
import { getAppointmentsByUserUseCase } from "../../../application/useCases/user/getAppointmentsByUserUseCase ";
import { cancelAppointmentByUserUsecase } from "../../../application/useCases/user/cancelAppointment";
import { listAllAppointmentsForAdmin } from "../../../application/useCases/admin/listAllAppointmentsForAdmin";
import { getAppointmentsByDoctorIdUseCase } from "../../../application/useCases/doctor/getAppointmentsByDoctorIdUseCase";

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
        const slotRepository = createSlotRepository();
        try {
            const updatedData = await cancelAppointmentByUserUsecase(appointmentId, appointmentRepository, slotRepository)
            res.status(200).json({message: "Appointment cancelled Successfully.", updatedData})
        } catch (error) {
            console.error("Error cancelling appointment:", error);            
            res.status(500).json({ error: "Failed to cancel appointment." });
        }
    },

    getAllAppointmentsByAdmin: async (req: Request, res: Response): Promise<void> => {
        try {
            const { page, size, search } = req.query;
            
            const pageNumber = parseInt(page as string);
            const pageSize = parseInt(size as string);
            const searchQuery = search ? String(search) : '';        
            
            const appointmentRepository = createAppointmentRepository();
    
            const { appointments, totalAppointments, totalPages } = await listAllAppointmentsForAdmin(appointmentRepository, pageNumber, pageSize, searchQuery);
            res.status(200).json({ appointments, totalAppointments, totalPages, currentPage: pageNumber });            
        } catch (error: any) {
            res.status(500).json({ message: "Failed to fetch users", error: error.message });
        }
    },

    getAppointmentsByDoctorId: async (req: Request, res: Response) => {
        const { page, size, date, doctorId } = req.query;
            
        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(size as string);

        const appointmentRepository = createAppointmentRepository();

        try {
            const { appointments, totalAppointments, totalPages } = await getAppointmentsByDoctorIdUseCase(
                appointmentRepository, 
                doctorId as string, 
                date as string, 
                pageNumber, 
                pageSize 
            )
            res.status(200).json({ appointments, totalAppointments, totalPages, currentPage: pageNumber });
        } catch (error: any) {
            res.status(500).json({ message: "Failed to fetch users", error: error.message });
        }


    }
    




}