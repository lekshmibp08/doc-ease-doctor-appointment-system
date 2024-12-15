import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export const toggleApproval = async (doctorRepository: IDoctorRepository, id: string) => {
    const doctor = await doctorRepository.findDoctorById(id);

    if (!doctor) {
        throw new Error('Doctor not found'); 
    }

    const updatedStatus = !doctor.isApproved;

    await doctorRepository.updateDoctor(id, { isApproved: updatedStatus})

    return {
        isApproved: updatedStatus,
        message: `Doctor has been ${updatedStatus ? 'approved' : 'blocked'} successfully`,
    };
}