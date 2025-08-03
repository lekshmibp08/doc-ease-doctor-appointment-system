import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export const toggleBlockDoctor = async (doctorRepository: IDoctorRepository, id: string) => {
    const doctor = await doctorRepository.findDoctorById(id);

    if (!doctor) {
        throw new Error('Doctor not found'); 
    }

    const updatedStatus = !doctor.isBlocked;

    await doctorRepository.updateDoctor(id, { isBlocked: updatedStatus})

    return {
        isBlocked: updatedStatus,
        message: `User has been ${updatedStatus ? 'Blocked' : 'Unblocked'} successfully`,
    };
}