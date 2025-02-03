import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";

export const getAppointmentsByDoctorIdUseCase = async (
    appointmentRepository: IAppointmentRepository,
    doctorId: string,
    date: string,
    page: number,
    size: number
) => {
    console.log("USECASE DATE: ", date, doctorId, );
    
    // Create the start and end of the day range
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1); // Add 1 day to get the end of the current day

    const selectedDate = new Date(date as string);
    selectedDate.setHours(0, 0, 0, 0);
    
    const filter = {
      doctorId,
        date: { $gte: startOfDay, $lt: endOfDay }, // Date range filter
        //date: selectedDate,
    };
    
    const skip = (page - 1) * size;
    const limit = size;

    const { appointments, totalAppointments } = await appointmentRepository.getAppointmentsByDoctorId(
        filter, skip, limit
    );
    const totalPages = Math.ceil(totalAppointments / size);

    console.log(appointments);
    

    return {
        appointments,
        totalAppointments,
        totalPages
    };
}